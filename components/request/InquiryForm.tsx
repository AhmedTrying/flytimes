"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { EstimateText, SaudiRiyalSymbol } from "@/components/SaudiRiyalSymbol";
import { PACKAGES } from "@/data/packages";
import { formatSAREstimate } from "@/lib/sar";
import { addSubmission, generateRef } from "@/lib/submissions";

/* ------------------------------------------------------------------ */
/* Destinations shown in the picker (matches original inquiry design) */
/* ------------------------------------------------------------------ */
const DEST_IDS = [
  "georgia",
  "thailand",
  "armenia",
  "maldives",
  "bosnia",
  "ukraine",
  "cruise",
] as const;

type Dest = { id: string; name: string; hue: number; price: number; image?: string };

const DESTS: Dest[] = DEST_IDS
  .map((id) => PACKAGES.find((p) => p.id === id))
  .filter((p): p is NonNullable<typeof p> => !!p)
  .map((p) => ({
    id: p.id,
    name: p.name,
    hue: p.hue,
    image: p.image,
    // Fallback price for destinations without a fixed price (e.g. ukraine)
    price: p.price ?? (p.id === "ukraine" ? 4600 : 5000),
  }));

/* ------------------------ Chip option sets ------------------------ */
const TRIP_OPTIONS = [
  { v: "family", label: "عائلة" },
  { v: "honeymoon", label: "شهر عسل" },
  { v: "friends", label: "مجموعة أصحاب" },
  { v: "solo", label: "فردي" },
  { v: "business", label: "عمل" },
] as const;

const HOTEL_OPTIONS = [
  { v: "3", label: "٣ نجوم" },
  { v: "4", label: "٤ نجوم" },
  { v: "5", label: "٥ نجوم" },
  { v: "luxury", label: "فاخر / بوتيك" },
] as const;

const ADDON_OPTIONS = [
  { v: "flights", label: "حجز طيران" },
  { v: "visa", label: "إصدار فيزا" },
  { v: "car", label: "تأجير سيارة" },
  { v: "insurance", label: "تأمين سفر" },
  { v: "license", label: "رخصة دولية" },
] as const;

const CHANNEL_OPTIONS = [
  { v: "whatsapp", label: "واتساب" },
  { v: "phone", label: "اتصال هاتفي" },
  { v: "email", label: "إيميل" },
] as const;

const DURATION_OPTIONS = ["٥ أيام", "٧ أيام", "١٠ أيام", "١٤ يوم", "أخرى"];
const ADULT_OPTIONS = ["١", "٢", "٣", "٤", "٥+"];
const CHILDREN_OPTIONS = ["٠", "١", "٢", "٣+"];

/* ------------------------------ State ---------------------------- */
type TripType = (typeof TRIP_OPTIONS)[number]["v"];
type HotelTier = (typeof HOTEL_OPTIONS)[number]["v"];
type Channel = (typeof CHANNEL_OPTIONS)[number]["v"];

type Errors = Partial<Record<"dest" | "name" | "phone", string>>;

const TRIP_LABEL: Record<TripType, string> = {
  family: "عائلة",
  honeymoon: "شهر عسل",
  friends: "مجموعة أصحاب",
  solo: "فردي",
  business: "عمل",
};

const HOTEL_LABEL: Record<HotelTier, string> = {
  "3": "٣ نجوم",
  "4": "٤ نجوم",
  "5": "٥ نجوم",
  luxury: "فاخر",
};

const CHILDREN_COUNT: Record<string, number> = { "٠": 0, "١": 1, "٢": 2, "٣+": 3 };

/* ===================================================================
 *                         Main Wizard Component
 * =================================================================== */
