import { SERVICES } from "@/data/services";
import { SectionHead } from "@/components/SectionHead";
import { ServiceCard } from "@/components/ServiceCard";
import { Icon } from "@/components/Icon";
import { AnimateSection, StaggerContainer, AnimateItem } from "@/components/AnimateSection";

export function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-24">
      <div className="container-flytimes">
        <AnimateSection>
          <SectionHead
            tag="خدماتنا"
            title={
              <>
                كل شي تحتاجه{" "}
                <span className="text-brand-orange">تحت سقف واحد.</span>
              </>
            }
            lead="من حجز الطيران وفيزا الدولة إلى رخصة القيادة الدولية — وفّر وقتك وخلّنا نسوي عنك."
          />
        </AnimateSection>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {SERVICES.slice(0, 7).map((s) => (
            <AnimateItem key={s.id}>
              <ServiceCard service={s} />
            </AnimateItem>
          ))}
          <AnimateItem>
            <div className="rounded-[20px] border-2 border-brand-ink bg-brand-ink text-brand-cream p-7 lift-hard h-full">
              <div
                className="w-14 h-14 bg-brand-orange text-white rounded-[14px] grid place-items-center mb-5"
                style={{ transform: "rotate(-4deg)" }}
              >
                <Icon name="spark" size={24} />
              </div>
              <h4 className="text-[20px] font-black mb-2 text-white">رحلة مصممة لك</h4>
              <p className="text-[13px] leading-relaxed text-white/70">
                عطنا الميزانية واختر الوجهة، وخلّنا نصمّم رحلة بمقاسك.
              </p>
            </div>
          </AnimateItem>
        </StaggerContainer>
      </div>
    </section>
  );
}
