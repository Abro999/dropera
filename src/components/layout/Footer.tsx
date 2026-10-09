import Link from "next/link";

const columns = [
  { title: "Shop", links: [{ label: "All products", href: "/shop" }, { label: "New arrivals", href: "/category/new-arrivals" }, { label: "Best sellers", href: "/shop?sort=rating" }] },
  { title: "Support", links: [{ label: "Contact us", href: "/contact" }, { label: "Shipping", href: "/shipping" }, { label: "Returns", href: "/returns" }] },
  { title: "Company", links: [{ label: "About DropEra", href: "/about" }, { label: "Privacy policy", href: "/privacy" }, { label: "Terms of service", href: "/terms" }] },
];

const socials = ["Instagram", "TikTok", "Pinterest"];
const payments = ["Visa", "Mastercard", "UPI", "Razorpay"];

export function Footer() {
  return (
    <footer className="bg-ink text-cream pb-[env(safe-area-inset-bottom)] md:pb-0">
      <div className="container-page pt-14 pb-12 md:pt-16 grid gap-12 md:grid-cols-[1.4fr_2fr] lg:gap-20">
        <div className="max-w-sm">
          <Link href="/" className="font-display text-2xl">
            DropEra
          </Link>
          <p className="mt-4 text-[15px] text-cream/70 leading-relaxed">
            We spend our time finding the things worth owning, so you don't have to dig through everything else to find them.
          </p>
          <div className="mt-6 flex gap-5">
            {socials.map((s) => (
              <a key={s} href="#" className="text-sm text-cream/80 hover:text-brass transition-colors">
                {s}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-cream mb-4">{col.title}</h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-cream/70 hover:text-brass transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-line-dark">
        <div className="container-page py-6 flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-cream/60">© {new Date().getFullYear()} DropEra. All rights reserved.</p>
          <ul className="flex flex-wrap gap-2">
            {payments.map((p) => (
              <li key={p} className="px-2.5 py-1 text-xs text-cream/70 border border-line-dark rounded">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
