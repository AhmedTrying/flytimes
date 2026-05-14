import { SectionHead } from "@/components/SectionHead";
import { AnimateSection, StaggerContainer, AnimateItem } from "@/components/AnimateSection";

const ROWS = [
  {
    n: "01",
    t: "أسعار ما تلقاها في أي مكان",
    d: "اتفاقيات مباشرة مع الفنادق وشركات الطيران تخلّيك تدفع أقل وتحصل أكثر.",
  },
  {
    n: "02",
    t: "فريق يعرف كل تفصيل",
    d: "مستشارينا جربوا كل وجهة وكل فندق نعرضه. يعني نصيحتنا مو من كتالوج.",
  },
  {
    n: "03",
    t: "مرافقة كاملة قبل وخلال الرحلة",
    d: "من لحظة الاستفسار إلى لحظة الرجوع، فريقنا متواجد على الواتس ٢٤ ساعة.",
  },
  {
    n: "04",
    t: "دفعات ميسّرة بلا فوائد",
    d: "قسّم بكج السفر على أربع دفعات وسافر الحين.",
  },
];

export function WhySection() {
  return (
    <section id="why" className="py-20 md:py-24">
      <div className="container-flytimes">
        <AnimateSection>
          <SectionHead
            tag="ليش فلاي تايمز؟"
            title={
              <>
                لأنه السفر{" "}
                <span className="text-brand-orange">ما يتكرر.</span>
              </>
            }
          />
        </AnimateSection>

        <StaggerContainer>
          {ROWS.map((w) => (
            <AnimateItem key={w.n}>
              <div className="grid md:grid-cols-[80px_1fr_1fr] gap-6 md:gap-10 items-center py-8 md:py-10 border-b-2 border-dashed border-brand-ink/15 last:border-b-0">
                <div className="font-heading font-black text-[64px] md:text-[80px] text-brand-orange leading-none select-none">
                  {w.n}
                </div>
                <h3 className="text-[24px] md:text-[32px] font-black leading-[1.15]">{w.t}</h3>
                <p className="text-brand-ink/70 leading-[1.8] text-[16px]">{w.d}</p>
              </div>
            </AnimateItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
