import { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { StepList } from "@/components/layout/StepList";

export const metadata: Metadata = { title: "Returns" };

export default function ReturnsPage() {
  return (
    <div>
      <PageHeader eyebrow="Returns" title="30 days to change your mind" description="No restocking fee, no runaround — just a label in your inbox." />
      <div className="container-page py-16 md:py-24 max-w-2xl">
        <StepList
          steps={[
            { title: "Email us", body: "Tell us your order number and what you'd like to return." },
            { title: "Get a label", body: "We'll send a prepaid return label within one business day." },
            { title: "Ship it back", body: "Drop the package at any courier point — unused, original packaging where possible." },
            { title: "Refund processed", body: "Once it's received, your refund is issued within 3-5 business days." },
          ]}
        />
      </div>
    </div>
  );
}
