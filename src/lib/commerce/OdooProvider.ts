import { CommerceProvider } from "./CommerceProvider";
import { Cart, Category, Customer, Order, Product, ProductFilters, Review } from "@/lib/types";

/**
 * OdooProvider — implementation stub.
 * Map product.template -> Product, product.product -> ProductVariant,
 * product.category -> Category, sale.order -> Cart/Order via Odoo JSON-RPC.
 */
export class OdooProvider implements CommerceProvider {
  async getProducts(_filters?: ProductFilters): Promise<Product[]> {
    throw new Error("Not implemented — search_read on product.template");
  }
  async getProduct(_slug: string): Promise<Product | null> {
    throw new Error("Not implemented");
  }
  async getCategories(): Promise<Category[]> {
    throw new Error("Not implemented — search_read product.category");
  }
  async getCategory(_slug: string): Promise<Category | null> {
    throw new Error("Not implemented");
  }
  async getReviews(_productId: string): Promise<Review[]> {
    throw new Error("Not implemented");
  }
  async searchProducts(_query: string): Promise<Product[]> {
    throw new Error("Not implemented");
  }
  async getCart(_cartId: string): Promise<Cart> {
    throw new Error("Not implemented — draft sale.order");
  }
  async addToCart(): Promise<Cart> {
    throw new Error("Not implemented");
  }
  async updateCartLine(): Promise<Cart> {
    throw new Error("Not implemented");
  }
  async removeFromCart(): Promise<Cart> {
    throw new Error("Not implemented");
  }
  async getCustomer(_customerId: string): Promise<Customer | null> {
    throw new Error("Not implemented — res.partner");
  }
  async createCheckout(_cart: Cart): Promise<{ checkoutUrl: string }> {
    throw new Error("Not implemented");
  }
  async createOrder(): Promise<Order> {
    throw new Error("Not implemented — action_confirm() on sale.order");
  }
}
