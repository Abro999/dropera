export interface ParsedVariant {
  title: string;
  price: number;
  compareAtPrice?: number;
  inventory: number;
  supplierSku?: string;
  options: Record<string, string>;
}

// Variant line format: Value | Price | Stock | SupplierSKU(optional)
export function parseVariants(text: string, optionName: string, comparePrice?: number): ParsedVariant[] {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  return lines.map((line) => {
    const parts = line.split("|").map((p) => p.trim());
    const value = parts[0] || "Default";
    const price = Number(parts[1]) || 0;
    const stock = Number(parts[2]) || 0;
    const supplierSku = parts[3] || undefined;
    return {
      title: value,
      price,
      compareAtPrice: comparePrice,
      inventory: stock,
      supplierSku,
      options: optionName ? { [optionName]: value } : {},
    };
  });
}

export function variantsToText(variants: ParsedVariant[]): string {
  return variants
    .map((v) => [v.title, v.price, v.inventory, v.supplierSku || ""].join(" | "))
    .join("\n");
}

export function parseFaqs(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf("|");
      return idx === -1
        ? { question: line, answer: "" }
        : { question: line.slice(0, idx).trim(), answer: line.slice(idx + 1).trim() };
    });
}

export function faqsToText(faqs: { question: string; answer: string }[]): string {
  return faqs.map((f) => `${f.question} | ${f.answer}`).join("\n");
}

export function parseSpecs(text: string) {
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf(":");
      return idx === -1
        ? { label: line, value: "" }
        : { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() };
    });
}

export function specsToText(specs: { label: string; value: string }[]): string {
  return specs.map((s) => `${s.label}: ${s.value}`).join("\n");
}

export interface ProductEntryInput {
  id: string;
  title: string;
  slug: string;
  descriptor: string;
  description: string;
  imagePaths: string[];
  category: string;
  currency: string;
  comparePrice?: number;
  optionName: string;
  variants: ParsedVariant[];
  featureLines: string[];
  specLines: { label: string; value: string }[];
  faqLines: { question: string; answer: string }[];
  shipping: string;
  badges?: string[];
}

export function buildProductEntry(input: ProductEntryInput): string {
  const basePrice = input.variants[0]?.price ?? 0;
  const totalInventory = input.variants.reduce((sum, v) => sum + v.inventory, 0);

  const imagesCode = input.imagePaths
    .map(
      (url, i) =>
        `      { id: ${JSON.stringify(input.id + "-img" + (i + 1))}, url: ${JSON.stringify(url)}, alt: ${JSON.stringify(input.title)} },`
    )
    .join("\n");

  const variantsCode = input.variants
    .map(
      (v, i) =>
        `      { id: ${JSON.stringify(input.id + "-v" + (i + 1))}, title: ${JSON.stringify(v.title)}, price: ${v.price}${
          v.compareAtPrice ? `, compareAtPrice: ${v.compareAtPrice}` : ""
        }, sku: ${JSON.stringify(input.id.toUpperCase() + "-" + (i + 1))}, inventory: ${v.inventory}, options: ${JSON.stringify(
          v.options
        )}${v.supplierSku ? `, supplierSku: ${JSON.stringify(v.supplierSku)}` : ""} },`
    )
    .join("\n");

  const optionsCode = input.optionName
    ? `[{ name: ${JSON.stringify(input.optionName)}, values: ${JSON.stringify(input.variants.map((v) => v.title))} }]`
    : "[]";

  const badgesCode = input.badges && input.badges.length ? JSON.stringify(input.badges) : "undefined";

  return `
  {
    id: ${JSON.stringify(input.id)},
    slug: ${JSON.stringify(input.slug)},
    title: ${JSON.stringify(input.title)},
    descriptor: ${JSON.stringify(input.descriptor || "")},
    description: ${JSON.stringify(input.description || "")},
    images: [
${imagesCode}
    ],
    price: ${basePrice},
    ${input.comparePrice ? `compareAtPrice: ${input.comparePrice},` : ""}
    currency: ${JSON.stringify(input.currency || "INR")},
    variants: [
${variantsCode}
    ],
    options: ${optionsCode},
    inventory: ${totalInventory},
    rating: 4.5,
    reviewCount: 0,
    category: ${JSON.stringify(input.category)},
    tags: ["new"],
    badges: ${badgesCode},
    shipping: ${JSON.stringify(input.shipping || "Ships in 3-5 business days.")},
    specifications: ${JSON.stringify(input.specLines)},
    features: ${JSON.stringify(input.featureLines)},
    faqs: ${JSON.stringify(input.faqLines)},
  },`;
}

export function insertProductEntry(content: string, entry: string): string {
  const MARKER = "export const products: Product[] = [";
  const idx = content.indexOf(MARKER);
  if (idx === -1) throw new Error("Couldn't find the products list in the file.");
  const insertPos = idx + MARKER.length;
  return content.slice(0, insertPos) + entry + content.slice(insertPos);
}

export function removeProductEntry(content: string, id: string): string {
  const regex = new RegExp(`\\n\\s*\\{\\s*\\n\\s*id: ${JSON.stringify(id)},[\\s\\S]*?\\n  \\},`, "m");
  if (!regex.test(content)) {
    throw new Error("Couldn't find that product in the file — it may have already been removed.");
  }
  return content.replace(regex, "");
}
