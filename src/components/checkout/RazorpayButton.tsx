"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cart } from "@/lib/types";
import { ShippingAddress } from "@/lib/cj";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useCart } from "@/context/CartContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-checkout-js")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-js";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function isAddressComplete(a: ShippingAddress) {
  return !!(a.name && a.phone && a.address && a.city && a.province && a.zip && a.countryCode);
}

export function RazorpayButton({ cart, shipping }: { cart: Cart; shipping: ShippingAddress }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const { show } = useToast();
  const { clearCart } = useCart();
  const router = useRouter();

  const startPayment = async () => {
    if (!cart || cart.lines.length === 0) return;
    if (!isAddressComplete(shipping)) {
      show("Please fill in your full delivery address first.");
      return;
    }
    setIsProcessing(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        show("Couldn't load payment gateway. Check your connection and try again.");
        setIsProcessing(false);
        return;
      }

      const orderRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        show(orderData.error ?? "Couldn't start checkout. Please try again.");
        setIsProcessing(false);
        return;
      }

      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: "DropEra",
        description: `${cart.lines.length} item${cart.lines.length > 1 ? "s" : ""}`,
        prefill: { name: shipping.name, contact: shipping.phone, email: shipping.email || "" },
        theme: { color: "#0B1530" },
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, cart, shipping }),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.valid) {
            if (verifyData.fulfillment?.forwarded) {
              show("Order placed and sent for fulfillment.");
            } else if (verifyData.fulfillment?.error) {
              show("Payment successful — fulfillment needs a manual check.");
            }
            clearCart();
            router.push(`/order-confirmed?payment_id=${response.razorpay_payment_id}`);
          } else {
            show("Payment could not be verified. If money was deducted, contact support.");
          }
        },
        modal: {
          ondismiss: () => setIsProcessing(false),
        },
      });

      razorpay.on("payment.failed", () => {
        show("Payment failed. Please try again.");
        setIsProcessing(false);
      });

      razorpay.open();
    } catch (err) {
      show("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <Button variant="primary" size="lg" onClick={startPayment} disabled={isProcessing}>
      {isProcessing ? "Opening secure checkout…" : "Proceed to checkout"}
    </Button>
  );
}
