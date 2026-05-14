"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchSubmissions,
  seedSubmissions,
  exportToCsv,
  type Submission,
  type SubmissionStatus,
} from "@/lib/submissions";
import { StatCard } from "./StatCard";
import { SubmissionDrawer } from "./SubmissionDrawer";
import { EstimateText } from "@/components/SaudiRiyalSymbol";

const STATUS_MAP: Record<SubmissionStatus, string> = {
  new: "جديد",
  contacted: "تم التواصل",
  confirmed: "مؤكد",
  cancelled: "ملغي",
};

const STATUS_PILL: Record<SubmissionStatus, string> = {
  new: "bg-orange-50 text-orange-700",
  contacted: "bg-blue-50 text-blue-800",
  confirmed: "bg-green-50 text-green-800",
  cancelled: "bg-red-50 text-red-700",
};

const STATUS_DOT: Record<SubmissionStatus, string> = {
  new: "bg-brand-orange",
  contacted: "bg-blue-700",
  confirmed: "bg-green-700",
  cancelled: "bg-red-600",
};

const DEST_HUES: Record<string, number> = {
  georgia: 145, thailand: 180, maldives: 200, armenia: 100,
  bosnia: 130, ukraine: 55, cruise: 220,
};

type Filter = "all" | SubmissionStatus;
type SortField = "createdAt" | "estimate" | "status";

type Props = {
  onNewCount?: (n: number) => void;
};

/* Compute submissions per day for last N days */
function sparkDays(submissions: Submission[], days = 10): number[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const dayStr = d.toDateString();
    return submissions.filter(
      (s) => new Date(s.createdAt).toDateString() === dayStr
    ).length;
  });
}

/* Parse estimate string ("٥٬١٠٠ ê" or "5,100 ر.س") → number for sorting */
function estimateNum(est: string): number {
  const arabicToLatin = est.replace(/[٠-٩]/g, (d) =>
    String("٠١٢٣٤٥٦٧٨٩".indexOf(d))
  );
  return parseInt(arabicToLatin.replace(/[^\d]/g, ""), 10) || 0;
}

