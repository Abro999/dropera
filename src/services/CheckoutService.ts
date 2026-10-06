import { commerce } from "@/lib/commerce";
import { Cart } from "@/lib/types";

// Payment is handled by Razorpay (see components/checkout/RazorpayButton.tsx
// and app/api/checkout/*). This service is the hook for backends that provide
// their own hosted checkout URL (e.g. Shopify).
export const CheckoutService = {
  start: async (cart: Cart) => {
    const { checkoutUrl } = await commerce.createCheckout(cart);
    return checkoutUrl;
  },
};

export const PaymentService = {};
