export interface Money {
  amount: number;
  currency: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  inventory: number;
  image?: string;
  options: Record<string, string>;
  // Maps this variant to a fulfillment supplier's own variant id/SKU
  // (e.g. a CJ Dropshipping "vid"), used for auto order forwarding.
  supplierSku?: string;
}

export interface Specification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  descriptor: string;
  description: string;
  images: ProductImage[];
  price: number;
  compareAtPrice?: number;
  currency: string;
  variants: ProductVariant[];
  options: ProductOption[];
  inventory: number;
  rating: number;
  reviewCount: number;
  category: string;
  tags: string[];
  badges?: ("new" | "bestseller" | "limited" | "low-stock")[];
  shipping: string;
  specifications: Specification[];
  features: string[];
  faqs: { question: string; answer: string }[];
}

export interface Category {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  photo?: string;
  date: string;
}

export interface CartLine {
  id: string;
  productId: string;
  variantId: string;
  productTitle: string;
  variantTitle: string;
  image: string;
  price: number;
  quantity: number;
  slug: string;
}

export interface Cart {
  id: string;
  lines: CartLine[];
  subtotal: number;
  currency: string;
}

export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface Order {
  id: string;
  lines: CartLine[];
  total: number;
  currency: string;
  status: "pending" | "paid" | "fulfilled" | "cancelled";
}

export interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  sort?: "featured" | "price-asc" | "price-desc" | "rating" | "newest";
}

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