export function AdminDashboard({ onNewCount }: Props) {
  const [data, setData] = useState<Submission[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Submission | null>(null);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const reload = useCallback(() => {
    fetchSubmissions().then((all) => {
      setData(all);
      onNewCount?.(all.filter((s) => s.status === "new").length);
    });
  }, [onNewCount]);

  useEffect(reload, [reload]);

  function handleSeed() {
    seedSubmissions();
    setTimeout(reload, 400);
  }

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  /* ----------------------- Derived stats ----------------------- */
  const counts: Record<string, number> = {
    all: data.length,
    new: data.filter((d) => d.status === "new").length,
    contacted: data.filter((d) => d.status === "contacted").length,
    confirmed: data.filter((d) => d.status === "confirmed").length,
    cancelled: data.filter((d) => d.status === "cancelled").length,
  };

  const todayCount = data.filter(
    (d) => Date.now() - new Date(d.createdAt).getTime() < 86_400_000
  ).length;

  const topDest = useMemo(() => {
    if (!data.length) return "—";
    const c: Record<string, number> = {};
    data.forEach((d) => (c[d.dest] = (c[d.dest] ?? 0) + 1));
    return Object.entries(c).sort((a, b) => b[1] - a[1])[0][0];
  }, [data]);

  const convRate = data.length
    ? Math.round((counts.confirmed / data.length) * 100)
    : 0;

  const totalSparkData = useMemo(() => sparkDays(data, 10), [data]);
  const newSparkData = useMemo(
    () => sparkDays(data.filter((d) => d.status === "new"), 10),
    [data]
  );

  /* ----------------------- Filtering + sorting ----------------------- */
  const filtered = useMemo(() => {
    let rows = data.filter((d) => {
      if (filter !== "all" && d.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (![d.name, d.phone, d.ref, d.dest].join(" ").toLowerCase().includes(q))
          return false;
      }
      if (fromDate && d.createdAt < fromDate) return false;
      if (toDate && d.createdAt > toDate + "T23:59:59") return false;
      return true;
    });

    rows = [...rows].sort((a, b) => {
      let cmp = 0;
      if (sortField === "createdAt") {
        cmp = a.createdAt.localeCompare(b.createdAt);
      } else if (sortField === "estimate") {
        cmp = estimateNum(a.estimate) - estimateNum(b.estimate);
      } else if (sortField === "status") {
        cmp = a.status.localeCompare(b.status);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return rows;
  }, [data, filter, search, fromDate, toDate, sortField, sortDir]);

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <span className="opacity-25">↕</span>;
    return <span className="text-brand-orange">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  return (
    <>
      <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1400px] overflow-x-hidden min-w-0 w-full">
        {/* Mobile header bar */}
        <div className="md:hidden flex items-center justify-between mb-4 pb-3 border-b border-black/10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] bg-brand-orange text-white px-2 py-0.5 rounded-full font-black tracking-[0.05em]">إدارة</span>
            <span className="font-heading font-black text-[15px]">فلاي تايمز</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-[12px] text-brand-muted underline">الموقع</Link>
            <button
              onClick={async () => {
                await fetch("/api/admin/logout", { method: "POST" });
                window.location.href = "/admin/login";
              }}
              className="text-[12px] text-brand-muted hover:text-brand-ink font-bold"
            >
              خروج
            </button>
          </div>
        </div>

        {/* Top bar */}
        <div className="flex justify-between items-start mb-6 sm:mb-7 flex-wrap gap-3">
          <div>
            <h1 className="text-[22px] sm:text-[28px] font-black font-heading">طلبات الحجز</h1>
            <div className="text-brand-muted text-[12px] sm:text-[13px] mt-1">
              جميع طلبات الحجز المرسلة من الموقع
            </div>
          </div>
          <div className="flex gap-2 sm:gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => exportToCsv(filtered)}
              className="btn-base border border-black/10 bg-white !text-[12px] sm:!text-[13px] !py-2 sm:!py-2.5 !px-3 sm:!px-4 flex-1 sm:flex-none justify-center"
              title="تصدير النتائج المعروضة فقط"
            >
              ⬇ تصدير CSV
            </button>
            <button
              onClick={reload}
              className="btn-dark !py-2 sm:!py-2.5 !px-3 sm:!px-4 !text-[12px] sm:!text-[13px] flex-1 sm:flex-none justify-center"
            >
              ↻ تحديث
            </button>
          </div>
        </div>

        {/* Seed banner */}
        {data.length === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-5 text-[13px] flex justify-between items-center gap-4">
            <span>لا توجد طلبات بعد؟ أضف بيانات تجريبية لتجربة اللوحة.</span>
            <button onClick={handleSeed} className="text-amber-700 font-bold hover:underline">
              إضافة ٨ طلبات تجريبية →
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-7">
          <StatCard
            label="إجمالي الطلبات"
            value={data.length}
            delta={data.length > 0 ? `+${todayCount} اليوم` : "—"}
            deltaUp={todayCount > 0}
            sparkData={totalSparkData}
          />
          <StatCard
            label="طلبات جديدة"
            value={counts.new}
            delta="بانتظار التواصل"
            sparkData={newSparkData}
          />
          <StatCard
            label="مؤكّدة"
            value={counts.confirmed}
            delta={data.length > 0 ? `${convRate}٪ معدل التحويل` : "—"}
            deltaUp={convRate > 0}
          />
          <StatCard
            label="الوجهة الأكثر طلباً"
            value={topDest}
          />
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-[16px] border border-black/5 p-3 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center mb-2">
          {/* Search */}
          <div className="flex-1 min-w-0 relative">
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[14px] opacity-50">🔍</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث بالاسم، الجوال، رقم الطلب..."
              className="w-full border-none outline-none pr-9 pl-3 py-2 font-body text-[14px] bg-transparent"
            />
          </div>

          {/* Status filters — scroll horizontally on small screens */}
          <div className="flex gap-2 flex-nowrap overflow-x-auto sm:flex-wrap sm:overflow-visible scrollbar-hide -mx-1 px-1 sm:mx-0 sm:px-0">
            {(["all", "new", "contacted", "confirmed", "cancelled"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 px-3 py-1.5 rounded-lg border text-[12px] font-bold transition-all inline-flex items-center gap-1.5 ${
                  filter === f
                    ? "bg-brand-ink text-white border-brand-ink"
                    : "bg-white border-black/10 hover:border-black/30"
                }`}
              >
                {f === "all" ? "الكل" : STATUS_MAP[f as SubmissionStatus]}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${filter === f ? "bg-white/20" : "bg-black/10"}`}>
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Date range filter */}
        <div className="flex gap-2 sm:gap-2.5 items-center mb-4 flex-wrap">
          <span className="text-[12px] text-brand-muted font-bold">من:</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-black/10 rounded-lg px-3 py-1.5 text-[13px] bg-white outline-none focus:border-brand-orange"
          />
          <span className="text-[12px] text-brand-muted font-bold">إلى:</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-black/10 rounded-lg px-3 py-1.5 text-[13px] bg-white outline-none focus:border-brand-orange"
          />
          {(fromDate || toDate) && (
            <button
              onClick={() => { setFromDate(""); setToDate(""); }}
              className="text-[12px] text-red-600 hover:underline font-bold"
            >
              مسح الفلتر ✕
            </button>
          )}
          {(fromDate || toDate) && (
            <span className="text-[12px] text-brand-muted">
              — {filtered.length} نتيجة
            </span>
          )}
        </div>

        {/* Mobile card list */}
        <div className="md:hidden space-y-2.5">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-[14px] border border-black/5 py-14 text-center text-brand-muted">
              <div className="text-[40px] mb-2">📭</div>
              <div className="font-bold text-brand-ink text-[15px] mb-1">
                {data.length ? "لا توجد طلبات مطابقة" : "لا توجد طلبات بعد"}
              </div>
              <p className="text-[13px] max-w-[260px] mx-auto leading-[1.6] px-4">
                {data.length
                  ? "جرّب تغيير الفلتر أو البحث."
                  : "الطلبات من نموذج الحجز ستظهر هنا مباشرة."}
              </p>
              {!data.length && (
                <button onClick={handleSeed} className="btn-orange mt-4 !text-[12px] !py-2.5">
                  إضافة بيانات تجريبية
                </button>
              )}
            </div>
          ) : (
            filtered.map((row) => (
              <button
                key={row.ref}
                onClick={() => setSelected(row)}
                className="block w-full text-right bg-white rounded-[14px] border border-black/5 p-3.5 hover:border-brand-orange/40 transition-colors"
              >
                <div className="flex justify-between items-start gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-[14px] truncate">{row.name}</div>
                    <div className="font-mono text-[11px] text-brand-muted">{row.phone}</div>
                  </div>
                  <span className={`shrink-0 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold ${STATUS_PILL[row.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[row.status]}`} />
                    {STATUS_MAP[row.status]}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 text-[12px]">
                  <span className="inline-flex items-center gap-1.5 font-semibold text-brand-ink/85">
                    <span
                      className="w-2 h-2 rounded-[3px] shrink-0"
                      style={{ background: `oklch(0.55 0.13 ${DEST_HUES[row.destId] ?? 200})` }}
                    />
                    {row.dest}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-brand-orange">{row.ref}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-black/5 flex items-center justify-between text-[11px] text-brand-muted">
                  <span>
                    {row.adults} بالغ{row.children && row.children !== "٠" ? ` + ${row.children} طفل` : ""}
                  </span>
                  <EstimateText value={row.estimate} className="font-heading font-bold text-brand-ink" />
                </div>
                <div className="mt-1 text-[10px] text-brand-muted/80">{fmtDate(row.createdAt)}</div>
              </button>
            ))
          )}
          {filtered.length > 0 && (
            <div className="text-center text-[11px] text-brand-muted pt-2">
              {filtered.length} طلب{filtered.length !== data.length && ` من أصل ${data.length}`}
            </div>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block bg-white rounded-[16px] border border-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-black/[.02] border-b border-black/06">
                  {[
                    { label: "رقم الطلب", field: null },
                    { label: "العميل", field: null },
                    { label: "الوجهة", field: null },
                    { label: "المسافرون", field: null },
                    { label: "التقدير", field: "estimate" as SortField },
                    { label: "التاريخ", field: "createdAt" as SortField },
                    { label: "الحالة", field: "status" as SortField },
                  ].map(({ label, field }) => (
                    <th
                      key={label}
                      onClick={field ? () => toggleSort(field) : undefined}
                      className={`text-right text-[11px] text-brand-muted uppercase tracking-[0.08em] font-bold px-5 py-3.5 ${
                        field ? "cursor-pointer hover:text-brand-ink select-none" : ""
                      }`}
                    >
                      {label}{" "}
                      {field && <SortIcon field={field} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="py-20 text-center text-brand-muted">
                        <div className="text-[48px] mb-3">📭</div>
                        <div className="font-bold text-brand-ink text-[18px] mb-2">
                          {data.length ? "لا توجد طلبات مطابقة" : "لا توجد طلبات بعد"}
                        </div>
                        <p className="text-[14px] max-w-[300px] mx-auto leading-[1.7]">
                          {data.length
                            ? "جرّب تغيير الفلتر أو البحث."
                            : "الطلبات من نموذج الحجز ستظهر هنا مباشرة."}
                        </p>
                        {!data.length && (
                          <button onClick={handleSeed} className="btn-orange mt-5">
                            إضافة بيانات تجريبية
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr
                      key={row.ref}
                      onClick={() => setSelected(row)}
                      className={`border-b border-black/[.04] cursor-pointer transition-colors hover:bg-black/[.015] ${
                        selected?.ref === row.ref ? "bg-orange-50/60" : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <span className="font-mono text-[12px] font-bold text-brand-orange">{row.ref}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-[14px]">{row.name}</div>
                        <div className="font-mono text-[12px] text-brand-muted">{row.phone}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-[13px]">
                          <span
                            className="w-2.5 h-2.5 rounded-[3px] shrink-0"
                            style={{ background: `oklch(0.55 0.13 ${DEST_HUES[row.destId] ?? 200})` }}
                          />
                          {row.dest}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[13px]">
                        {row.adults} بالغ{row.children && row.children !== "٠" ? ` + ${row.children} طفل` : ""}
                      </td>
                      <td className="px-5 py-4 font-heading font-bold text-[14px]">
                        <EstimateText value={row.estimate} />
                      </td>
                      <td className="px-5 py-4 text-brand-muted text-[13px]">{fmtDate(row.createdAt)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${STATUS_PILL[row.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[row.status]}`} />
                          {STATUS_MAP[row.status]}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-black/5 text-[12px] text-brand-muted">
              {filtered.length} طلب معروض
              {filtered.length !== data.length && ` من أصل ${data.length}`}
            </div>
          )}
        </div>
      </main>

      <SubmissionDrawer
        sub={selected}
        onClose={() => setSelected(null)}
        onUpdated={() => {
          fetchSubmissions().then((all) => {
            setData(all);
            onNewCount?.(all.filter((s) => s.status === "new").length);
            if (selected) {
              setSelected(all.find((s) => s.ref === selected.ref) ?? null);
            }
          });
        }}
      />
    </>
  );
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  const diffH = (Date.now() - d.getTime()) / 3_600_000;
  if (diffH < 1) return `قبل ${Math.round(diffH * 60)} دقيقة`;
  if (diffH < 24) return `قبل ${Math.round(diffH)} ساعة`;
  return d.toLocaleDateString("ar-SA", { day: "numeric", month: "short" });
}
