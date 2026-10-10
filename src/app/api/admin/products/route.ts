import { NextResponse } from "next/server";
import { getAllProducts } from "@/data/products";
import { requireAdmin } from "@/lib/security/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const products = getAllProducts().map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    price: p.price,
    currency: p.currency,
    category: p.category,
    image: p.images[0]?.url ?? "",
  }));

  return NextResponse.json({ products }, { headers: { "Cache-Control": "no-store" } });
}
