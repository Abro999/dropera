import { getAllProducts } from "@/data/products";
import { parseFaqs, parseSpecs, parseVariants, ParsedVariant } from "@/lib/admin/productBlock";
import {
  ValidationError,
  cleanNumber,
  cleanText,
  validateBadges,
  validateCategory,
  validateCurrency,
  validateExistingImages,
  validateId,
  validateImageUploads,
  validateLines,
  validateSlug,
} from "@/lib/security/validate";

export interface ProductInput {
  title: string;
  slug: string;
  descriptor: string;
  description: string;
  category: string;
  currency: string;
  comparePrice?: number;
  optionName: string;
  variants: ParsedVariant[];
  featureLines: string[];
  specLines: { label: string; value: string }[];
  faqLines: { question: string; answer: string }[];
  shipping: string;
  badges: string[];
  newImages: { base64: string }[];
  existingImages: string[];
}

export function parseProductInput(body: any, opts: { editingId?: string; requireImages: boolean }): ProductInput {
  const title = cleanText(body.title, 120, { min: 2, label: "Title" });
  const slug = validateSlug(body.slug);

  const clash = getAllProducts().find((p) => p.slug === slug && p.id !== opts.editingId);
  if (clash) throw new ValidationError("Another product already uses this slug.");

  const optionName = cleanText(body.optionName, 40, { label: "Option name" });
  const variantsText = validateLines(body.variants, 30, 160, "Variants");
  if (!variantsText) throw new ValidationError("Add at least one variant.");

  const comparePrice = body.comparePrice ? cleanNumber(body.comparePrice, { min: 1, max: 10_000_000, label: "Compare-at price" }) : undefined;
  const variants = parseVariants(variantsText, optionName, comparePrice).map((v) => ({
    ...v,
    title: cleanText(v.title, 80, { min: 1, label: "Variant name" }),
    price: cleanNumber(v.price, { min: 1, max: 10_000_000, label: "Variant price" }),
    inventory: cleanNumber(v.inventory, { min: 0, max: 100_000, integer: true, label: "Stock" }),
    supplierSku: v.supplierSku ? validateSupplierSku(v.supplierSku) : undefined,
  }));

  const newImages = validateImageUploads(body.imageFiles);
  const existingImages = validateExistingImages(body.existingImages);
  if (opts.requireImages && newImages.length === 0) throw new ValidationError("Please add at least one photo.");
  if (!opts.requireImages && newImages.length === 0 && existingImages.length === 0) {
    throw new ValidationError("A product needs at least one photo.");
  }

  const features = validateLines(body.features, 30, 300, "Features");
  const specifications = validateLines(body.specifications, 30, 300, "Specifications");
  const faqs = validateLines(body.faqs, 20, 800, "FAQs");

  return {
    title,
    slug,
    descriptor: cleanText(body.descriptor, 200, { label: "Descriptor" }),
    description: cleanText(body.description, 5000, { multiline: true, label: "Description" }),
    category: validateCategory(body.category),
    currency: validateCurrency(body.currency),
    comparePrice,
    optionName,
    variants,
    featureLines: features ? features.split("\n") : [],
    specLines: parseSpecs(specifications),
    faqLines: parseFaqs(faqs),
    shipping: cleanText(body.shipping, 200, { label: "Shipping note" }) || "Ships in 3-5 business days.",
    badges: validateBadges(body.badges),
    newImages,
    existingImages,
  };
}

function validateSupplierSku(value: string) {
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(value)) throw new ValidationError("Supplier SKU can only contain letters, numbers, - and _.");
  return value;
}

export { validateId };
