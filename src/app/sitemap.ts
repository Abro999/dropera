import { MetadataRoute } from "next";
import { getAllProducts } from "@/data/products";
import { categories } from "@/data/categories";

const BASE_URL = "https://www.dropera.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/shop", "/about", "/contact", "/shipping", "/returns", "/privacy", "/terms"].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
  }));

  const categoryPages = categories.map((c) => ({
    url: `${BASE_URL}/category/${c.slug}`,
    lastModified: new Date(),
  }));

  const productPages = getAllProducts().map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
