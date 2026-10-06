import {
  Cart,
  Category,
  Customer,
  Order,
  Product,
  ProductFilters,
  Review,
} from "@/lib/types";

export interface CommerceProvider {
  getProducts(filters?: ProductFilters): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | null>;
  getCategories(): Promise<Category[]>;
  getCategory(slug: string): Promise<Category | null>;
  getReviews(productId: string): Promise<Review[]>;
  searchProducts(query: string): Promise<Product[]>;

  getCart(cartId: string): Promise<Cart>;
  addToCart(
    cartId: string,
    productId: string,
    variantId: string,
    quantity: number
  ): Promise<Cart>;
  updateCartLine(
    cartId: string,
    lineId: string,
    quantity: number
  ): Promise<Cart>;
  removeFromCart(cartId: string, lineId: string): Promise<Cart>;

  getCustomer(customerId: string): Promise<Customer | null>;
  createCheckout(cart: Cart): Promise<{ checkoutUrl: string }>;
  createOrder(cart: Cart, customer: Customer): Promise<Order>;
}