export function InquiryForm() {
  const params = useSearchParams();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  // Step 1
  const [destId, setDestId] = useState<string>("");
  const [trip, setTrip] = useState<TripType>("family");

  // Step 2
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("٧ أيام");
  const [adults, setAdults] = useState("٢");
  const [children, setChildren] = useState("٠");
  const [hotel, setHotel] = useState<HotelTier>("4");
  const [addons, setAddons] = useState<string[]>([]);

  // Step 3
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [notes, setNotes] = useState("");

  /* Prefill from ?package, ?dest, ?name, ?phone, ?travellers */
  useEffect(() => {
    const pre = params.get("package") ?? params.get("dest");
    if (pre && DESTS.some((d) => d.id === pre)) {
      setDestId(pre);
    }
    const nameParam = params.get("name");
    if (nameParam) setName(nameParam);
    const phoneParam = params.get("phone");
    if (phoneParam) setPhone(phoneParam);
    const travParam = params.get("travellers");
    if (travParam) {
      // Map "2"/"3"/"4" to Arabic adult counts; "5+" → "٥+"
      const map: Record<string, string> = { "2": "٢", "3": "٣", "4": "٤", "5+": "٥+" };
      const mapped = map[travParam];
      if (mapped) setAdults(mapped);
    }
  }, [params]);

  const dest = useMemo(() => DESTS.find((d) => d.id === destId) ?? null, [destId]);

  /* -------- Live price estimate (matches original formula) ------- */
  const estimate = useMemo(() => {
    if (!dest) return null;
    const mult =
      hotel === "5" ? 1.25 : hotel === "luxury" ? 1.55 : hotel === "3" ? 0.85 : 1;
    let price = Math.round(dest.price * mult);
    price += (CHILDREN_COUNT[children] ?? 0) * 1200;
    return formatSAREstimate(price);
  }, [dest, hotel, children]);

  /* ------------------------ Validation --------------------------- */
  function validateStep(n: 1 | 2 | 3): boolean {
    const next: Errors = {};
    if (n === 1 && !destId) next.dest = "اختر وجهة للمتابعة";
    if (n === 3) {
      if (!name.trim() || name.trim().length < 2) next.name = "الرجاء إدخال الاسم";
      if (!/^0?5\d{8}$/.test(phone.replace(/\s/g, ""))) next.phone = "رقم غير صالح";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((s) => (s === 3 ? s : ((s + 1) as 1 | 2 | 3)));
  }

  function goPrev() {
    setErrors({});
    setStep((s) => (s === 1 ? s : ((s - 1) as 1 | 2 | 3)));
  }

  function toggleAddon(v: string) {
    setAddons((a) => (a.includes(v) ? a.filter((x) => x !== v) : [...a, v]));
  }

  /* ------------------------- Submission ------------------------- */
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validateStep(3)) return;
    setLoading(true);

    const newRef = generateRef();

    addSubmission({
      ref: newRef,
      createdAt: new Date().toISOString(),
      status: "new",
      dest: dest?.name ?? "",
      destId: dest?.id ?? "",
      service: "inquiry_book",
      date,
      adults,
      children,
      city: "",
      notes,
      name,
      phone,
      email,
      estimate: estimate ?? "",
      trip,
      hotel,
      addons,
      duration,
      channel,
    });

    setTimeout(() => {
      setSubmittedRef(newRef);
      setLoading(false);
      setSubmitted(true);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 600);
  }

  /* ============================== UI ============================ */

  // Success screen
  if (submitted) {
    return (
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 items-start">
        <div className="bg-white border-2 border-brand-ink rounded-[24px] p-10 md:p-14 text-center">
          <div className="w-20 h-20 rounded-full bg-[#E8F5EC] text-[#1B7F3A] grid place-items-center mx-auto mb-6 text-[44px] font-black">
            ✓
          </div>
          <h2 className="text-[28px] md:text-[34px] font-black mb-2">وصلنا طلبك!</h2>
          <p className="text-brand-muted leading-[1.7] max-w-[420px] mx-auto mb-6">
            شكراً <strong className="text-brand-ink">{name}</strong>. مستشار السفر راح يتواصل معك على{" "}
            <strong className="text-brand-ink font-mono">{phone}</strong> خلال ٣٠ دقيقة بعرض مفصّل.
          </p>
          <div className="inline-flex items-center gap-2 bg-brand-orange-soft text-brand-orange-deep px-5 py-3 rounded-xl font-mono font-bold text-[14px]">
            رقم الطلب: <span>{submittedRef}</span>
          </div>
          <div className="flex gap-3 justify-center flex-wrap mt-8">
            <Link href="/" className="btn-white">
              رجوع للرئيسية
            </Link>
            <Link href="/packages" className="btn-orange">
              تصفّح بكجات أخرى <Icon name="arrow-left" size={16} />
            </Link>
          </div>
        </div>
        <div aria-hidden />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 lg:gap-12 items-start">
      {/* =================== FORM (left column) =================== */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 md:p-8 border-2 border-brand-ink min-w-0"
        noValidate
      >
        {/* Step chips */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map((n) => {
            const active = step === n;
            const done = step > n;
            const titles = ["الوجهة", "التفاصيل", "بياناتك"];
            return (
              <div
                key={n}
                className={[
                  "flex-1 min-w-0 px-2.5 py-2.5 sm:px-3.5 sm:py-3.5 rounded-[12px] sm:rounded-[14px] border flex flex-col gap-1 transition-all",
                  active
                    ? "bg-brand-ink text-white border-brand-ink"
                    : done
                    ? "bg-brand-orange-soft border-brand-orange"
                    : "bg-white border-brand-ink/10",
                ].join(" ")}
              >
                <span className="font-mono text-[10px] sm:text-[11px] opacity-70">
                  {String(n).padStart(2, "0")}
                </span>
                <span className="font-heading font-extrabold text-[13px] sm:text-[14px]">
                  {titles[n - 1]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-brand-ink/10 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-brand-orange transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* --------------------- STEP 1 -------------------- */}
        {step === 1 && (
          <div>
            <FieldLabel
              text="اختر وجهتك"
              small="· يمكنك التغيير لاحقاً"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {DESTS.map((d) => {
                const selected = destId === d.id;
                return (
                  <button
                    type="button"
                    key={d.id}
                    onClick={() => {
                      setDestId(d.id);
                      setErrors((e) => ({ ...e, dest: undefined }));
                    }}
                    className={[
                      "relative aspect-square rounded-[14px] overflow-hidden border-[1.5px] transition-all",
                      selected
                        ? "border-brand-orange border-[2.5px] scale-[1.02]"
                        : "border-brand-ink/10 hover:border-brand-ink/30",
                    ].join(" ")}
                    aria-pressed={selected}
                  >
                    {d.image ? (
                      <>
                        <Image
                          src={d.image}
                          alt={d.name}
                          fill
                          sizes="200px"
                          className="object-cover"
                        />
                        {/* dark overlay so text stays readable */}
                        <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                      </>
                    ) : (
                      <>
                        <span
                          aria-hidden
                          className="absolute inset-0"
                          style={{
                            background: `linear-gradient(160deg, oklch(0.75 0.10 ${d.hue}) 0%, oklch(0.55 0.13 ${d.hue}) 55%, oklch(0.30 0.09 ${d.hue}) 100%)`,
                          }}
                        />
                        <span
                          aria-hidden
                          className="absolute"
                          style={{
                            top: "15%",
                            left: "15%",
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            background:
                              "radial-gradient(circle, oklch(0.92 0.14 80) 0%, transparent 72%)",
                          }}
                        />
                      </>
                    )}
                    {selected && (
                      <span className="absolute top-1.5 left-1.5 w-[22px] h-[22px] rounded-full bg-brand-orange text-white grid place-items-center text-[12px] font-black">
                        ✓
                      </span>
                    )}
                    <span
                      className="absolute bottom-1.5 right-2 font-heading font-black text-white text-[13px]"
                      style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
                    >
                      {d.name}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.dest && <ErrorText>{errors.dest}</ErrorText>}

            <div className="mt-6">
              <FieldLabel text="نوع الرحلة" />
              <ChipGroup
                options={TRIP_OPTIONS}
                value={trip}
                onChange={(v) => setTrip(v as TripType)}
              />
            </div>
          </div>
        )}

        {/* --------------------- STEP 2 -------------------- */}
        {step === 2 && (
          <div>
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <FieldLabel text="تاريخ السفر المقترح" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <FieldLabel text="المدة" />
                <SelectField value={duration} onChange={setDuration} options={DURATION_OPTIONS} />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3.5 mt-4">
              <div>
                <FieldLabel text="عدد البالغين" />
                <SelectField value={adults} onChange={setAdults} options={ADULT_OPTIONS} />
              </div>
              <div>
                <FieldLabel text="عدد الأطفال" />
                <SelectField value={children} onChange={setChildren} options={CHILDREN_OPTIONS} />
              </div>
            </div>

            <div className="mt-5">
              <FieldLabel text="مستوى الإقامة المفضّل" />
              <ChipGroup
                options={HOTEL_OPTIONS}
                value={hotel}
                onChange={(v) => setHotel(v as HotelTier)}
              />
            </div>

            <div className="mt-5">
              <FieldLabel text="تحتاج إضافات؟" />
              <ChipGroup
                multi
                options={ADDON_OPTIONS}
                values={addons}
                onToggle={toggleAddon}
              />
            </div>
          </div>
        )}

        {/* --------------------- STEP 3 -------------------- */}
        {step === 3 && (
          <div>
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <FieldLabel text="الاسم الكامل" small="*" />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: عبدالله المطيري"
                  className={[
                    "input-field",
                    errors.name && "border-[#d93025] focus:border-[#d93025]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
                {errors.name && <ErrorText>{errors.name}</ErrorText>}
              </div>
              <div>
                <FieldLabel text="رقم الجوال" small="*" />
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  type="tel"
                  placeholder="05xxxxxxxx"
                  className={[
                    "input-field font-mono",
                    errors.phone && "border-[#d93025] focus:border-[#d93025]",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
                {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
              </div>
            </div>

            <div className="mt-4">
              <FieldLabel text="البريد الإلكتروني" small="اختياري" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="name@example.com"
                className="input-field"
              />
            </div>

            <div className="mt-5">
              <FieldLabel text="طريقة التواصل المفضّلة" />
              <ChipGroup
                options={CHANNEL_OPTIONS}
                value={channel}
                onChange={(v) => setChannel(v as Channel)}
              />
            </div>

            <div className="mt-5">
              <FieldLabel text="ملاحظات / تفضيلات إضافية" small="اختياري" />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="مثال: نبي فندق قريب من البحر، مع إمكانية إضافة جولات شرق آسيا..."
                className="input-field resize-y min-h-[100px]"
              />
            </div>
          </div>
        )}

        {/* --------------------- Nav buttons ------------------- */}
        <div className="mt-8 pt-6 border-t border-brand-ink/10 flex justify-between items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={goPrev}
            className="btn-white"
            style={{ visibility: step === 1 ? "hidden" : "visible" }}
          >
            السابق
          </button>

          {step < 3 ? (
            <button type="button" onClick={goNext} className="btn-orange">
              التالي <Icon name="arrow-left" size={16} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="btn-orange disabled:opacity-70"
            >
              {loading ? "جاري الإرسال..." : (
                <>
                  أرسل الطلب <Icon name="arrow-left" size={16} />
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* =================== SUMMARY (right column) ================ */}
      <aside className="lg:sticky lg:top-24 space-y-5 min-w-0">
        <div className="bg-brand-ink text-brand-cream rounded-[20px] sm:rounded-[24px] p-5 sm:p-7">
          <h3 className="text-white font-black text-[22px]">ملخص طلبك</h3>
          <p className="text-white/55 text-[13px] mt-1 mb-6">يتحدث مباشرة مع اختياراتك</p>

          <SummaryRow label="الوجهة" value={dest?.name ?? "—"} />
          <SummaryRow label="نوع الرحلة" value={TRIP_LABEL[trip]} />
          <SummaryRow
            label="المسافرون"
            value={`${adults} بالغ${children !== "٠" ? ` + ${children} طفل` : ""}`}
          />
          <SummaryRow label="المدة" value={duration} />
          <SummaryRow label="الفندق" value={HOTEL_LABEL[hotel]} />

          <div className="pt-5 mt-3 border-t-2 border-white/15 flex justify-between items-baseline">
            <div>
              <div className="text-[11px] text-white/55">تقدير أولي · للشخصين</div>
              <div className="font-heading font-black text-[32px] text-brand-orange mt-1">
                {estimate ? (
                  <EstimateText value={estimate} />
                ) : (
                  <>
                    — <SaudiRiyalSymbol className="text-[26px]" />
                  </>
                )}
              </div>
            </div>
            <div className="text-[12px] text-white/55">+ الطيران</div>
          </div>

          <p className="text-[11px] text-white/50 mt-3 leading-[1.7]">
            * السعر تقديري ويتغيّر حسب الموسم والإتاحة. يشمل الفنادق والاستقبال والجولات — لا يشمل الطيران مع إمكانية توفيره.
          </p>
        </div>

        <div className="bg-brand-orange-soft border border-brand-orange/15 rounded-[20px] p-5 flex gap-5">
          <TrustItem icon="🛡" title="حجز آمن" desc="بدون رسوم إلا بعد التأكيد" />
          <TrustItem icon="⚡" title="رد سريع" desc="خلال ٣٠ دقيقة بوقت العمل" />
        </div>
      </aside>
    </div>
  );
}

/* =============================================================== */
/*                      Small presentational helpers              */
/* =============================================================== */

function FieldLabel({ text, small }: { text: string; small?: string }) {
  return (
    <label className="block text-[13px] font-heading font-bold mb-2">
      {text}
      {small && (
        <small className="text-brand-muted-soft font-normal text-[11px] mr-1.5">
          {small}
        </small>
      )}
    </label>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return <div className="text-[#d93025] text-[12px] mt-1.5">{children}</div>;
}

function SelectField({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="input-field appearance-none"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

type ChipGroupSingleProps = {
  multi?: false;
  options: readonly { v: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  values?: never;
  onToggle?: never;
};
type ChipGroupMultiProps = {
  multi: true;
  options: readonly { v: string; label: string }[];
  values: string[];
  onToggle: (v: string) => void;
  value?: never;
  onChange?: never;
};
type ChipGroupProps = ChipGroupSingleProps | ChipGroupMultiProps;

function ChipGroup(props: ChipGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {props.options.map((o) => {
        const selected = props.multi
          ? props.values.includes(o.v)
          : props.value === o.v;
        return (
          <button
            type="button"
            key={o.v}
            onClick={() => (props.multi ? props.onToggle(o.v) : props.onChange(o.v))}
            className={[
              "px-4 py-2.5 rounded-full border-[1.5px] font-heading font-semibold text-[13px] transition-all",
              selected
                ? "bg-brand-ink text-white border-brand-ink"
                : "bg-white text-brand-ink border-brand-ink/12 hover:border-brand-ink/30",
            ].join(" ")}
            aria-pressed={selected}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-3 border-t border-white/8 text-[14px] first:border-t-0">
      <span className="text-white/55">{label}</span>
      <span className="font-heading font-bold">{value}</span>
    </div>
  );
}

function TrustItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-1 flex-1">
      <div className="text-[22px] mb-1 leading-none">{icon}</div>
      <div className="font-heading font-extrabold text-[13px]">{title}</div>
      <div className="text-[11px] text-[#6a5a48] leading-[1.5]">{desc}</div>
    </div>
  );
}
