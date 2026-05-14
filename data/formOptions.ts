export const SERVICE_TYPES = [
  { id: "inquiry", label: "استفسار" },
  { id: "inquiry_book", label: "استفسار وحجز رحلة" },
  { id: "visa", label: "تأشيرة" },
  { id: "flight", label: "حجز طيران" },
  { id: "hotel", label: "حجز فندق" },
  { id: "study", label: "دراسة لغة بالخارج" },
  { id: "other", label: "أخرى" },
] as const;

export const PACKAGE_OPTIONS = [
  { id: "maldives", label: "المالديف" },
  { id: "maldives-dubai", label: "المالديف + دبي" },
  { id: "georgia", label: "جورجيا" },
  { id: "ukraine", label: "أوكرانيا" },
  { id: "egypt-full", label: "مصر (القاهرة + شرم الشيخ)" },
  { id: "egypt-sharm", label: "مصر (شرم الشيخ فقط)" },
  { id: "egypt-cairo", label: "مصر (القاهرة فقط)" },
  { id: "bosnia", label: "البوسنة" },
  { id: "azerbaijan", label: "أذربيجان" },
  { id: "albania", label: "ألبانيا" },
  { id: "europe", label: "أوربا" },
  { id: "other", label: "أخرى" },
] as const;

export const TRAVELLER_COUNTS = [
  { id: "2", label: "شخصان" },
  { id: "3", label: "٣ أشخاص" },
  { id: "4", label: "٤ أشخاص" },
  { id: "5+", label: "عائلة ٥+" },
] as const;

export const ANNOUNCEMENTS = [
  "عروض الصيف خصم يصل ٢٠٪",
  "شريحة انترنت مجانية لكل مسافر",
  "فيزا جورجيا ٤٨ ساعة",
  "كروز السعودية — احجز الآن",
  "دفعات ميسّرة بدون فوائد",
];
