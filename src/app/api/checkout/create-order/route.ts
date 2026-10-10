import { NextResponse } from "next/server";
import crypto from "crypto";
import { priceCart } from "@/lib/checkout/pricing";
import { razorpay } from "@/lib/checkout/razorpay";
import { clientIp, rateLimit } from "@/lib/security/rateLimit";
import { validateShipping, validationMessage, ValidationError } from "@/lib/security/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const json = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(req: Request) {
  const limit = rateLimit(`create-order:${clientIp(req)}`, 15, 10 * 60_000);
  if (!limit.ok) return json({ error: "Too many attempts. Please wait a few minutes." }, 429);

  try {
    const body = await req.json();
    const cart = priceCart(body?.lines);
    validateShipping(body?.shipping);

    const order = await razorpay.createOrder({
      amount: cart.amountMinor,
      currency: cart.currency,
      receipt: `dr_${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`,
      notes: { cart: cart.fingerprint },
    });

    return json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: razorpay.keyId() });
  } catch (err) {
    if (err instanceof ValidationError) return json({ error: err.message }, 400);
    console.error("create-order failed:", err);
    return json({ error: validationMessage(err, "Couldn't start checkout. Please try again.") }, 500);
  }
}
