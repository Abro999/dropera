import { NextResponse } from "next/server";
import { getGithubFile, putGithubFile } from "@/lib/admin/github";
import { removeProductEntry } from "@/lib/admin/productBlock";
import { validateId } from "@/lib/admin/productInput";
import { requireAdmin } from "@/lib/security/auth";
import { clientIp, rateLimit } from "@/lib/security/rateLimit";
import { ValidationError } from "@/lib/security/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCTS_PATH = "src/data/products.ts";
const headers = { "Cache-Control": "no-store" };

export async function POST(req: Request) {
  const denied = requireAdmin(req, { mutating: true });
  if (denied) return denied;

  const limit = rateLimit(`admin-write:${clientIp(req)}`, 30, 10 * 60_000);
  if (!limit.ok) return NextResponse.json({ error: "Too many requests. Slow down a little." }, { status: 429, headers });

  try {
    const body = await req.json();
    const id = validateId(body.id);

    const { content, sha } = await getGithubFile(PRODUCTS_PATH);
    await putGithubFile(PRODUCTS_PATH, removeProductEntry(content, id), sha, `Delete product: ${id}`);

    return NextResponse.json({ success: true, message: "Product deleted. It'll disappear from the site in about 2 minutes." }, { headers });
  } catch (err) {
    if (err instanceof ValidationError) return NextResponse.json({ error: err.message }, { status: 400, headers });
    console.error("delete-product failed:", err);
    return NextResponse.json({ error: "Couldn't delete the product. Please try again." }, { status: 500, headers });
  }
}
