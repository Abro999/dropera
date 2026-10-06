import { NextResponse } from "next/server";
import crypto from "crypto";
import { forwardOrderToCj } from "@/lib/cj";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart, shipping } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json({ valid: false, error: "Razorpay not configured" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json({ valid: false });
    }

    // Payment is confirmed at this point. Try to forward the order to CJ
    // Dropshipping for fulfillment — if this fails for any reason, we still
    // report the payment as valid (the customer has paid) and just flag the
    // fulfillment issue separately so it can be handled manually.
    let fulfillment: { forwarded: boolean; skipped?: string[]; reason?: string; error?: string } = {
      forwarded: false,
    };

    if (cart && shipping) {
      try {
        const result = await forwardOrderToCj(cart, shipping);
        fulfillment = result;
      } catch (err: any) {
        fulfillment = { forwarded: false, error: err.message || "Couldn't forward the order to CJ Dropshipping." };
      }
    }

    return NextResponse.json({ valid: true, fulfillment });
  } catch (err) {
    return NextResponse.json({ valid: false, error: "Verification failed" }, { status: 500 });
  }
}
