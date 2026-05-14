"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { CONTACT, toWhatsappLink, toTelLink } from "@/data/contact";
import { PACKAGE_OPTIONS, TRAVELLER_COUNTS } from "@/data/formOptions";
import { AnimateSection } from "@/components/AnimateSection";

export function CtaSection() {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [pkg, setPkg] = useState<string>(PACKAGE_OPTIONS[0]?.id ?? "");
  const [travellers, setTravellers] = useState<string>(TRAVELLER_COUNTS[0]?.id ?? "2");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (name.trim()) params.set("name", name.trim());
    if (phone.trim()) params.set("phone", phone.trim());
    if (pkg) params.set("package", pkg);
    if (travellers) params.set("travellers", travellers);
    router.push(`/request?${params.toString()}`);
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-brand-ink text-brand-cream relative overflow-hidden">
      <div
        aria-hidden
        className="absolute top-6 left-2 sm:top-10 sm:left-14 text-brand-orange/[.12] pointer-events-none select-none"
        style={{ fontSize: "clamp(140px, 22vw, 280px)", transform: "rotate(-20deg)", lineHeight: 1 }}
      >
        ✈
      </div>

      <div className="container-flytimes relative z-10">
        <AnimateSection>
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          <div>
            <div className="inline-block bg-brand-orange text-white px-4 py-1.5 rounded-full font-extrabold text-[13px] mb-5">
              ابدأ حجزك
            </div>
            <h2 className="font-heading font-black leading-[1.06]" style={{ fontSize: "clamp(28px, 8vw, 68px)" }}>
              متى <span className="text-brand-orange">آخر مرة</span>
              <br />
              حجزت إجازتك بسهولة؟
            </h2>
            <p className="text-white/75 mt-4 text-[15px] sm:text-[17px] leading-[1.75] max-w-[480px]">
              عبّي الاستمارة والمستشار يتواصل معك خلال ٣٠ دقيقة بعرض مفصّل، بدون التزام.
            </p>

            <div className="flex gap-5 mt-8 flex-wrap">
              {CONTACT.phones.map((p) => (
                <a
                  key={p.value}
                  href={p.whatsapp ? toWhatsappLink(p.value) : toTelLink(p.value)}
                  target={p.whatsapp ? "_blank" : undefined}
                  className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-brand-orange grid place-items-center">
                    <Icon name={p.whatsapp ? "whatsapp" : "phone"} size={20} />
                  </div>
                  <div>
                    <div className="text-[12px] opacity-60">{p.label}</div>
                    <div className="font-extrabold font-mono">{p.value}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white text-brand-ink rounded-[20px] sm:rounded-[24px] p-5 sm:p-7 md:p-8 border-[2.5px] border-brand-ink shadow-hard-orange"
          >
            <h3 className="text-[20px] sm:text-[24px] md:text-[26px] font-black mb-1">احجز رحلتك خلال دقيقة</h3>
            <p className="text-brand-muted text-[13px] sm:text-[14px] mb-4">راح نتواصل معك بعرض مخصص.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-2.5">
              <FormInput label="الاسم" name="name" placeholder="اكتب اسمك الكامل" value={name} onChange={setName} />
              <FormInput label="الجوال" name="phone" type="tel" placeholder="05xxxxxxxx" value={phone} onChange={setPhone} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-3">
              <FormSelect label="الوجهة" name="package" value={pkg} onChange={setPkg}>
                {PACKAGE_OPTIONS.slice(0, 6).map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </FormSelect>
              <FormSelect label="المسافرون" name="travellers" value={travellers} onChange={setTravellers}>
                {TRAVELLER_COUNTS.map((o) => (
                  <option key={o.id} value={o.id}>{o.label}</option>
                ))}
              </FormSelect>
            </div>

            <button
              type="submit"
              className="btn-orange w-full justify-center"
            >
              أرسل الطلب <Icon name="arrow-left" size={16} />
            </button>
            <p className="text-[12px] text-brand-muted-soft mt-3 text-center">
              بدون التزام · نرد عليك خلال ٣٠ دقيقة · <Link href="/request" className="underline hover:text-brand-orange">نموذج كامل</Link>
            </p>
          </form>
        </div>
        </AnimateSection>
      </div>
    </section>
  );
}

function FormInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="relative block">
      <span className="absolute top-2 right-3.5 text-[10px] text-brand-muted-soft font-bold tracking-[0.04em] uppercase pointer-events-none z-10">
        {label}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-[1.5px] border-brand-ink/15 bg-brand-cream rounded-xl pt-6 pb-2.5 px-3.5 font-body font-semibold text-[14px] text-brand-ink outline-none transition-all hover:border-brand-ink/30 focus:border-brand-orange focus:bg-white focus:ring-[3px] focus:ring-brand-orange/15 placeholder:text-brand-muted-soft/80 placeholder:font-medium"
      />
    </label>
  );
}

function FormSelect({
  label,
  name,
  value,
  onChange,
  children,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="relative block">
      <span className="absolute top-2 right-3.5 text-[10px] text-brand-muted-soft font-bold tracking-[0.04em] uppercase pointer-events-none z-10">
        {label}
      </span>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none border-[1.5px] border-brand-ink/15 bg-brand-cream rounded-xl pt-6 pb-2.5 pr-3.5 pl-8 font-body font-semibold text-[14px] text-brand-ink outline-none transition-all hover:border-brand-ink/30 focus:border-brand-orange focus:bg-white focus:ring-[3px] focus:ring-brand-orange/15"
      >
        {children}
      </select>
      <span className="absolute bottom-3 left-4 text-brand-ink pointer-events-none text-[10px]">▼</span>
    </label>
  );
}
