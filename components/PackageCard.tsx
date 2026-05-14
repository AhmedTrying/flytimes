import Link from "next/link";
import { DestinationPlaceholder } from "./DestinationPlaceholder";
import { Icon } from "./Icon";
import { SaudiRiyalSymbol } from "./SaudiRiyalSymbol";
import { formatSAR } from "@/lib/utils";
import type { Package } from "@/data/packages";

type Props = {
  pkg: Package;
  imageHeight?: number;
};

export function PackageCard({ pkg, imageHeight = 200 }: Props) {
  return (
    <article className="relative bg-white border-[2.5px] border-brand-ink rounded-[24px] overflow-hidden flex flex-col lift-hard">
      {pkg.tag && (
        <div className="absolute top-4 right-4 bg-brand-ink text-brand-cream px-3 py-1.5 rounded-lg text-[12px] font-black z-[2]">
          {pkg.tag}
        </div>
      )}

      <DestinationPlaceholder
        hue={pkg.hue}
        label={pkg.name}
        sublabel={pkg.sub}
        height={imageHeight}
        image={pkg.image}
      />

      <div className="p-5 sm:p-6 flex flex-col gap-3.5 flex-1">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <h3 className="text-[22px] sm:text-[26px] font-black leading-tight">{pkg.name}</h3>
            <div className="text-[13px] text-brand-muted mt-2">{pkg.sub}</div>
          </div>
          <div className="bg-brand-orange text-white px-2.5 py-1 rounded-lg text-[11px] sm:text-[12px] font-black whitespace-nowrap shrink-0">
            {pkg.days}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 my-1">
          {pkg.includes.map((inc) => (
            <span key={inc} className="inline-flex items-center gap-1.5 text-[12px] text-brand-ink/80">
              <Icon name="check" size={14} color="#FF6A1A" /> {inc}
            </span>
          ))}
        </div>

        <div className="flex justify-between items-center gap-3 pt-4 border-t-2 border-dashed border-brand-ink/20 mt-auto">
          <div className="min-w-0">
            <div className="text-[11px] text-brand-muted">
              {pkg.priceLabel}
              {pkg.price !== null && " · ابتداءً من"}
            </div>
            {pkg.price !== null ? (
              <div className="font-heading font-black text-[26px] sm:text-[32px] text-brand-orange leading-none mt-1">
                {formatSAR(pkg.price)}
                <SaudiRiyalSymbol className="text-[20px] sm:text-[24px] text-brand-ink mr-1.5 font-semibold align-baseline" />
              </div>
            ) : (
              <div className="font-heading font-black text-[16px] sm:text-[18px] text-brand-ink leading-tight mt-1">
                اسأل عن السعر
              </div>
            )}
          </div>
          <Link
            href={`/request?package=${pkg.id}`}
            className="btn-orange !py-2.5 !px-4 !text-[13px] shrink-0"
          >
            احجز
          </Link>
        </div>
      </div>
    </article>
  );
}
