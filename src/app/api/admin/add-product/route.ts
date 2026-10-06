import { NextResponse } from "next/server";
import { getGithubFile, putGithubFile, uploadGithubImage } from "@/lib/admin/github";
import {
  buildProductEntry,
  insertProductEntry,
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
      title,
      slug,
      descriptor,
      description,
      imageFiles,
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
    if (!title || !slug || !imageFiles?.length || !variantsText) {
      return NextResponse.json({ error: "Please fill in title, slug, at least one photo and a variant." }, { status: 400 });
    }

    const id = `p-${Date.now()}`;
    const comparePriceNum = comparePrice ? Number(comparePrice) : undefined;
    const parsedVariants = parseVariants(variantsText, optionName, comparePriceNum);

    const imagePaths: string[] = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const base64 = file.dataUrl.split(",")[1];
      const fileName = `${id}-${i + 1}.jpg`;
      const filePath = `public/uploads/${fileName}`;
      await uploadGithubImage(filePath, base64, `Add product photo for ${title}`);
      imagePaths.push(`/uploads/${fileName}`);
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
    const newContent = insertProductEntry(content, entry);
    await putGithubFile(PRODUCTS_PATH, newContent, sha, `Add product: ${title}`);

    return NextResponse.json({ success: true, message: "Product added! It'll be live on the site in about 2 minutes." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Something went wrong. Please try again." }, { status: 500 });
  }
}
