"use client";

import Link from "next/link";
import { useState } from "react";
import { FlytimesMark } from "./FlytimesMark";
import { Icon } from "./Icon";

const LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/packages", label: "البكجات" },
  { href: "/#services", label: "الخدمات" },
  { href: "/#why", label: "من نحن" },
  { href: "/request", label: "تواصل" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="bg-brand-cream border-b-2 border-brand-ink sticky top-0 z-40">
      <div className="container-flytimes flex items-center justify-between py-4">
        <FlytimesMark size={48} />

        <div className="hidden md:flex items-center gap-1 text-[14px] font-bold">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3.5 py-2 rounded-[10px] hover:bg-brand-orange-soft transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/request" className="hidden sm:inline-flex btn-orange !py-2.5 !px-5 !text-[14px]">
            احجز دحين <Icon name="arrow-left" size={16} />
          </Link>
          <button
            className="md:hidden w-10 h-10 rounded-[10px] border-2 border-brand-ink grid place-items-center"
            aria-label="القائمة"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="flex flex-col gap-1">
              <span className="block w-5 h-0.5 bg-brand-ink" />
              <span className="block w-5 h-0.5 bg-brand-ink" />
              <span className="block w-5 h-0.5 bg-brand-ink" />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t-2 border-brand-ink bg-brand-cream">
          <div className="container-flytimes py-3 flex flex-col">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 font-bold border-b border-brand-ink/10"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/request"
              onClick={() => setOpen(false)}
              className="btn-orange justify-center mt-4 mb-2"
            >
              احجز دحين <Icon name="arrow-left" size={16} />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
