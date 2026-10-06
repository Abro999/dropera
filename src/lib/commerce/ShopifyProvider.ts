import { CommerceProvider } from "./CommerceProvider";
import { Cart, Category, Customer, Order, Product, ProductFilters, Review } from "@/lib/types";

/**
 * ShopifyProvider — implementation stub.
 * When ready: set COMMERCE_PROVIDER=shopify plus SHOPIFY_STORE_DOMAIN and
 * SHOPIFY_STOREFRONT_TOKEN, then implement each method against the
 * Shopify Storefront GraphQL API, mapping results onto src/lib/types.ts.
 */
export class ShopifyProvider implements CommerceProvider {
  async getProducts(_filters?: ProductFilters): Promise<Product[]> {
    throw new Error("Not implemented — map Shopify `products` query to Product[]");
  }
  async getProduct(_slug: string): Promise<Product | null> {
    throw new Error("Not implemented — map Shopify `productByHandle` to Product");
  }
  async getCategories(): Promise<Category[]> {
    throw new Error("Not implemented — map Shopify `collections` to Category[]");
  }
  async getCategory(_slug: string): Promise<Category | null> {
    throw new Error("Not implemented — map Shopify `collectionByHandle` to Category");
  }
  async getReviews(_productId: string): Promise<Review[]> {
    throw new Error("Not implemented — use a reviews app's metafields or API");
  }
  async searchProducts(_query: string): Promise<Product[]> {
    throw new Error("Not implemented — Shopify `search` query");
  }
  async getCart(_cartId: string): Promise<Cart> {
    throw new Error("Not implemented — Shopify `cart` query");
  }
  async addToCart(): Promise<Cart> {
    throw new Error("Not implemented — Shopify `cartLinesAdd` mutation");
  }
  async updateCartLine(): Promise<Cart> {
    throw new Error("Not implemented — Shopify `cartLinesUpdate` mutation");
  }
  async removeFromCart(): Promise<Cart> {
    throw new Error("Not implemented — Shopify `cartLinesRemove` mutation");
  }
  async getCustomer(_customerId: string): Promise<Customer | null> {
    throw new Error("Not implemented — Shopify Customer Account API");
  }
  async createCheckout(_cart: Cart): Promise<{ checkoutUrl: string }> {
    throw new Error("Not implemented — return the cart's checkoutUrl");
  }
  async createOrder(): Promise<Order> {
    throw new Error("Not applicable — Shopify creates the order via its hosted checkout");
  }
}
