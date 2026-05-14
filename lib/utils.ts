export function cn(...cls: (string | undefined | null | false)[]) {
  return cls.filter(Boolean).join(" ");
}

export function toArabicDigits(input: string | number): string {
  const map = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(input).replace(/\d/g, (d) => map[Number(d)]);
}

export function formatSAR(amount: number): string {
  return amount.toLocaleString("ar-SA");
}
