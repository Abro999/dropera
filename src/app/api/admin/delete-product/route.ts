import { NextResponse } from "next/server";
import { getGithubFile, putGithubFile } from "@/lib/admin/github";
import { removeProductEntry } from "@/lib/admin/productBlock";

const PRODUCTS_PATH = "src/data/products.ts";

export async function POST(req: Request) {
  try {
    const { password, id, title } = await req.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Wrong password." }, { status: 401 });
    }
    if (!id) {
      return NextResponse.json({ error: "Missing product id." }, { status: 400 });
    }

    const { content, sha } = await getGithubFile(PRODUCTS_PATH);
    const updated = removeProductEntry(content, id);
    await putGithubFile(PRODUCTS_PATH, updated, sha, `Delete product: ${title || id}`);

    return NextResponse.json({ success: true, message: "Product deleted. It'll disappear from the site in about 2 minutes." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Something went wrong." }, { status: 500 });
  }
}
