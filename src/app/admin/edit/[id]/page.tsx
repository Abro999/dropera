"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Product } from "@/lib/types";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";

const CATEGORIES = ["tech", "home", "fashion", "accessories", "outdoor"];

function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas not supported"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminEditProductPage({ params, searchParams }: { params: { id: string }; searchParams: { password?: string } }) {
  const router = useRouter();
  const [password, setPassword] = useState(searchParams.password || "");
  const [loaded, setLoaded] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<{ name: string; dataUrl: string }[]>([]);
  const [badges, setBadges] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    descriptor: "",
    description: "",
    category: "tech",
    currency: "INR",
    comparePrice: "",
    optionName: "",
    variants: "",
    features: "",
    specifications: "",
    faqs: "",
    shipping: "",
  });
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message?: string }>({ type: "idle" });

  useEffect(() => {
    if (!password) return;
    (async () => {
      const res = await fetch(`/api/admin/product/${params.id}?password=${encodeURIComponent(password)}`);
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: data.error || "Couldn't load this product." });
        return;
      }
      const product: Product = data.product;
      setExistingImages(product.images.map((i) => i.url));
      setBadges(product.badges || []);
      setForm({
        title: product.title,
        slug: product.slug,
        descriptor: product.descriptor,
        description: product.description,
        category: product.category,
        currency: product.currency,
        comparePrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
        optionName: product.options[0]?.name || "",
        variants: product.variants.map((v) => [v.title, v.price, v.inventory, v.supplierSku || ""].join(" | ")).join("\n"),
        features: product.features.join("\n"),
        specifications: product.specifications.map((s) => `${s.label}: ${s.value}`).join("\n"),
        faqs: product.faqs.map((f) => `${f.question} | ${f.answer}`).join("\n"),
        shipping: product.shipping,
      });
      setLoaded(true);
    })();
  }, [password, params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const toggleBadge = (b: string) => {
    setBadges((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]));
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const compressed = await Promise.all(files.map(async (file, i) => ({ name: `img${Date.now()}_${i}.jpg`, dataUrl: await compressImage(file) })));
    setNewImages((prev) => [...prev, ...compressed]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Saving…" });
    try {
      const res = await fetch("/api/admin/edit-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          id: params.id,
          badges,
          imageFiles: newImages.length > 0 ? newImages : undefined,
          existingImages,
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: data.error || "Something went wrong." });
        return;
      }
      setStatus({ type: "success", message: data.message });
      setTimeout(() => router.push("/admin/products"), 1200);
    } catch {
      setStatus({ type: "error", message: "Network error, try again." });
    }
  };

  const inputClass = "w-full border border-line px-4 py-3 font-sans text-sm outline-none focus-visible:border-charcoal bg-cream";

  if (!loaded) {
    return (
      <div className="container-page py-14 max-w-sm">
        <h1 className="font-display text-3xl text-charcoal mb-6">Edit product</h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPassword(password);
          }}
          className="flex flex-col gap-4"
        >
          <input type="password" placeholder="Admin password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required />
          <button type="submit" className="bg-ink text-cream font-sans py-3 rounded-full">
            Load product
          </button>
          {status.type === "error" && <p className="text-rust text-sm font-sans">{status.message}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="container-page py-14 max-w-xl">
      <h1 className="font-display text-3xl text-charcoal mb-2">Edit product</h1>
      <p className="text-sm text-charcoal/60 font-sans mb-8">Changes go live on the site in about 2 minutes.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="text-xs font-sans text-charcoal/50 mb-1 block">Product title</label>
          <input name="title" value={form.title} onChange={handleChange} className={inputClass} required />
        </div>

        <div>
          <label className="text-xs font-sans text-charcoal/50 mb-1 block">URL slug</label>
          <input name="slug" value={form.slug} onChange={handleChange} className={inputClass} required />
        </div>

        <div>
          <label className="text-xs font-sans text-charcoal/50 mb-1 block">Short one-line descriptor</label>
          <input name="descriptor" value={form.descriptor} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className="text-xs font-sans text-charcoal/50 mb-1 block">Full description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className={inputClass} rows={4} />
        </div>

        <div>
          <label className="text-xs font-sans text-charcoal/50 mb-1 block">Current photos</label>
          <div className="flex gap-2 flex-wrap mb-3">
            {existingImages.map((url) => (
              <div key={url} className="relative w-16 h-16">
                <Image src={url} alt="" fill className="object-cover rounded" />
              </div>
            ))}
          </div>
          <label className="text-xs font-sans text-charcoal/50 mb-1 block">Upload new photos to replace them (optional — leave empty to keep current photos)</label>
          <input type="file" accept="image/*" multiple onChange={handleFiles} className={inputClass} />
          {newImages.length > 0 && (
            <div className="flex gap-2 mt-3 flex-wrap">
              {newImages.map((img) => (
                <div key={img.name} className="relative w-16 h-16">
                  <Image src={img.dataUrl} alt="" fill className="object-cover rounded" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-sans text-charcoal/50 mb-1 block">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-sans text-charcoal/50 mb-1 block">Currency</label>
          <select name="currency" value={form.currency} onChange={handleChange} className={inputClass}>
            {SUPPORTED_CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-sans text-charcoal/50 mb-1 block">Original price (optional)</label>
          <input name="comparePrice" type="number" value={form.comparePrice} onChange={handleChange} className={inputClass} />
        </div>

        <div className="border-t border-line pt-5">
          <p className="font-display text-lg text-charcoal mb-3">Variants</p>
          <label className="text-xs font-sans text-charcoal/50 mb-1 block">Option name (e.g. Size, Color — leave blank if only one version)</label>
          <input name="optionName" value={form.optionName} onChange={handleChange} className={inputClass} />
          <label className="text-xs font-sans text-charcoal/50 mb-1 mt-4 block">Variants — one per line: Value | Price | Stock | Supplier SKU</label>
          <textarea name="variants" value={form.variants} onChange={handleChange} className={inputClass} rows={4} required />
        </div>

        <div>
          <label className="text-xs font-sans text-charcoal/50 mb-1 block">Features — one per line</label>
          <textarea name="features" value={form.features} onChange={handleChange} className={inputClass} rows={3} />
        </div>

        <div>
          <label className="text-xs font-sans text-charcoal/50 mb-1 block">Specifications — one per line: Label: Value</label>
          <textarea name="specifications" value={form.specifications} onChange={handleChange} className={inputClass} rows={3} />
        </div>

        <div>
          <label className="text-xs font-sans text-charcoal/50 mb-1 block">FAQs — one per line: Question | Answer</label>
          <textarea name="faqs" value={form.faqs} onChange={handleChange} className={inputClass} rows={3} />
        </div>

        <div>
          <label className="text-xs font-sans text-charcoal/50 mb-1 block">Shipping note</label>
          <input name="shipping" value={form.shipping} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <p className="text-xs font-sans text-charcoal/50 mb-2">Badges</p>
          <div className="flex gap-4">
            {["new", "bestseller", "limited"].map((b) => (
              <label key={b} className="flex items-center gap-2 text-sm font-sans capitalize">
                <input type="checkbox" checked={badges.includes(b)} onChange={() => toggleBadge(b)} className="accent-ink" />
                {b}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" disabled={status.type === "loading"} className="bg-ink text-cream font-sans py-3.5 rounded-full disabled:opacity-50">
          {status.type === "loading" ? status.message || "Saving…" : "Save changes"}
        </button>

        {status.type === "success" && <p className="text-teel text-sm font-sans">{status.message}</p>}
        {status.type === "error" && <p className="text-rust text-sm font-sans">{status.message}</p>}
      </form>
    </div>
  );
}
