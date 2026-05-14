import { Suspense } from "react";
import { Metadata } from "next";
import { AnnounceTicker } from "@/components/AnnounceTicker";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { InquiryForm } from "@/components/request/InquiryForm";
import { DepartureNotice } from "@/components/request/DepartureNotice";

export const metadata: Metadata = {
  title: "احجز رحلتك — فلاي تايمز",
  description: "أرسل استفسارك وسيتواصل معك فريقنا خلال ٣٠ دقيقة بعرض مفصّل.",
};

export default function RequestPage() {
  return (
    <>
      <AnnounceTicker />
      <Navbar />
      <main>
        <section className="pt-10 sm:pt-12 pb-4 md:pt-16">
          <div className="container-flytimes">
            <div className="font-mono text-[12px] text-brand-muted-soft tracking-[0.1em] uppercase mb-4">
              الرئيسية · طلب حجز
            </div>
            <h1
              className="font-heading font-black leading-[1.1] break-words"
              style={{ fontSize: "clamp(28px, 7vw, 56px)" }}
            >
              خلّنا نصمّم رحلتك <em className="not-italic text-brand-orange">المقبلة</em>.
            </h1>
            <p className="mt-3 text-[15px] sm:text-[16px] text-brand-muted leading-[1.7] max-w-[540px]">
              عبّي التفاصيل بسرعة — مستشار سفر يتواصل معك خلال ٣٠ دقيقة في وقت العمل بعرض
              مفصّل بدون أي التزام.
            </p>
          </div>
        </section>

        <section className="pt-8 pb-16 md:pb-20">
          <div className="container-flytimes">
            <Suspense
              fallback={
                <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 items-start">
                  <div className="bg-white border-2 border-brand-ink rounded-[24px] p-8 min-h-[520px] animate-pulse" />
                  <div className="bg-brand-ink/5 rounded-[24px] min-h-[320px] animate-pulse" />
                </div>
              }
            >
              <InquiryForm />
            </Suspense>
          </div>
        </section>

        {/* Departure / passport requirements kept below the wizard for reference */}
        <section className="pb-20">
          <div className="container-flytimes max-w-[900px]">
            <DepartureNotice />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
