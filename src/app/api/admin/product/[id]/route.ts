import { NextResponse } from "next/server";
import { getAllProducts } from "@/data/products";
import { requireAdmin } from "@/lib/security/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const product = getAllProducts().find((p) => p.id === params.id);
  if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

  return NextResponse.json({ product }, { headers: { "Cache-Control": "no-store" } });
}
