import Image from "next/image";
import Link from "next/link";

type Props = {
  size?: number;
  href?: string | null;
  className?: string;
};

export function FlytimesMark({ size = 48, href = "/", className }: Props) {
  const img = (
    <Image
      src="/assets/logo.png"
      alt="فلاي تايمز"
      width={size}
      height={size}
      className={`rounded-full object-cover bg-black ${className ?? ""}`}
      style={{ width: size, height: size }}
      priority
    />
  );
  if (!href) return img;
  return (
    <Link href={href} aria-label="الرئيسية" className="inline-flex items-center">
      {img}
    </Link>
  );
}
