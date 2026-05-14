import { SectionHead } from "@/components/SectionHead";
import { AnimateSection, StaggerContainer, AnimateItem } from "@/components/AnimateSection";

const STATS = [
  { v: "+١٢", l: "وجهة سياحية" },
  { v: "+٥٠٠", l: "عميل سعيد" },
  { v: "٢٤/٧", l: "دعم على الواتس" },
  { v: "٩٨٪", l: "نسبة رضا" },
];

export function AboutSection() {
  return (
    <section id="about" className="py-20 md:py-24 border-b-2 border-dashed border-brand-ink/15">
      <div className="container-flytimes">
        <AnimateSection>
          <SectionHead
            tag="من نحن"
            title={
              <>
                وكالة <span className="text-brand-orange">فلاي تايمز</span>
                <br className="hidden md:inline" />{" "}
                — شريكك في كل رحلة.
              </>
            }
            lead="نصمّم لك تجربة سفر بلا تعقيدات. من لحظة التخطيط لأول رحلة إلى حجوزات العائلة الكبيرة — فريقنا معك بكل تفصيلة."
          />
        </AnimateSection>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <AnimateItem key={s.l}>
              <div className="bg-white border-2 border-brand-ink rounded-[20px] p-6 text-center lift-hard h-full">
                <div className="font-heading font-black text-[40px] md:text-[48px] text-brand-orange leading-none">
                  {s.v}
                </div>
                <div className="text-[13px] text-brand-muted mt-2 font-semibold">{s.l}</div>
              </div>
            </AnimateItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
