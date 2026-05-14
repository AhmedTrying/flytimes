import Image from "next/image";

type Props = {
  hue: number;
  label: string;
  sublabel?: string;
  height?: number;
  image?: string;
  className?: string;
  /** When true, fills the parent container instead of using a fixed height */
  fillParent?: boolean;
};

/**
 * Labeled destination card surface. Uses real image when provided,
 * otherwise an angled gradient with destination name overlay.
 */
export function DestinationPlaceholder({
  hue,
  label,
  sublabel,
  height = 260,
  image,
  className = "",
  fillParent = false,
}: Props) {
  if (image) {
    return (
      <div
        className={`relative overflow-hidden ${fillParent ? "w-full h-full" : ""} ${className}`}
        style={fillParent ? undefined : { height }}
      >
        <Image
          src={image}
          alt={label}
          fill
          sizes="(max-width: 900px) 100vw, 640px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-0 right-0 left-0 p-5 text-white">
          <div className="font-heading font-black text-[28px] leading-none drop-shadow-sm">
            {label}
          </div>
          {sublabel && (
            <div className="text-[13px] opacity-90 mt-1.5">{sublabel}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${fillParent ? "w-full h-full" : ""} ${className}`}
      style={
        fillParent
          ? { background: `linear-gradient(135deg, oklch(0.75 0.14 ${hue}) 0%, oklch(0.45 0.12 ${hue}) 100%)` }
          : {
              height,
              background: `linear-gradient(135deg, oklch(0.75 0.14 ${hue}) 0%, oklch(0.45 0.12 ${hue}) 100%)`,
            }
      }
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,.2) 0 2px, transparent 2px 14px)",
        }}
      />
      <div className="absolute bottom-0 right-0 left-0 p-5 text-white">
        <div className="font-heading font-black text-[28px] leading-none drop-shadow">
          {label}
        </div>
        {sublabel && (
          <div className="text-[13px] opacity-90 mt-1.5">{sublabel}</div>
        )}
      </div>
      <div className="absolute top-3 left-3 text-[10px] bg-white/20 backdrop-blur px-2 py-1 rounded-full text-white font-bold">
        صورة — قريباً
      </div>
    </div>
  );
}
