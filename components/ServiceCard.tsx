import { Icon } from "./Icon";
import type { Service } from "@/data/services";

type Props = {
  service: Service;
  variant?: "default" | "dark";
};

export function ServiceCard({ service, variant = "default" }: Props) {
  const isDark = variant === "dark";
  return (
    <div
      className={`rounded-[20px] border-2 p-7 lift-hard ${
        isDark
          ? "bg-brand-ink border-brand-ink text-brand-cream"
          : "bg-white border-brand-ink"
      }`}
    >
      <div
        className="w-14 h-14 bg-brand-orange text-white rounded-[14px] grid place-items-center mb-5"
        style={{ transform: "rotate(-4deg)" }}
      >
        <Icon name={service.icon} size={24} />
      </div>
      <h4 className={`text-[20px] font-black mb-2 ${isDark ? "text-white" : ""}`}>
        {service.label}
      </h4>
      <p className={`text-[13px] leading-relaxed ${isDark ? "text-white/70" : "text-brand-muted"}`}>
        {service.desc}
      </p>
    </div>
  );
}
