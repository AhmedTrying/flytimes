export type Service = {
  id: string;
  label: string;
  desc: string;
  icon:
    | "plane"
    | "bed"
    | "package"
    | "graduation"
    | "visa"
    | "license"
    | "car"
    | "spark";
};

export const SERVICES: Service[] = [
  {
    id: "flights",
    label: "حجوزات طيران",
    desc: "لجميع الوجهات حول العالم، بأفضل الأسعار ومن أقوى شركات الطيران.",
    icon: "plane",
  },
  {
    id: "hotels",
    label: "حجوزات فنادق",
    desc: "فنادق ٤ و٥ نجوم في كل مكان — باتفاقيات مباشرة تضمن لك أفضل سعر.",
    icon: "bed",
  },
  {
    id: "packages",
    label: "بكجات سياحية",
    desc: "بكجات متكاملة للعوائل والعرسان — طيران وفندق وجولات وبوفيه.",
    icon: "package",
  },
  {
    id: "study",
    label: "تعليم لغة في الخارج",
    desc: "برامج لغة إنجليزية في أقوى معاهد العالم مع إجراءات القبول كاملة.",
    icon: "graduation",
  },
  {
    id: "visa",
    label: "إصدار تأشيرات",
    desc: "تأشيرات سياحية، دراسية، علاجية وتجارية بإجراءات سريعة.",
    icon: "visa",
  },
  {
    id: "license",
    label: "رخصة قيادة دولية",
    desc: "استخرج رخصتك الدولية بسرعة وسُق في أي مكان بالعالم بقانونية.",
    icon: "license",
  },
  {
    id: "car",
    label: "استئجار سيارات",
    desc: "سيارات بجميع الفئات — اقتصادية وفاخرة — مع توصيل للفندق أو المطار.",
    icon: "car",
  },
];
