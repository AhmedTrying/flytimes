export const CONTACT = {
  brand: "فلاي تايمز",
  tagline: "وكالة سياحة وسفر وتعليم في الخارج",
  phones: [
    { label: "واتساب مباشر", value: "0556070547", whatsapp: true },
    { label: "اتصال مباشر", value: "0550643648", whatsapp: false },
  ],
  email: "info@flytimes.sa",
  address: "الرياض · السعودية",
  workingHours: "٢٤/٧ على الواتساب",
} as const;

export const toWhatsappLink = (phone: string) =>
  `https://wa.me/${phone.replace(/^0/, "966").replace(/\D/g, "")}`;

export const toTelLink = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;
