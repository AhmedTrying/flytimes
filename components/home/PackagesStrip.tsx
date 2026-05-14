import { PACKAGES } from "@/data/packages";

export function PackagesStrip() {
  const items = [...PACKAGES, ...PACKAGES];
  return (
    <div className="bg-brand-ink text-brand-cream py-5 overflow-hidden">
      <div className="flex gap-12 items-center whitespace-nowrap animate-ticker-fast">
        {items.map((p, i) => (
          <span key={i} className="inline-flex items-center gap-3 font-heading font-extrabold text-[20px]">
            <span className="text-brand-orange text-[20px]">✦</span>
            {p.name}
          </span>
        ))}
      </div>
    </div>
  );
}
