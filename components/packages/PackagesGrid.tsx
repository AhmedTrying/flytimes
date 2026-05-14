"use client";

import { useState } from "react";
import { PACKAGES } from "@/data/packages";
import { PackageCard } from "@/components/PackageCard";

const FILTERS = [
  { id: "all", label: "الكل" },
  { id: "priced", label: "محدد السعر" },
  { id: "georgia", label: "جورجيا" },
  { id: "maldives", label: "المالديف" },
  { id: "asia", label: "آسيا" },
  { id: "europe", label: "أوروبا وبالقرب" },
  { id: "cruise", label: "كروز" },
];

function matchFilter(id: string, pkgId: string, hasPrice: boolean): boolean {
  if (id === "all") return true;
  if (id === "priced") return hasPrice;
  if (id === pkgId) return true;
  if (id === "asia") return ["thailand", "maldives", "maldives-dubai", "azerbaijan"].includes(pkgId);
  if (id === "europe") return ["georgia", "armenia", "bosnia", "ukraine", "albania", "europe"].includes(pkgId);
  if (id === "cruise") return pkgId === "cruise";
  if (id === "georgia") return pkgId === "georgia";
  if (id === "maldives") return pkgId.startsWith("maldives");
  return false;
}

export function PackagesGrid() {
  const [active, setActive] = useState("all");

  const visible = PACKAGES.filter((p) => matchFilter(active, p.id, p.price !== null));

  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="container-flytimes">
        {/* Filter chips — horizontally scrollable on mobile */}
        <div className="flex gap-2.5 flex-nowrap overflow-x-auto pb-2 -mx-1 px-1 sm:flex-wrap sm:overflow-visible sm:pb-0 sm:mx-0 sm:px-0 mb-8 sm:mb-10 scrollbar-hide">
          {FILTERS.map((f) => {
            const count =
              f.id === "all"
                ? PACKAGES.length
                : PACKAGES.filter((p) => matchFilter(f.id, p.id, p.price !== null)).length;
            return (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={`shrink-0 px-4 py-2 rounded-[10px] border text-[13px] font-bold transition-all inline-flex items-center gap-2 ${
                  active === f.id
                    ? "bg-brand-ink text-brand-cream border-brand-ink"
                    : "bg-white border-brand-ink/15 text-brand-ink hover:border-brand-ink/50"
                }`}
              >
                {f.label}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    active === f.id ? "bg-white/20" : "bg-brand-ink/10"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {visible.length === 0 ? (
          <div className="text-center py-20 text-brand-muted">
            <div className="text-[64px]">✈</div>
            <p className="mt-4 text-[16px]">لا توجد نتائج لهذا الفلتر.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {visible.map((p) => (
              <PackageCard key={p.id} pkg={p} imageHeight={220} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
