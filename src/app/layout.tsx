import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/components/ui/Toast";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b1530",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dropera.example"),
  title: { default: "DropEra — Objects worth finding", template: "%s | DropEra" },
  description: "DropEra is a curated store for tech, home, fashion and everyday-carry objects worth finding.",
  openGraph: { title: "DropEra — Objects worth finding", description: "A curated, cross-category store for objects worth finding.", type: "website", siteName: "DropEra" },
  twitter: { card: "summary_large_image", title: "DropEra — Objects worth finding", description: "A curated, cross-category store for objects worth finding." },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "DropEra",
              url: "https://www.dropera.example",
            }),
          }}
        />
        <ToastProvider>
          <CartProvider>
            <Header />
            <main className="pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">{children}</main>
            <Footer />
            <CartDrawer />
            <MobileTabBar />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
