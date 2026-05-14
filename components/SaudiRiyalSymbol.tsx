import { cn } from "@/lib/utils";
import { SAR_SYMBOL_CHAR, SAR_SYMBOL_ARIA } from "@/lib/sar";

type Props = {
  className?: string;
  decorative?: boolean;
};

export function SaudiRiyalSymbol({ className, decorative = false }: Props) {
  return (
    <span
      className={cn("saudi-riyal", className)}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : SAR_SYMBOL_ARIA}
      aria-hidden={decorative ? true : undefined}
    >
      {SAR_SYMBOL_CHAR}
    </span>
  );
}

type EstimateTextProps = {
  value: string;
  className?: string;
};

/**
 * Render an estimate string ("٥٬١٠٠ ê") with the SAR symbol character
 * wrapped in the SaudiRiyalSymbol font. Numbers keep their original font.
 */
export function EstimateText({ value, className }: EstimateTextProps) {
  if (!value) return null;
  const parts = value.split(SAR_SYMBOL_CHAR);
  return (
    <span className={className}>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <SaudiRiyalSymbol />}
        </span>
      ))}
    </span>
  );
}
