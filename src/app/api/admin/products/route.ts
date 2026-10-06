import { NextResponse } from "next/server";
import { getAllProducts } from "@/data/products";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const password = searchParams.get("password");
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const products = getAllProducts().map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    price: p.price,
    currency: p.currency,
    category: p.category,
    image: p.images[0]?.url ?? "",
  }));

  return NextResponse.json({ products });
}
