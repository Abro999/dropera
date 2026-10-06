import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <div>
      <PageHeader eyebrow="Legal" title="Privacy policy" description="Last updated October 2026." />
      <div className="container-page py-16 md:py-24 max-w-2xl flex flex-col gap-6 font-sans text-charcoal/80 leading-relaxed">
        <p>
          We collect the information needed to process your order — name, delivery address, email, and phone number
          — and share it only with the services required to fulfill that order (our payment processor and shipping
          partners). We never sell your data to third parties.
        </p>
        <p>
          Payment details are handled entirely by Razorpay; we never see or store your card number. Delivery details
          are shared with our fulfillment partners only for the orders you place.
        </p>
        <p>
          You can ask us to delete your account data at any time by emailing support@dropera.example. We'll confirm
          once it's done.
        </p>
      </div>
    </div>
  );
}
