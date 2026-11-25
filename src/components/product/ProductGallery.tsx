"use client";

import Image from "next/image";
import { useState } from "react";
import { ProductImage } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";

export function ProductGallery({ images, title }: { images: ProductImage[]; title: string }) {
  const [active, setActive] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 lg:gap-5">
      <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible no-scrollbar sm:w-20 lg:w-24 shrink-0">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            aria-current={active === i}
            className={`relative w-16 h-20 sm:w-full sm:h-24 lg:h-28 shrink-0 overflow-hidden border transition-colors ${active === i ? "border-ink" : "border-line hover:border-charcoal/40"}`}
          >
            <Image src={img.url} alt="" fill sizes="96px" className="object-cover object-top" />
          </button>
        ))}
      </div>

      <button onClick={() => setFullscreen(true)} className="relative flex-1 aspect-[4/5] overflow-hidden bg-paper-soft border border-line cursor-zoom-in" aria-label="Open fullscreen gallery">
        <Image src={images[active]?.url} alt={images[active]?.alt ?? title} fill sizes="(max-width: 640px) 100vw, 50vw" priority className="object-cover object-top" />
      </button>

      <Modal isOpen={fullscreen} onClose={() => setFullscreen(false)} ariaLabel={`${title} fullscreen gallery`}>
        <div className="relative w-full aspect-square sm:aspect-[4/3]">
          <Image src={images[active]?.url} alt={images[active]?.alt ?? title} fill className="object-contain bg-ink" />
        </div>
        <div className="flex gap-2 p-4 justify-center">
          {images.map((img, i) => (
            <button key={img.id} onClick={() => setActive(i)} className={`w-2 h-2 rounded-full transition-colors ${active === i ? "bg-ink" : "bg-line"}`} aria-label={`Go to image ${i + 1}`} />
          ))}
        </div>
      </Modal>
    </div>
  );
}
