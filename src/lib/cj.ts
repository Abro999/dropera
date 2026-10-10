import { PricedLine } from "@/lib/checkout/pricing";
import { ShippingAddress } from "@/lib/types";

export type { ShippingAddress };

const CJ_BASE = "https://developers.cjdropshipping.com/api2.0/v1";

async function getCjAccessToken(): Promise<string> {
  const email = process.env.CJ_EMAIL;
  const apiKey = process.env.CJ_API_KEY;
  if (!email || !apiKey) {
    throw new Error("CJ Dropshipping isn't configured — set CJ_EMAIL and CJ_API_KEY.");
  }

  const res = await fetch(`${CJ_BASE}/authentication/getAccessToken`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, apiKey }),
    signal: AbortSignal.timeout(10_000),
  });
  const data = await res.json();
  if (!res.ok || !data.result) {
    throw new Error(data.message || "Couldn't authenticate with CJ Dropshipping.");
  }
  return data.data.accessToken as string;
}

export async function forwardOrderToCj(lines: PricedLine[], shipping: ShippingAddress, orderRef: string) {
  const products: { vid: string; quantity: number }[] = [];
  const skipped: string[] = [];

  for (const line of lines) {
    if (line.supplierSku) products.push({ vid: line.supplierSku, quantity: line.quantity });
    else skipped.push(line.productTitle);
  }

  if (products.length === 0) {
    return { forwarded: false, skipped, reason: "No items in this order are linked to a CJ product yet." };
  }

  const accessToken = await getCjAccessToken();

  const res = await fetch(`${CJ_BASE}/shopping/order/createOrderV2`, {
    method: "POST",
    headers: { "CJ-Access-Token": accessToken, "Content-Type": "application/json" },
    body: JSON.stringify({
      orderNumber: `dropera_${orderRef}`,
      shippingCustomerName: shipping.name,
      shippingPhone: shipping.phone,
      email: shipping.email || "",
      shippingAddress: shipping.address,
      shippingCity: shipping.city,
      shippingProvince: shipping.province,
      shippingZip: shipping.zip,
      shippingCountryCode: shipping.countryCode,
      shippingCountry: shipping.countryCode,
      payType: 3,
      products,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  const data = await res.json();
  if (!res.ok || !data.result) {
    throw new Error(data.message || "CJ Dropshipping rejected the order.");
  }

  return { forwarded: true, skipped, cjOrderId: data.data?.orderId };
}
