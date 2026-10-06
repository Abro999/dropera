import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "About DropEra" };

export default function AboutPage() {
  return (
    <div>
      <PageHeader eyebrow="About us" title="A running search for objects worth finding" description="DropEra exists because most of the internet's shopping is noise. We spend the time digging through it so you don't have to." />
      <div className="container-page py-16 md:py-24 max-w-2xl">
        <div className="flex flex-col gap-6 font-sans text-charcoal/80 leading-relaxed">
          <p>
            We started DropEra with a simple frustration: finding one good product online meant opening thirty tabs,
            reading reviews you don't trust, and still guessing. So we built a store where every product has already
            been through that filter — tested, compared, and only listed if it earns a place on the shelf.
          </p>
          <p>
            We're a small, curation-first team across tech, home, fashion, accessories, and outdoor gear. No bulk
            catalog, no filler — just the things we'd actually recommend to a friend.
          </p>
        </div>
      </div>
    </div>
  );
}
