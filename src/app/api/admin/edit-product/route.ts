import { NextResponse } from "next/server";
import { getGithubFile, putGithubFile, uploadGithubImage } from "@/lib/admin/github";
import { buildProductEntry, insertProductEntry, removeProductEntry } from "@/lib/admin/productBlock";
import { parseProductInput, validateId } from "@/lib/admin/productInput";
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
    const input = parseProductInput(body, { editingId: id, requireImages: false });

    let imagePaths = input.existingImages;
    if (input.newImages.length > 0) {
      imagePaths = [];
      for (let i = 0; i < input.newImages.length; i++) {
        const fileName = `${id}-${i + 1}-${Date.now()}.jpg`;
        await uploadGithubImage(`public/uploads/${fileName}`, input.newImages[i].base64, `Update product photo for ${input.title}`);
        imagePaths.push(`/uploads/${fileName}`);
      }
    }

    const entry = buildProductEntry({ id, imagePaths, ...input });

    const { content, sha } = await getGithubFile(PRODUCTS_PATH);
    const updated = insertProductEntry(removeProductEntry(content, id), entry);
    await putGithubFile(PRODUCTS_PATH, updated, sha, `Edit product: ${input.title}`);

    return NextResponse.json({ success: true, message: "Product updated! It'll be live in about 2 minutes." }, { headers });
  } catch (err) {
    if (err instanceof ValidationError) return NextResponse.json({ error: err.message }, { status: 400, headers });
    console.error("edit-product failed:", err);
    return NextResponse.json({ error: "Couldn't save the product. Please try again." }, { status: 500, headers });
  }
}
