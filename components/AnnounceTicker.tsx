import { ANNOUNCEMENTS } from "@/data/formOptions";

export function AnnounceTicker() {
  const items = [...ANNOUNCEMENTS, ...ANNOUNCEMENTS];
  return (
    <div className="bg-brand-ink text-brand-cream py-3 overflow-hidden text-sm font-semibold">
      <div className="flex gap-12 whitespace-nowrap animate-ticker">
        {items.map((a, i) => (
          <span key={i} className="inline-flex items-center gap-2.5">
            <span className="text-brand-orange">✦</span> {a}
          </span>
        ))}
      </div>
    </div>
  );
}
