import { NextResponse } from "next/server";
import { getGithubFile, putGithubFile, uploadGithubImage } from "@/lib/admin/github";
import {
  buildProductEntry,
  insertProductEntry,
  removeProductEntry,
  parseVariants,
  parseFaqs,
  parseSpecs,
} from "@/lib/admin/productBlock";

const PRODUCTS_PATH = "src/data/products.ts";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      password,
      id,
      title,
      slug,
      descriptor,
      description,
      imageFiles,
      existingImages,
      category,
      currency,
      comparePrice,
      optionName,
      variants: variantsText,
      features,
      specifications,
      faqs: faqsText,
      shipping,
      badges,
    } = body;

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Wrong password." }, { status: 401 });
    }
    if (!id || !title || !slug || !variantsText) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const comparePriceNum = comparePrice ? Number(comparePrice) : undefined;
    const parsedVariants = parseVariants(variantsText, optionName, comparePriceNum);

    // New photos replace the old set entirely; otherwise keep what's already there.
    let imagePaths: string[] = existingImages || [];
    if (imageFiles && imageFiles.length > 0) {
      imagePaths = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const base64 = file.dataUrl.split(",")[1];
        const fileName = `${id}-${i + 1}-${Date.now()}.jpg`;
        const filePath = `public/uploads/${fileName}`;
        await uploadGithubImage(filePath, base64, `Update product photo for ${title}`);
        imagePaths.push(`/uploads/${fileName}`);
      }
    }

    const entry = buildProductEntry({
      id,
      title,
      slug,
      descriptor,
      description,
      imagePaths,
      category,
      currency,
      comparePrice: comparePriceNum,
      optionName,
      variants: parsedVariants,
      featureLines: (features || "").split("\n").map((l: string) => l.trim()).filter(Boolean),
      specLines: parseSpecs(specifications || ""),
      faqLines: parseFaqs(faqsText || ""),
      shipping,
      badges,
    });

    const { content, sha } = await getGithubFile(PRODUCTS_PATH);
    const withoutOld = removeProductEntry(content, id);
    const withNew = insertProductEntry(withoutOld, entry);
    await putGithubFile(PRODUCTS_PATH, withNew, sha, `Edit product: ${title}`);

    return NextResponse.json({ success: true, message: "Product updated! It'll be live in about 2 minutes." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Something went wrong." }, { status: 500 });
  }
}
