import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import { ShippingAddress } from "@/lib/types";

export const CATEGORIES = ["tech", "home", "fashion", "accessories", "outdoor"];
export const BADGES = ["new", "bestseller", "limited", "low-stock"] as const;

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export class ValidationError extends Error {}

export function cleanText(value: unknown, max: number, opts: { min?: number; multiline?: boolean; label?: string } = {}): string {
  const label = opts.label ?? "Field";
  if (value === undefined || value === null) value = "";
  if (typeof value !== "string") throw new ValidationError(`${label} is invalid.`);
  let text = value.replace(CONTROL_CHARS, "").trim();
  if (!opts.multiline) text = text.replace(/\s+/g, " ");
  if (text.length < (opts.min ?? 0)) throw new ValidationError(`${label} is too short.`);
  if (text.length > max) throw new ValidationError(`${label} is too long (max ${max} characters).`);
  return text;
}

export function cleanNumber(value: unknown, opts: { min: number; max: number; integer?: boolean; label: string }): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < opts.min || n > opts.max || (opts.integer && !Number.isInteger(n))) {
    throw new ValidationError(`${opts.label} must be between ${opts.min} and ${opts.max}.`);
  }
  return n;
}

export function validateId(value: unknown): string {
  if (typeof value !== "string" || !/^[A-Za-z0-9_-]{1,48}$/.test(value)) throw new ValidationError("Invalid product id.");
  return value;
}

export function validateSlug(value: unknown): string {
  const slug = cleanText(value, 80, { min: 2, label: "Slug" }).toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new ValidationError("Slug can only contain lowercase letters, numbers and hyphens.");
  }
  return slug;
}

export function validateCategory(value: unknown): string {
  if (typeof value !== "string" || !CATEGORIES.includes(value)) throw new ValidationError("Invalid category.");
  return value;
}

export function validateCurrency(value: unknown): string {
  if (typeof value !== "string" || !SUPPORTED_CURRENCIES.includes(value)) throw new ValidationError("Unsupported currency.");
  return value;
}

export function validateBadges(value: unknown): string[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > BADGES.length) throw new ValidationError("Invalid badges.");
  const badges = value.filter((b): b is string => typeof b === "string");
  if (badges.some((b) => !(BADGES as readonly string[]).includes(b))) throw new ValidationError("Invalid badges.");
  return Array.from(new Set(badges));
}

export function validateLines(value: unknown, max: number, lineMax: number, label: string): string {
  const text = cleanText(value, max * lineMax, { multiline: true, label });
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length > max) throw new ValidationError(`${label} has too many lines (max ${max}).`);
  if (lines.some((l) => l.length > lineMax)) throw new ValidationError(`A line in ${label} is too long.`);
  return lines.join("\n");
}

const ALLOWED_IMAGE_HOSTS = ["images.unsplash.com", "cdn.shopify.com", "i.imgur.com"];

export function validateExistingImages(value: unknown): string[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > 12) throw new ValidationError("Invalid photo list.");
  return value.map((url) => {
    if (typeof url !== "string" || url.length > 400) throw new ValidationError("Invalid photo URL.");
    if (/^\/uploads\/[A-Za-z0-9._-]+\.jpg$/.test(url)) return url;
    try {
      const parsed = new URL(url);
      if (parsed.protocol === "https:" && ALLOWED_IMAGE_HOSTS.includes(parsed.hostname)) return url;
    } catch {}
    throw new ValidationError("Invalid photo URL.");
  });
}

const MAX_IMAGE_BYTES = 1_500_000;

export function validateImageUploads(value: unknown, max = 8): { base64: string }[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value) || value.length > max) throw new ValidationError(`You can upload up to ${max} photos.`);
  return value.map((file) => {
    const dataUrl = file && typeof file === "object" ? (file as { dataUrl?: unknown }).dataUrl : undefined;
    const match = typeof dataUrl === "string" ? /^data:image\/jpeg;base64,([A-Za-z0-9+/]+={0,2})$/.exec(dataUrl) : null;
    if (!match) throw new ValidationError("Photos must be JPEG images.");
    const bytes = Buffer.from(match[1], "base64");
    if (bytes.length === 0 || bytes.length > MAX_IMAGE_BYTES) throw new ValidationError("A photo is too large (max 1.5 MB after compression).");
    if (!(bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)) throw new ValidationError("Photos must be real JPEG images.");
    return { base64: match[1] };
  });
}

export function validateShipping(input: unknown): ShippingAddress {
  if (!input || typeof input !== "object") throw new ValidationError("Delivery address is missing.");
  const a = input as Record<string, unknown>;
  const phone = cleanText(a.phone, 20, { min: 7, label: "Phone number" });
  if (!/^\+?[0-9\s-]{7,20}$/.test(phone)) throw new ValidationError("Phone number looks invalid.");
  const email = cleanText(a.email, 120, { label: "Email" });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) throw new ValidationError("Email looks invalid.");
  const zip = cleanText(a.zip, 12, { min: 3, label: "PIN / ZIP code" });
  if (!/^[A-Za-z0-9 -]{3,12}$/.test(zip)) throw new ValidationError("PIN / ZIP code looks invalid.");
  const countryCode = cleanText(a.countryCode, 2, { min: 2, label: "Country code" }).toUpperCase();
  if (!/^[A-Z]{2}$/.test(countryCode)) throw new ValidationError("Country code must be 2 letters, e.g. IN.");

  return {
    name: cleanText(a.name, 80, { min: 2, label: "Name" }),
    phone,
    email: email || undefined,
    address: cleanText(a.address, 200, { min: 5, label: "Address" }),
    city: cleanText(a.city, 80, { min: 2, label: "City" }),
    province: cleanText(a.province, 80, { min: 2, label: "State" }),
    zip,
    countryCode,
  };
}

export function validationMessage(err: unknown, fallback = "Something went wrong. Please try again.") {
  return err instanceof ValidationError ? err.message : fallback;
}

export { SUPPORTED_CURRENCIES };
