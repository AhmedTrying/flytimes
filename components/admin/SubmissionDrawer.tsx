"use client";

import { useEffect, useState } from "react";
import type { Submission, SubmissionStatus } from "@/lib/submissions";
import { updateStatus, deleteSubmission, saveAdminNotes } from "@/lib/submissions";
import { CONTACT, toWhatsappLink, toTelLink } from "@/data/contact";
import { EstimateText } from "@/components/SaudiRiyalSymbol";

const STATUS_MAP: Record<SubmissionStatus, string> = {
  new: "جديد",
  contacted: "تم التواصل",
  confirmed: "مؤكد",
  cancelled: "ملغي",
};

const STATUS_STYLE: Record<SubmissionStatus, string> = {
  new: "bg-orange-50 text-orange-700",
  contacted: "bg-blue-50 text-blue-800",
  confirmed: "bg-green-50 text-green-800",
  cancelled: "bg-red-50 text-red-700",
};

const SERVICE_LABELS: Record<string, string> = {
  inquiry: "استفسار",
  inquiry_book: "استفسار وحجز",
  visa: "تأشيرة",
  flight: "حجز طيران",
  hotel: "حجز فندق",
  study: "دراسة لغة",
  other: "أخرى",
};

const TRIP_LABELS: Record<string, string> = {
  family: "عائلة",
  honeymoon: "شهر عسل",
  friends: "مجموعة أصحاب",
  solo: "فردي",
  business: "عمل",
};

const HOTEL_LABELS: Record<string, string> = {
  "3": "٣ نجوم",
  "4": "٤ نجوم",
  "5": "٥ نجوم",
  luxury: "فاخر / بوتيك",
};

const ADDON_LABELS: Record<string, string> = {
  flights: "حجز طيران",
  visa: "إصدار فيزا",
  car: "تأجير سيارة",
  insurance: "تأمين سفر",
  license: "رخصة دولية",
};

const CHANNEL_LABELS: Record<string, string> = {
  whatsapp: "واتساب",
  phone: "اتصال هاتفي",
  email: "إيميل",
};

/* Pre-filled WhatsApp message templates */
function waTemplates(sub: Submission) {
  return [
    {
      label: "ترحيب",
      msg: `السلام عليكم ${sub.name} 👋\nشكراً لتواصلك مع فلاي تايمز! تلقينا طلبك رقم *${sub.ref}* للسفر إلى *${sub.dest}*.\nسنتواصل معك قريباً بعرض مفصّل. ✈️🌍`,
    },
    {
      label: "متابعة",
      msg: `السلام عليكم ${sub.name}،\nنتابع معك بخصوص طلب السفر رقم *${sub.ref}* إلى *${sub.dest}*.\nهل تودّ الاستمرار في إتمام الحجز؟ نحن هنا لمساعدتك 😊`,
    },
    {
      label: "تأكيد",
      msg: `السلام عليكم ${sub.name} 🎉\nيسعدنا إخبارك بأن حجزك رقم *${sub.ref}* إلى *${sub.dest}* تم تأكيده بنجاح.\nشكراً لثقتك بفلاي تايمز! ✅`,
    },
  ];
}

type Props = {
  sub: Submission | null;
  onClose: () => void;
  onUpdated: () => void;
};

