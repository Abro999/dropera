"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";

interface ProductRow {
  id: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  category: string;
  image: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[] | null>(null);
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "error"; message?: string }>({ type: "idle" });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = async () => {
    setStatus({ type: "loading" });
    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: data.error || "Couldn't load products." });
        return;
      }
      setProducts(data.products);
      setStatus({ type: "idle" });
    } catch {
      setStatus({ type: "error", message: "Network error, try again." });
    }
  };

  const handleDelete = async (product: ProductRow) => {
    if (!confirm(`Delete "${product.title}"? This can't be undone.`)) return;
    setDeletingId(product.id);
    try {
      const res = await fetch("/api/admin/delete-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: product.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Couldn't delete the product.");
        return;
      }
      setProducts((prev) => prev?.filter((p) => p.id !== product.id) ?? null);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!products) {
    return (
      <div className="container-page py-14 max-w-sm">
        <h1 className="font-display text-3xl text-charcoal mb-6">Manage products</h1>
        {status.type === "error" ? (
          <div className="flex flex-col gap-3">
            <p className="text-rust text-sm font-sans">{status.message}</p>
            <button onClick={load} className="bg-ink text-cream font-sans py-3 rounded-full">Try again</button>
          </div>
        ) : (
          <p className="text-sm font-sans text-charcoal/60">Loading products…</p>
        )}
      </div>
    );
  }

  return (
    <div className="container-page py-14">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-charcoal">Manage products ({products.length})</h1>
        <Link href="/admin" className="text-sm font-sans text-charcoal/60 underline">
          + Add new product
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-line border-y border-line">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 py-4">
            <div className="relative w-14 h-16 shrink-0 bg-paper-soft overflow-hidden">
              {p.image && <Image src={p.image} alt={p.title} fill sizes="56px" className="object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-sans text-sm text-charcoal truncate">{p.title}</p>
              <p className="text-xs text-charcoal/50 font-sans capitalize">{p.category} · {formatPrice(p.price, p.currency)}</p>
            </div>
            <Link href={`/admin/edit/${p.id}`} className="text-sm font-sans text-teel underline shrink-0">
              Edit
            </Link>
            <button
              onClick={() => handleDelete(p)}
              disabled={deletingId === p.id}
              className="text-sm font-sans text-rust underline shrink-0 disabled:opacity-50"
            >
              {deletingId === p.id ? "Deleting…" : "Delete"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
