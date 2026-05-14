import { estimateToPlainText, formatSAREstimate } from "@/lib/sar";

export type SubmissionStatus = "new" | "contacted" | "confirmed" | "cancelled";

export type Submission = {
  ref: string;
  createdAt: string;
  status: SubmissionStatus;
  // Trip
  dest: string;
  destId: string;
  service: string;
  date: string;
  adults: string;
  children: string;
  city: string;
  notes: string;
  // Contact
  name: string;
  phone: string;
  email: string;
  // Auto-derived
  estimate: string;
  // Wizard extensions (optional to stay backward-compatible with older records/seed)
  trip?: "family" | "honeymoon" | "friends" | "solo" | "business";
  hotel?: "3" | "4" | "5" | "luxury";
  addons?: string[];
  duration?: string;
  channel?: "whatsapp" | "phone" | "email";
  // Admin-only internal notes
  adminNotes?: string;
};

const KEY = "flytimes_submissions";

/* ------------------------------------------------------------------ */
/* Detect whether Supabase is configured at runtime (client-safe)     */
/* ------------------------------------------------------------------ */
function isSupabaseReady(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return (
    url.length > 0 &&
    !url.includes("your-project-id") &&
    key.length > 0 &&
    !key.includes("your-anon-key")
  );
}

/* ------------------------------------------------------------------ */
/* localStorage helpers (fallback / dev mode)                         */
/* ------------------------------------------------------------------ */
export function loadSubmissions(): Submission[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveSubmissions(data: Submission[]): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}

/* ------------------------------------------------------------------ */
/* Public API — routes to Supabase or localStorage automatically      */
/* ------------------------------------------------------------------ */

/**
 * Add a new submission.
 * - Supabase configured → POST /api/submissions (persistent, cross-device)
 * - Otherwise → localStorage (dev/demo fallback)
 */
export async function addSubmission(s: Submission): Promise<void> {
  if (isSupabaseReady()) {
    await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
  } else {
    saveSubmissions([s, ...loadSubmissions()]);
  }
}

/**
 * Load all submissions.
 * - Supabase configured → GET /api/submissions
 * - Otherwise → localStorage
 */
export async function fetchSubmissions(): Promise<Submission[]> {
  if (isSupabaseReady()) {
    const res = await fetch("/api/submissions");
    if (!res.ok) return [];
    return res.json();
  }
  return loadSubmissions();
}

/**
 * Update a submission's status.
 * - Supabase configured → PATCH /api/submissions/:ref
 * - Otherwise → localStorage
 */
export async function updateStatus(ref: string, status: SubmissionStatus): Promise<void> {
  if (isSupabaseReady()) {
    await fetch(`/api/submissions/${ref}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  } else {
    saveSubmissions(loadSubmissions().map((s) => (s.ref === ref ? { ...s, status } : s)));
  }
}

/**
 * Delete a submission.
 * - Supabase configured → DELETE /api/submissions/:ref
 * - Otherwise → localStorage
 */
export async function deleteSubmission(ref: string): Promise<void> {
  if (isSupabaseReady()) {
    await fetch(`/api/submissions/${ref}`, { method: "DELETE" });
  } else {
    saveSubmissions(loadSubmissions().filter((s) => s.ref !== ref));
  }
}

/**
 * Save admin-only internal notes on a submission.
 */
export async function saveAdminNotes(ref: string, adminNotes: string): Promise<void> {
  if (isSupabaseReady()) {
    await fetch(`/api/submissions/${ref}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminNotes }),
    });
  } else {
    saveSubmissions(
      loadSubmissions().map((s) => (s.ref === ref ? { ...s, adminNotes } : s))
    );
  }
}

export function generateRef(): string {
  return "FLY-" + (100000 + Math.floor(Math.random() * 900000));
}

// ------- Seed data -------
const SEED_NAMES = [
  { n: "خالد العتيبي", p: "0556214478", e: "khalid@example.com" },
  { n: "منال الزهراني", p: "0503384492", e: "manal.z@example.com" },
  { n: "فهد القحطاني", p: "0509887621", e: "" },
  { n: "رهف الدوسري", p: "0558142203", e: "rahaf.d@example.com" },
  { n: "عمر الشهري", p: "0541276533", e: "" },
  { n: "نوره البقمي", p: "0553298814", e: "noura@example.com" },
  { n: "سلطان الغامدي", p: "0506712287", e: "" },
  { n: "مها الحارثي", p: "0559823471", e: "maha.h@example.com" },
];

