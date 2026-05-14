type Props = {
  label: string;
  value: string | number;
  delta?: string;
  deltaUp?: boolean;
  /** Real sparkline data — array of counts (e.g. submissions per day, oldest→newest) */
  sparkData?: number[];
};

export function StatCard({ label, value, delta, deltaUp, sparkData }: Props) {
  const max = sparkData ? Math.max(...sparkData, 1) : 1;

  return (
    <div className="bg-white rounded-[14px] sm:rounded-[16px] p-4 sm:p-5 border border-black/5">
      <div className="text-[11px] sm:text-[12px] text-brand-muted mb-1.5 sm:mb-2">{label}</div>
      <div
        className="font-heading font-black leading-none"
        style={{ fontSize: typeof value === "string" && value.length > 4 ? 20 : 28 }}
      >
        {value}
      </div>
      {delta && (
        <div
          className={`text-[12px] mt-1.5 inline-flex items-center gap-1 ${
            deltaUp ? "text-green-700" : "text-brand-muted"
          }`}
        >
          {deltaUp && "↑"} {delta}
        </div>
      )}
      {sparkData && (
        <div className="flex gap-0.5 items-end h-6 mt-2.5">
          {sparkData.map((v, i) => (
            <div
              key={i}
              className="flex-1 bg-brand-orange rounded-[1px]"
              style={{
                height: `${Math.max(10, (v / max) * 100)}%`,
                opacity: i === sparkData.length - 1 ? 1 : 0.45 + (i / sparkData.length) * 0.35,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
