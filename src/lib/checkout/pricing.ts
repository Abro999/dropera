import crypto from "crypto";
import { getAllProducts } from "@/data/products";
import { ValidationError } from "@/lib/security/validate";

export interface PricedLine {
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  productTitle: string;
  variantTitle: string;
  supplierSku?: string;
}

export interface PricedCart {
  lines: PricedLine[];
  currency: string;
  amountMinor: number;
  fingerprint: string;
}

const MAX_LINES = 30;
const MAX_QTY = 10;

export function priceCart(input: unknown): PricedCart {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_LINES) {
    throw new ValidationError("Your bag is empty or invalid.");
  }

  const products = getAllProducts();
  const merged = new Map<string, PricedLine>();
  let currency = "";

  for (const raw of input) {
    const line = raw as { productId?: unknown; variantId?: unknown; quantity?: unknown };
    if (typeof line?.productId !== "string" || typeof line?.variantId !== "string") {
      throw new ValidationError("Your bag contains an invalid item.");
    }
    const quantity = Number(line.quantity);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QTY) {
      throw new ValidationError(`Quantity must be between 1 and ${MAX_QTY}.`);
    }

    const product = products.find((p) => p.id === line.productId);
    const variant = product?.variants.find((v) => v.id === line.variantId);
    if (!product || !variant) throw new ValidationError("An item in your bag is no longer available.");

    if (currency && currency !== product.currency) {
      throw new ValidationError("Items in different currencies can't be bought together.");
    }
    currency = product.currency;

    const existing = merged.get(variant.id);
    const total = (existing?.quantity ?? 0) + quantity;
    if (total > MAX_QTY) throw new ValidationError(`You can buy up to ${MAX_QTY} of an item.`);

    merged.set(variant.id, {
      productId: product.id,
      variantId: variant.id,
      quantity: total,
      unitPrice: variant.price,
      productTitle: product.title,
      variantTitle: variant.title,
      supplierSku: variant.supplierSku,
    });
  }

  const lines = Array.from(merged.values());
  const amountMinor = lines.reduce((sum, l) => sum + Math.round(l.unitPrice * 100) * l.quantity, 0);
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 100) throw new ValidationError("Order total is invalid.");

  const fingerprint = crypto
    .createHash("sha256")
    .update(
      lines
        .map((l) => `${l.variantId}:${l.quantity}`)
        .sort()
        .join("|")
    )
    .digest("hex")
    .slice(0, 32);

  return { lines, currency, amountMinor, fingerprint };
}
