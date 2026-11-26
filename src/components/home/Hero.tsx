import Image from "next/image";
import { Button } from "@/components/ui/Button";

const perks = ["Free shipping over ₹5,000", "Secure checkout", "30-day returns", "Verified reviews"];

export function Hero() {
  return (
    <section className="bg-ink text-cream">
      <div className="container-page grid md:grid-cols-2 gap-10 lg:gap-16 items-center pt-10 pb-12 md:pt-20 md:pb-24">
        <div className="flex flex-col items-start gap-6 order-2 md:order-1 w-full">
          <p className="text-sm font-medium text-brass">Curated across tech, home & everyday carry</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.1] tracking-tight w-full lg:max-w-xl">
            <span className="block">Fewer tabs.</span>
            <span className="block">Better finds.</span>
          </h1>
          <p className="text-base md:text-lg text-cream/75 w-full lg:max-w-md leading-relaxed">
            DropEra is a running search for the object that actually earns its shelf space — tested, sourced, and shipped without the thirty tabs of research.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2">
            <Button href="/shop" variant="secondary" size="lg">
              Shop the collection
            </Button>
            <Button href="/category/new-arrivals" variant="outline-light" size="lg">
              See what's new
            </Button>
          </div>
          <p className="pt-2 text-sm text-cream/70">
            Trusted by <span className="font-semibold text-cream">40,000+</span> considered shoppers
          </p>
        </div>

        <div className="order-1 md:order-2 grid grid-cols-2 gap-3 md:gap-4">
          <div className="relative aspect-[3/4] md:mt-10 overflow-hidden rounded-xl ring-1 ring-cream/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] bg-ink-soft">
            <Image src="https://images.unsplash.com/photo-1553774661-0651f14b2da4?q=80&w=1000&auto=format&fit=crop" alt="Premium wireless headphones on a clean studio backdrop" fill priority sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-xl ring-1 ring-cream/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] bg-ink-soft">
            <Image src="https://images.unsplash.com/photo-1655727010014-c2d05de8acea?q=80&w=1000&auto=format&fit=crop" alt="Minimal wristwatch on a clean studio backdrop" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          </div>
        </div>
      </div>

      <div
        className="border-t border-line-dark overflow-hidden"
        aria-label="Store promises"
        style={{
          maskImage: "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
        }}
      >
        <div className="flex w-max animate-marquee py-4 text-sm text-cream/80 hover:[animation-play-state:paused]">
          {[0, 1].map((group) => (
            <ul key={group} aria-hidden={group === 1} className="flex shrink-0 items-center">
              {[...perks, ...perks].map((perk, i) => (
                <li key={i} className="flex items-center whitespace-nowrap">
                  <span className="px-8">{perk}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-brass" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