export function SubmissionDrawer({ sub, onClose, onUpdated }: Props) {
  const [notes, setNotes] = useState("");
  const [notesSaving, setNotesSaving] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  // Sync local notes state when drawer opens a new submission
  useEffect(() => {
    setNotes(sub?.adminNotes ?? "");
    setNotesSaved(false);
  }, [sub?.ref]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const isOpen = sub !== null;

  async function handleStatusChange(status: SubmissionStatus) {
    if (!sub) return;
    await updateStatus(sub.ref, status);
    onUpdated();
  }

  async function handleDelete() {
    if (!sub || !confirm("تأكيد حذف الطلب؟")) return;
    await deleteSubmission(sub.ref);
    onClose();
    onUpdated();
  }

  async function handleSaveNotes() {
    if (!sub) return;
    setNotesSaving(true);
    await saveAdminNotes(sub.ref, notes);
    setNotesSaving(false);
    setNotesSaved(true);
    onUpdated();
  }

  function openWhatsApp(msg: string, phone: string) {
    const url = `https://wa.me/${phone.replace(/^0/, "966")}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-200 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 bottom-0 left-0 w-[500px] max-w-[92vw] bg-white z-[70] flex flex-col overflow-y-auto transition-transform duration-[250ms] ease-out shadow-[10px_0_50px_rgba(0,0,0,.12)] ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sub && (
          <>
            {/* Header */}
            <div className="p-7 border-b border-black/6 sticky top-0 bg-white z-10">
              <button
                onClick={onClose}
                className="float-left text-brand-muted text-[20px] leading-none bg-none border-none cursor-pointer hover:text-brand-ink"
                aria-label="إغلاق"
              >
                ✕
              </button>
              <div className="font-mono text-[13px] font-bold text-brand-orange mb-1">{sub.ref}</div>
              <h2 className="text-[22px] font-black">{sub.name}</h2>
              <div className="text-brand-muted text-[13px] mt-1">
                {sub.phone}{sub.email && ` · ${sub.email}`}
              </div>
            </div>

            <div className="flex-1 p-7 space-y-0">

              {/* Status picker */}
              <DrawerSection title="حالة الطلب">
                <div className="flex gap-2 flex-wrap">
                  {(["new", "contacted", "confirmed", "cancelled"] as SubmissionStatus[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className={`px-4 py-2 rounded-full text-[12px] font-bold cursor-pointer transition-all ${STATUS_STYLE[s]} ${
                        sub.status === s ? "outline outline-2 outline-brand-ink outline-offset-2" : ""
                      }`}
                    >
                      {STATUS_MAP[s]}
                    </button>
                  ))}
                </div>
              </DrawerSection>

              {/* WhatsApp templates */}
              <DrawerSection title="رسائل واتساب جاهزة">
                <div className="flex gap-2 flex-wrap">
                  {waTemplates(sub).map((t) => (
                    <button
                      key={t.label}
                      onClick={() => openWhatsApp(t.msg, sub.phone)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/8 text-[#128C7E] text-[12px] font-bold hover:bg-[#25D366]/15 transition-colors"
                    >
                      💬 {t.label}
                    </button>
                  ))}
                </div>
              </DrawerSection>

              {/* Trip details */}
              <DrawerSection title="تفاصيل الرحلة">
                <KV label="الوجهة" value={sub.dest} />
                {sub.trip && <KV label="نوع الرحلة" value={TRIP_LABELS[sub.trip] ?? sub.trip} />}
                {sub.hotel && <KV label="مستوى الفندق" value={HOTEL_LABELS[sub.hotel] ?? sub.hotel} />}
                {sub.duration && <KV label="المدة" value={sub.duration} />}
                <KV label="تاريخ السفر" value={sub.date || "—"} />
                <KV label="البالغون" value={sub.adults} />
                <KV label="الأطفال" value={sub.children} />
                {sub.addons && sub.addons.length > 0 && (
                  <KV
                    label="الإضافات"
                    value={
                      <div className="flex flex-wrap gap-1">
                        {sub.addons.map((a) => (
                          <span key={a} className="bg-brand-orange-soft text-brand-orange-deep text-[11px] font-bold px-2 py-0.5 rounded-full">
                            {ADDON_LABELS[a] ?? a}
                          </span>
                        ))}
                      </div>
                    }
                  />
                )}
                {sub.channel && (
                  <KV label="قناة التواصل" value={CHANNEL_LABELS[sub.channel] ?? sub.channel} />
                )}
                <KV label="الخدمة" value={SERVICE_LABELS[sub.service] ?? sub.service} />
                {sub.city && <KV label="المدينة" value={sub.city} />}
                {sub.estimate && sub.estimate !== "—" && (
                  <KV
                    label="التقدير"
                    value={<EstimateText value={sub.estimate} className="text-brand-orange font-black" />}
                  />
                )}
              </DrawerSection>

              {/* Customer notes */}
              {sub.notes && (
                <DrawerSection title="ملاحظات العميل">
                  <div className="bg-brand-cream px-4 py-3.5 rounded-[10px] text-[14px] leading-[1.7] text-brand-ink/80 border-r-[3px] border-brand-orange">
                    {sub.notes}
                  </div>
                </DrawerSection>
              )}

              {/* Admin internal notes */}
              <DrawerSection title="ملاحظات داخلية للفريق">
                <textarea
                  value={notes}
                  onChange={(e) => { setNotes(e.target.value); setNotesSaved(false); }}
                  placeholder="مثال: العميل طلب تأجيل الحجز — ننتظر تأكيده بعد الإجازة..."
                  rows={3}
                  className="w-full border border-black/10 rounded-xl px-4 py-3 text-[14px] font-body resize-none outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/10 placeholder:text-brand-muted-soft/70"
                />
                <button
                  onClick={handleSaveNotes}
                  disabled={notesSaving}
                  className={`mt-2 px-4 py-2 rounded-lg text-[12px] font-bold transition-all ${
                    notesSaved
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-brand-ink text-white hover:bg-brand-ink/90"
                  } disabled:opacity-60`}
                >
                  {notesSaving ? "جاري الحفظ..." : notesSaved ? "✓ تم الحفظ" : "حفظ الملاحظة"}
                </button>
              </DrawerSection>

              {/* Meta */}
              <DrawerSection title="البيانات التقنية" last>
                <KV label="رقم الطلب" value={<span className="font-mono">{sub.ref}</span>} />
                <KV label="تاريخ الإرسال" value={new Date(sub.createdAt).toLocaleString("ar-SA")} />
              </DrawerSection>
            </div>

            {/* Footer actions */}
            <div className="sticky bottom-0 bg-white border-t border-black/6 p-5 flex gap-2.5 flex-wrap">
              <a href={toTelLink(sub.phone)} className="btn-orange !py-2 !px-4 !text-[13px]">
                📞 اتصل
              </a>
              <a
                href={toWhatsappLink(sub.phone)}
                target="_blank"
                className="btn-white !py-2 !px-4 !text-[13px]"
              >
                💬 واتساب
              </a>
              {sub.email && (
                <a href={`mailto:${sub.email}`} className="btn-white !py-2 !px-4 !text-[13px]">
                  ✉ إيميل
                </a>
              )}
              <div className="flex-1" />
              <button
                onClick={handleDelete}
                className="btn-base border border-red-200 text-red-700 bg-white hover:bg-red-50 !py-2 !px-4 !text-[13px]"
              >
                حذف
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function DrawerSection({
  title,
  children,
  last,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className={`py-5 ${last ? "" : "border-b border-black/06"}`}>
      <div className="text-[11px] text-brand-muted uppercase tracking-[0.08em] font-bold mb-3">
        {title}
      </div>
      {children}
    </div>
  );
}

function KV({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-2 mb-2.5 text-[14px]">
      <span className="text-brand-muted">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
