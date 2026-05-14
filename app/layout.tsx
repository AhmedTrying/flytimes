import type { Metadata } from "next";
import { Cairo, Tajawal, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "فلاي تايمز — وكالة سياحة وسفر وتعليم في الخارج",
  description:
    "بكجات سياحية متكاملة، حجوزات طيران وفنادق، تأشيرات وتعليم اللغة في الخارج — من فلاي تايمز.",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png" }],
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    title: "فلاي تايمز",
    description: "رحلة العمر تبدأ بنقرة واحدة.",
    images: [{ url: "/assets/logo.png" }],
    locale: "ar_SA",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${tajawal.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-brand-cream text-brand-ink font-body antialiased">
        {children}
      </body>
    </html>
  );
}
