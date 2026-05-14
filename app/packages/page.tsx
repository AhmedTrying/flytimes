import Link from "next/link";
import { Metadata } from "next";
import { AnnounceTicker } from "@/components/AnnounceTicker";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PackagesGrid } from "@/components/packages/PackagesGrid";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = {
  title: "البكجات السياحية — فلاي تايمز",
  description: "اكتشف عروضنا السياحية لأفضل الوجهات العالمية بأسعار لا تُنافس.",
};

export default function PackagesPage() {
  return (
    <>
      <AnnounceTicker />
      <Navbar />
      <main>
        {/* Hero banner */}
        <section className="py-12 sm:py-14 md:py-20 border-b-2 border-brand-ink relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-2 left-[-40px] sm:left-[-60px] font-heading font-black text-brand-orange/[.06] select-none pointer-events-none whitespace-nowrap"
            style={{ fontSize: "clamp(72px, 16vw, 200px)" }}
          >
            PACKAGES
          </div>
          <div className="container-flytimes relative z-10">
            <div className="tag-pill mb-4 sm:mb-5">عروض صيف ٢٠٢٦</div>
            <h1
              className="font-heading font-black leading-[1.04] break-words"
              style={{ fontSize: "clamp(34px, 9vw, 96px)" }}
            >
              وجهاتنا
              <span className="text-brand-orange"> تستاهل</span> إجازتك.
            </h1>
            <p className="mt-4 sm:mt-5 text-[15px] sm:text-[17px] text-brand-muted leading-[1.75] max-w-[560px]">
              بكجات متكاملة للعوائل والعرسان والمجموعات — طيران وفندق وجولات وبوفيه، كل شي جاهز.
              <br />
              <span className="text-brand-ink font-semibold">العروض غير شاملة الطيران مع إمكانية توفيره.</span>
            </p>
            <div className="mt-7 sm:mt-8 flex gap-3 flex-wrap">
              <Link href="/request" className="btn-orange">
                احجز الآن <Icon name="arrow-left" size={16} />
              </Link>
              <Link href="/request" className="btn-white">
                استشارة مجانية
              </Link>
            </div>
          </div>
        </section>

        {/* Packages grid with client-side filters */}
        <PackagesGrid />

        {/* Inclusion/exclusion strip */}
        <section className="py-16 bg-brand-orange-soft border-t-2 border-brand-ink">
          <div className="container-flytimes">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white border-2 border-brand-ink rounded-[20px] p-7">
                <h3 className="text-[20px] font-black mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 bg-brand-orange text-white rounded-lg grid place-items-center">
                    <Icon name="check" size={16} />
                  </span>
                  ما يشمله البكج عادةً
                </h3>
                {[
                  "فنادق ٤ أو ٥ نجوم (حسب الباقة)",
                  "إفطار بوفيه مفتوح يومي",
                  "استقبال وتوديع من وإلى المطار بسيارة خاصة",
                  "جولات سياحية بسيارة خاصة",
                  "شريحة انترنت",
                  "جميع الضرائب والرسوم",
                ].map((i) => (
                  <div key={i} className="flex gap-3 py-2 border-b border-brand-ink/08 last:border-0 text-[14px]">
                    <Icon name="check" size={16} color="#FF6A1A" className="shrink-0 mt-0.5" />
                    {i}
                  </div>
                ))}
              </div>

              <div className="bg-white border-2 border-brand-ink rounded-[20px] p-7">
                <h3 className="text-[20px] font-black mb-5 flex items-center gap-2">
                  <span className="w-8 h-8 bg-brand-ink text-white rounded-lg grid place-items-center text-[12px] font-black">
                    ✕
                  </span>
                  ما لا يشمله البكج
                </h3>
                {[
                  "تذاكر الطيران الدولية (مع إمكانية التوفير)",
                  "الوجبات خارج الفندق",
                  "المصاريف الشخصية والتسوق",
                  "التأمين الطبي (ينصح بالحصول عليه)",
                  "الأنشطة الاختيارية غير المدرجة",
                ].map((i) => (
                  <div key={i} className="flex gap-3 py-2 border-b border-brand-ink/08 last:border-0 text-[14px]">
                    <span className="text-brand-muted shrink-0 mt-0.5 font-bold">✕</span>
                    {i}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
