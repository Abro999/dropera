"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { MegaMenu } from "./MegaMenu";
import { MobileNav } from "./MobileNav";
import { SearchOverlay } from "./SearchOverlay";

const navLinks = [
  { label: "New arrivals", href: "/category/new-arrivals" },
  { label: "Best sellers", href: "/shop?sort=rating" },
  { label: "About", href: "/about" },
];

const iconBtn = "w-10 h-10 flex items-center justify-center rounded-full text-ink hover:bg-ink/5 transition-colors";

export function Header() {
  const { lineCount, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-cream border-b border-line" onMouseLeave={() => setMenuOpen(false)}>
        <div className="container-page grid h-16 md:h-[72px] grid-cols-[1fr_auto_1fr] md:grid-cols-[auto_1fr_auto] items-center md:gap-12">
          <div className="md:hidden">
            <button className={`${iconBtn} -ml-2`} aria-label="Open menu" onClick={() => setMobileNavOpen(true)}>
              <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                <path d="M0 1H20M0 7H20M0 13H20" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>

          <Link href="/" className="flex items-center gap-2 font-display text-[22px] md:text-2xl text-ink shrink-0">
            <Image src="/logo.png" alt="" width={36} height={36} className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover" priority />
            DropEra
          </Link>

          <nav className="hidden md:flex items-center justify-center gap-8 font-sans text-[15px] font-medium text-ink">
            <div onMouseEnter={() => setMenuOpen(true)}>
              <Link href="/shop" className="hover:text-teel transition-colors">
                Shop
              </Link>
            </div>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-teel transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-0.5 -mr-2">
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className={iconBtn}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </button>
            <button aria-label="Account" className={`${iconBtn} hidden sm:flex`}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </button>
            <button onClick={openCart} aria-label={`Cart, ${lineCount} items`} className={`${iconBtn} relative`}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M6 8h12l-1 12H7L6 8z" />
                <path d="M9 8V6a3 3 0 016 0v2" />
              </svg>
              {lineCount > 0 && (
                <span className="absolute top-1 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-brass text-[10px] font-semibold text-ink flex items-center justify-center">
                  {lineCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {menuOpen && <MegaMenu />}
      </header>

      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
