import type { ReactNode } from "react";

type Props = {
  tag?: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
};

export function SectionHead({ tag, title, lead, className = "" }: Props) {
  return (
    <div className={`text-center mb-14 ${className}`}>
      {tag && <div className="tag-pill mb-4">{tag}</div>}
      <h2 className="text-[clamp(34px,5vw,64px)] font-black leading-[1.06] text-balance">
        {title}
      </h2>
      {lead && (
        <p className="text-brand-muted mt-4 max-w-[560px] mx-auto text-[17px] leading-[1.7]">
          {lead}
        </p>
      )}
    </div>
  );
}
