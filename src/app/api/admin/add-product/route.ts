import { NextResponse } from "next/server";
import { getGithubFile, putGithubFile, uploadGithubImage } from "@/lib/admin/github";
import { buildProductEntry, insertProductEntry } from "@/lib/admin/productBlock";
import { parseProductInput } from "@/lib/admin/productInput";
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
    const input = parseProductInput(await req.json(), { requireImages: true });

    const id = `p-${Date.now()}`;
    const imagePaths: string[] = [];
    for (let i = 0; i < input.newImages.length; i++) {
      const fileName = `${id}-${i + 1}.jpg`;
      await uploadGithubImage(`public/uploads/${fileName}`, input.newImages[i].base64, `Add product photo for ${input.title}`);
      imagePaths.push(`/uploads/${fileName}`);
    }

    const entry = buildProductEntry({ id, imagePaths, ...input });

    const { content, sha } = await getGithubFile(PRODUCTS_PATH);
    await putGithubFile(PRODUCTS_PATH, insertProductEntry(content, entry), sha, `Add product: ${input.title}`);

    return NextResponse.json({ success: true, message: "Product added! It'll be live on the site in about 2 minutes." }, { headers });
  } catch (err) {
    if (err instanceof ValidationError) return NextResponse.json({ error: err.message }, { status: 400, headers });
    console.error("add-product failed:", err);
    return NextResponse.json({ error: "Couldn't save the product. Please try again." }, { status: 500, headers });
  }
}
