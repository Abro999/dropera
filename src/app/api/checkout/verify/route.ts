import { NextResponse } from "next/server";
import crypto from "crypto";
import { forwardOrderToCj } from "@/lib/cj";
import { priceCart } from "@/lib/checkout/pricing";
import { razorpay } from "@/lib/checkout/razorpay";
import { clientIp, rateLimit } from "@/lib/security/rateLimit";
import { validateShipping, ValidationError } from "@/lib/security/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
const handled = new Set<string>();

function signatureMatches(orderId: string, paymentId: string, signature: string) {
  const expected = crypto.createHmac("sha256", razorpay.keySecret()).update(`${orderId}|${paymentId}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const limit = rateLimit(`verify:${clientIp(req)}`, 30, 10 * 60_000);
  if (!limit.ok) return json({ valid: false, error: "Too many attempts." }, 429);

  try {
    const body = await req.json();
    const orderId = body?.razorpay_order_id;
    const paymentId = body?.razorpay_payment_id;
    const signature = body?.razorpay_signature;

    if (
      typeof orderId !== "string" || !/^order_[A-Za-z0-9]{6,40}$/.test(orderId) ||
      typeof paymentId !== "string" || !/^pay_[A-Za-z0-9]{6,40}$/.test(paymentId) ||
      typeof signature !== "string" || !/^[a-f0-9]{64}$/.test(signature)
    ) {
      return json({ valid: false }, 400);
    }

    if (!signatureMatches(orderId, paymentId, signature)) return json({ valid: false });

    const [order, payment] = await Promise.all([razorpay.getOrder(orderId), razorpay.getPayment(paymentId)]);

    const paymentOk =
      payment.order_id === order.id &&
      payment.amount === order.amount &&
      payment.currency === order.currency &&
      (payment.status === "captured" || payment.status === "authorized");
    if (!paymentOk) return json({ valid: false });

    const cart = priceCart(body?.lines);
    const shipping = validateShipping(body?.shipping);

    if (cart.amountMinor !== order.amount || cart.currency !== order.currency || cart.fingerprint !== order.notes?.cart) {
      console.error("verify: cart does not match paid order", orderId);
      return json({ valid: false });
    }

    if (order.notes?.fulfilled === "1" || handled.has(orderId)) {
      return json({ valid: true, fulfillment: { forwarded: false, reason: "already processed" } });
    }
    handled.add(orderId);

    let fulfillment: { forwarded: boolean; skipped?: string[]; reason?: string; error?: string } = { forwarded: false };
    try {
      await razorpay.setOrderNotes(orderId, { cart: cart.fingerprint, fulfilled: "1" });
      fulfillment = await forwardOrderToCj(cart.lines, shipping, orderId);
    } catch (err) {
      console.error("fulfillment failed for", orderId, err);
      fulfillment = { forwarded: false, error: "Couldn't forward the order for fulfillment." };
    }

    return json({ valid: true, fulfillment });
  } catch (err) {
    if (err instanceof ValidationError) return json({ valid: false, error: err.message }, 400);
    console.error("verify failed:", err);
    return json({ valid: false, error: "Verification failed" }, 500);
  }
}
