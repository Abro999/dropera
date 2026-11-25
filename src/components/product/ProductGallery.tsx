"use client";

wmmw
      </div>

      <button onClick={() => setFullscreen(true)} className="relative flex-1 aspect-[4/5] overflow-hidden bg-paper-soft cursor-zoom-in" aria-label="Open fullscreen gallery">
        <Image src={images[active]?.url} alt={images[active]?.alt ?? title} fill sizes="(max-width: 768px) 100vw, 50vw" priority className="object-cover" />
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
