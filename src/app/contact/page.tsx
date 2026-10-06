import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Contact us" };

export default function ContactPage() {
  return (
    <div>
      <PageHeader eyebrow="Get in touch" title="We're here to help" description="Questions about an order, a product, or anything else — reach out and we'll get back to you within a business day." />
      <div className="container-page py-16 md:py-24 max-w-xl">
        <div className="flex flex-col gap-6">
          <div>
            <h3 className="font-display text-xl text-charcoal mb-1">Email</h3>
            <p className="font-sans text-charcoal/70">support@dropera.example</p>
          </div>
          <div>
            <h3 className="font-display text-xl text-charcoal mb-1">Order support</h3>
            <p className="font-sans text-charcoal/70">Include your order confirmation email and we'll pull up your details right away.</p>
          </div>
          <div>
            <h3 className="font-display text-xl text-charcoal mb-1">Response time</h3>
            <p className="font-sans text-charcoal/70">We typically reply within 24 hours on business days.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
