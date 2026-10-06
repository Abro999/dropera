import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Terms of service" };

export default function TermsPage() {
  return (
    <div>
      <PageHeader eyebrow="Legal" title="Terms of service" description="Last updated October 2026." />
      <div className="container-page py-16 md:py-24 max-w-2xl flex flex-col gap-6 font-sans text-charcoal/80 leading-relaxed">
        <p>
          By placing an order on DropEra, you agree to pay the listed price including any applicable taxes and
          shipping fees shown at checkout. Prices and availability are subject to change without notice.
        </p>
        <p>
          Orders are fulfilled by DropEra directly or forwarded to our fulfillment partners. Delivery estimates are
          not guaranteed and may vary based on your location and the item ordered.
        </p>
        <p>
          Returns and refunds follow the terms outlined in our Returns policy. We reserve the right to refuse service
          or cancel an order in cases of suspected fraud or abuse.
        </p>
      </div>
    </div>
  );
}
