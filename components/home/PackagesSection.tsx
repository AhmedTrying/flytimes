import Link from "next/link";
import { PACKAGES } from "@/data/packages";
import { SectionHead } from "@/components/SectionHead";
import { PackageCard } from "@/components/PackageCard";
import { Icon } from "@/components/Icon";
import { AnimateSection, StaggerContainer, AnimateItem } from "@/components/AnimateSection";

export function PackagesSection() {
  return (
    <section
      id="packages"
      className="py-20 md:py-24 bg-brand-orange-soft border-y-2 border-brand-ink"
    >
      <div className="container-flytimes">
        <AnimateSection>
          <SectionHead
            tag="عروض صيف ٢٠٢٦"
            title={
              <>
                وجهات <span className="text-brand-orange">تستاهل</span> إجازتك.
              </>
            }
          />
        </AnimateSection>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PACKAGES.slice(0, 6).map((p) => (
            <AnimateItem key={p.id}>
              <PackageCard pkg={p} />
            </AnimateItem>
          ))}
        </StaggerContainer>

        <AnimateSection delay={0.2}>
          <div className="text-center mt-10">
            <Link href="/packages" className="btn-dark">
              شاهد كل البكجات <Icon name="arrow-left" size={16} />
            </Link>
          </div>
        </AnimateSection>
      </div>
    </section>
  );
}
