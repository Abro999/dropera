"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const items = [
  { label: "Home", href: "/", match: (p: string) => p === "/", icon: "M3 11l9-7 9 7M5 10v10h5v-6h4v6h5V10" },
  { label: "Shop", href: "/shop", match: (p: string) => p.startsWith("/shop") || p.startsWith("/category"), icon: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" },
];

const tab = "relative flex flex-1 flex-col items-center justify-center gap-1 h-16 text-[11px] font-medium";

export function MobileTabBar() {
  const pathname = usePathname();
  const { lineCount, openCart } = useCart();

  return (
    <nav
      aria-label="Primary"
      className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-cream border-t border-line flex pb-[env(safe-area-inset-bottom)]"
    >
      {items.map((item) => {
        const active = item.match(pathname);
        return (
          <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={`${tab} ${active ? "text-ink" : "text-ink/55"}`}>
            {active && <span className="absolute top-0 h-0.5 w-8 bg-brass" />}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
              <path d={item.icon} />
            </svg>
            {item.label}
          </Link>
        );
      })}
      <button onClick={openCart} className={`${tab} text-ink/55`}>
        <span className="relative">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
            <path d="M6 8h12l-1 12H7L6 8z" />
            <path d="M9 8V6a3 3 0 016 0v2" />
          </svg>
          {lineCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-brass text-[10px] font-semibold text-ink flex items-center justify-center">
              {lineCount}
            </span>
          )}
        </span>
        Bag
      </button>
    </nav>
  );
}
