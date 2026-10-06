import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { StepList } from "@/components/layout/StepList";

export const metadata: Metadata = { title: "Shipping" };

export default function ShippingPage() {
  return (
    <div>
      <PageHeader eyebrow="Shipping" title="Where your order goes from here" />
      <div className="container-page py-16 md:py-24 max-w-2xl">
        <StepList
          steps={[
            { title: "Order confirmed", body: "You'll get a confirmation the moment your payment clears." },
            { title: "Processing", body: "Most orders are prepared for dispatch within 1-2 business days." },
            { title: "On its way", body: "Standard delivery typically takes 3-7 business days depending on your location." },
            { title: "Delivered", body: "Signature isn't required for most orders — check with support if yours needs one." },
          ]}
        />
      </div>
    </div>
  );
}
