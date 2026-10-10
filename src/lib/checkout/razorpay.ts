const API = "https://api.razorpay.com/v1";

function authHeader() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay isn't configured.");
  return { keyId, keySecret, header: `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}` };
}

async function call(path: string, init: RequestInit = {}) {
  const { header } = authHeader();
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: header, ...(init.headers ?? {}) },
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.description ?? "Razorpay request failed.");
  return data;
}

export const razorpay = {
  keyId: () => authHeader().keyId,
  keySecret: () => authHeader().keySecret,
  createOrder: (body: Record<string, unknown>) => call("/orders", { method: "POST", body: JSON.stringify(body) }),
  getOrder: (id: string) => call(`/orders/${encodeURIComponent(id)}`),
  getPayment: (id: string) => call(`/payments/${encodeURIComponent(id)}`),
  setOrderNotes: (id: string, notes: Record<string, string>) =>
    call(`/orders/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify({ notes }) }),
};
