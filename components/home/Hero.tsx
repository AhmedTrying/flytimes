"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { DestinationPlaceholder } from "@/components/DestinationPlaceholder";
import { Icon } from "@/components/Icon";
import { SaudiRiyalSymbol } from "@/components/SaudiRiyalSymbol";

const BADGES = ["صيف ٢٠٢٦", "خصومات حتى ٢٠٪", "دفع على ٤ دفعات"];
const FEATURES = ["فنادق ٤ و ٥ نجوم", "بدون رسوم خفية", "دعم ٢٤ ساعة"];

export function Hero() {
  return (
    <section className="relative overflow-hidden py-10 sm:py-12 md:py-20">
      {/* Background watermark */}
      <div
        aria-hidden
        className="absolute -top-2 sm:-top-5 left-[-40px] sm:left-[-80px] font-heading font-black text-brand-orange/[.07] select-none pointer-events-none z-0 whitespace-nowrap tracking-[-6px] sm:tracking-[-10px]"
        style={{ fontSize: "clamp(72px, 18vw, 240px)" }}
      >
        SUMMER 2026
      </div>

      <div className="container-flytimes relative z-10">
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-8 md:gap-12 items-center">

          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0"
          >
            {/* Badge row */}
            <div className="flex gap-2 flex-wrap mb-4 sm:mb-5">
              {BADGES.map((b) => (
                <div
                  key={b}
                  className="bg-white border-[1.5px] border-brand-ink px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full font-bold text-[12px] sm:text-[13px] inline-flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 bg-brand-orange rounded-full" />
                  {b}
                </div>
              ))}
            </div>

            {/* Headline */}
            <h1
              className="font-heading font-black leading-[1.05] sm:leading-[1.02] tracking-[-0.02em] sm:tracking-[-0.03em] break-words"
              style={{ fontSize: "clamp(36px, 11vw, 104px)" }}
            >
              <span className="block">رحلة العمر</span>
              <span className="block">
                تبدأ بـ<span className="hero-hl">نقرة</span>
                <span className="text-brand-orange"> واحدة.</span>
              </span>
            </h1>

            <p className="text-[15px] sm:text-[17px] md:text-[19px] text-brand-ink/75 leading-[1.75] mt-5 sm:mt-6 mb-7 sm:mb-8 max-w-[520px]">
              بكجات سياحية كاملة لأفضل الوجهات، بأسعار ما تلقى مثلها.
              من جورجيا إلى المالديف — خطّطنا لك كل شي.
            </p>

            {/* CTAs */}
            <div className="flex gap-3 flex-wrap mb-7 sm:mb-8">
              <Link href="/packages" className="btn-orange !px-5 !py-3 sm:!px-6 sm:!py-3.5">
                شوف العروض <Icon name="arrow-left" size={16} />
              </Link>
              <Link href="/request" className="btn-white !px-5 !py-3 sm:!px-6 sm:!py-3.5">
                احجز استشارة مجانية
              </Link>
            </div>

            {/* Feature checks */}
            <div className="flex gap-x-5 gap-y-3 flex-wrap">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2 sm:gap-2.5 text-[13px] sm:text-[14px] font-semibold">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 bg-brand-orange text-white rounded-full grid place-items-center shrink-0">
                    <Icon name="check" size={12} />
                  </span>
                  {f}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: destination card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            className="relative mt-12 md:mt-0 pb-8 md:pb-6 min-w-0"
          >
            {/* Main image card */}
            <div className="rounded-[20px] sm:rounded-[28px] overflow-hidden border-[2.5px] sm:border-[3px] border-brand-ink shadow-hard-md md:shadow-hard">
              <div className="relative w-full h-[320px] sm:h-[400px] md:h-[480px]">
                <DestinationPlaceholder
                  hue={145}
                  label="جورجيا"
                  sublabel="تبليسي · باتومي · باكورياني"
                  image="/assets/georgia.jpg"
                  fillParent
                />
              </div>
            </div>

            {/* Price sticker */}
            <div
              className="absolute -top-6 -left-2 sm:-top-5 sm:-left-5 w-[100px] h-[100px] sm:w-[120px] sm:h-[120px] md:w-[130px] md:h-[130px] bg-brand-orange text-white rounded-full grid place-items-center text-center border-[2.5px] sm:border-[3px] border-brand-ink shadow-[3px_3px_0_#1e1b16] sm:shadow-[4px_4px_0_#1e1b16] z-10"
              style={{ transform: "rotate(-12deg)" }}
            >
              <div>
                <div className="text-[10px] sm:text-[11px] font-bold">ابتداءً من</div>
                <div className="font-heading font-black text-[26px] sm:text-[32px] md:text-[36px] leading-none my-1">٥١٠٠</div>
                <div className="text-[10px] sm:text-[11px] font-bold inline-flex items-center justify-center gap-1">
                  <SaudiRiyalSymbol className="text-[14px] sm:text-[16px] leading-none" />
                  <span>للشخصين</span>
                </div>
              </div>
            </div>

            {/* Sticky labels — hidden on very small screens, visible sm+ */}
            <div className="hidden sm:flex absolute -bottom-2 md:-bottom-5 right-0 md:-right-4 flex-col gap-2.5 max-w-[240px] md:max-w-[260px]">
              <div className="bg-white px-4 py-2.5 rounded-xl border-2 border-brand-ink flex items-center gap-2.5 font-bold text-[13px] shadow-hard-sm">
                <span className="w-8 h-8 bg-brand-orange-soft text-brand-orange rounded-lg grid place-items-center shrink-0">
                  <Icon name="calendar" size={17} />
                </span>
                ١٠ أيام · ٩ ليالي
              </div>
              <div className="bg-white px-4 py-2.5 rounded-xl border-2 border-brand-ink flex items-center gap-2.5 font-bold text-[13px] shadow-hard-sm">
                <span className="w-8 h-8 bg-brand-orange-soft text-brand-orange rounded-lg grid place-items-center shrink-0">
                  <Icon name="check" size={17} />
                </span>
                شامل البوفيه + الجولات
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
