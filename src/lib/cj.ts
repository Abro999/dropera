import { Cart } from "@/lib/types";
import { getAllProducts } from "@/data/products";

export interface ShippingAddress {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  province: string;
  zip: string;
  countryCode: string;
}

// CJ Dropshipping access tokens are cached server-side for 24h on their end,
// so it's safe (and avoids needing our own persistent storage) to just
// request a fresh one before each order — CJ returns the same cached token
// if we've already asked for one recently.
async function getCjAccessToken(): Promise<string> {
  const email = process.env.CJ_EMAIL;
  const apiKey = process.env.CJ_API_KEY;
  if (!email || !apiKey) {
    throw new Error("CJ Dropshipping isn't configured — set CJ_EMAIL and CJ_API_KEY.");
  }

  const res = await fetch("https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, apiKey }),
  });
  const data = await res.json();
  if (!res.ok || !data.result) {
    throw new Error(data.message || "Couldn't authenticate with CJ Dropshipping.");
  }
  return data.data.accessToken as string;
}

// Forwards a paid cart to CJ Dropshipping for fulfillment. Only lines whose
// variant has a `supplierSku` set (mapped in the admin product form) are
// sent — anything without one is skipped and reported back, since CJ has
// no way to fulfill a product it doesn't recognize.
export async function forwardOrderToCj(cart: Cart, shipping: ShippingAddress) {
  const allProducts = getAllProducts();

  const products: { vid?: string; sku?: string; quantity: number }[] = [];
  const skipped: string[] = [];

  for (const line of cart.lines) {
    const product = allProducts.find((p) => p.id === line.productId);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    if (variant?.supplierSku) {
      products.push({ vid: variant.supplierSku, quantity: line.quantity });
    } else {
      skipped.push(line.productTitle);
    }
  }

  if (products.length === 0) {
    return { forwarded: false, skipped, reason: "No items in this order are linked to a CJ product yet." };
  }

  const accessToken = await getCjAccessToken();

  const res = await fetch("https://developers.cjdropshipping.com/api2.0/v1/shopping/order/createOrderV2", {
    method: "POST",
    headers: {
      "CJ-Access-Token": accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderNumber: `dropera_${cart.id}_${Date.now()}`,
      shippingCustomerName: shipping.name,
      shippingPhone: shipping.phone,
      email: shipping.email || "",
      shippingAddress: shipping.address,
      shippingCity: shipping.city,
      shippingProvince: shipping.province,
      shippingZip: shipping.zip,
      shippingCountryCode: shipping.countryCode,
      shippingCountry: shipping.countryCode,
      payType: 3, // create the order only, we handle payment ourselves via Razorpay
      products,
    }),
  });

  const data = await res.json();
  if (!res.ok || !data.result) {
    throw new Error(data.message || "CJ Dropshipping rejected the order.");
  }

  return { forwarded: true, skipped, cjOrderId: data.data?.orderId };
}
