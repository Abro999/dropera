"use client";

import { ShippingAddress } from "@/lib/cj";

export function ShippingAddressForm({
  value,
  onChange,
}: {
  value: ShippingAddress;
  onChange: (next: ShippingAddress) => void;
}) {
  const inputClass = "w-full border border-line px-4 py-2.5 text-sm font-sans outline-none focus-visible:border-charcoal bg-cream";

  const update = (field: keyof ShippingAddress, val: string) => onChange({ ...value, [field]: val });

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-display text-xl text-charcoal">Delivery address</h2>
      <input placeholder="Full name" value={value.name} onChange={(e) => update("name", e.target.value)} className={inputClass} required />
      <input placeholder="Phone number" value={value.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} required />
      <input placeholder="Address line (house no., street, area)" value={value.address} onChange={(e) => update("address", e.target.value)} className={inputClass} required />
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="City" value={value.city} onChange={(e) => update("city", e.target.value)} className={inputClass} required />
        <input placeholder="State" value={value.province} onChange={(e) => update("province", e.target.value)} className={inputClass} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="PIN / ZIP code" value={value.zip} onChange={(e) => update("zip", e.target.value)} className={inputClass} required />
        <input placeholder="Country code (e.g. IN)" value={value.countryCode} onChange={(e) => update("countryCode", e.target.value.toUpperCase())} className={inputClass} required />
      </div>
    </div>
  );
}