const SEED_DESTS = [
  { id: "georgia", name: "جورجيا", price: 5100 },
  { id: "thailand", name: "تايلند", price: 5950 },
  { id: "maldives", name: "المالديف", price: 9400 },
  { id: "armenia", name: "أرمينيا", price: 4800 },
  { id: "bosnia", name: "البوسنة", price: 5400 },
  { id: "cruise", name: "كروز السعودية", price: 6200 },
];

const SEED_STATUSES: SubmissionStatus[] = [
  "new", "contacted", "confirmed", "new", "contacted", "new", "cancelled", "confirmed",
];

const SEED_NOTES = [
  "نبي فندق قريب من البحر. ممكن إضافة جولات خاصة؟",
  "شهر عسل — ترتيب خاص في أول ليلة من فضلك.",
  "نسافر مع أطفال صغار، نحتاج غرفة عائلية واسعة.",
  "تأجير سيارة فاخرة مع سائق عند الطلب.",
  "",
  "نفضّل فندق في وسط المدينة. الطيران من جدة.",
  "نود تغيير موعد السفر لاحقاً — نرجو التثبيت لمدة أسبوع.",
  "كل شي ممتاز — نؤكد الحجز.",
];

export function seedSubmissions(): void {
  const seeded: Submission[] = SEED_NAMES.map((nm, i) => {
    const d = SEED_DESTS[i % SEED_DESTS.length];
    const adults = ["٢", "٢", "٣", "٢", "٤", "٢", "٥", "٣"][i];
    const children = ["٠", "٠", "٢", "٠", "١", "٠", "٣", "١"][i];
    const daysAgo = [0, 0, 1, 1, 2, 3, 5, 7][i];
    const createdAt = new Date(
      Date.now() - daysAgo * 86_400_000 - Math.random() * 20 * 3_600_000
    ).toISOString();
    const price = Math.round(d.price * [1, 1.25, 1.55, 0.85, 1, 1, 1, 1.25][i]);
    return {
      ref: generateRef(),
      createdAt,
      status: SEED_STATUSES[i],
      dest: d.name,
      destId: d.id,
      service: ["inquiry_book", "inquiry_book", "inquiry", "inquiry_book", "inquiry", "inquiry_book", "visa", "inquiry_book"][i],
      date: "2026-07-" + String(5 + i * 3).padStart(2, "0"),
      adults,
      children,
      city: ["الرياض", "جدة", "الدمام", "الرياض", "جدة", "الرياض", "المدينة", "جدة"][i],
      notes: SEED_NOTES[i],
      name: nm.n,
      phone: nm.p,
      email: nm.e,
      estimate: formatSAREstimate(price),
    };
  });

  if (isSupabaseReady()) {
    // Insert all seed records via API (fire-and-forget from UI)
    Promise.all(seeded.map((s) => addSubmission(s))).catch(console.error);
  } else {
    saveSubmissions(seeded);
  }
}

// ------- CSV Export -------
const SERVICE_LABELS: Record<string, string> = {
  inquiry: "استفسار",
  inquiry_book: "استفسار وحجز",
  visa: "تأشيرة",
  flight: "حجز طيران",
  hotel: "حجز فندق",
  study: "دراسة لغة",
  other: "أخرى",
};

const STATUS_LABELS: Record<string, string> = {
  new: "جديد",
  contacted: "تم التواصل",
  confirmed: "مؤكد",
  cancelled: "ملغي",
};

export function exportToCsv(data: Submission[]): void {
  const headers = [
    "رقم الطلب", "الاسم", "الجوال", "الإيميل",
    "الوجهة", "الخدمة", "البالغون", "الأطفال",
    "المدينة", "تاريخ السفر", "التقدير", "الحالة", "تاريخ الإرسال",
  ];
  const rows = data.map((r) => [
    r.ref, r.name, r.phone, r.email,
    r.dest, SERVICE_LABELS[r.service] ?? r.service,
    r.adults, r.children,
    r.city, r.date, estimateToPlainText(r.estimate ?? ""),
    STATUS_LABELS[r.status] ?? r.status,
    new Date(r.createdAt).toLocaleString("ar-SA"),
  ]);
  const csv =
    "\uFEFF" +
    [headers, ...rows]
      .map((row) => row.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `flytimes-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
}
