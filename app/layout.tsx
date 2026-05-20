import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import Footer from "./_components/Footer";

const geistSans = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "NextCobec — генератор собеседований на основе ИИ",
    template: "%s | NextCobec",
  },
  description:
    "Создавайте профессиональные собеседования за минуты с помощью нейросети. Подготовьте вопросы для любой должности и отточите навыки прохождения интервью.",
  keywords: [
    "генератор собеседований",
    "ИИ для собеседований",
    "подготовка к собеседованию",
    "вопросы для собеседования",
    "нейросеть для HR",
    "автоматизация собеседований",
    "интервью генератор",
    "искусственный интеллект HR",
    "собеседование онлайн",
    "тренировка собеседований",
  ],
  applicationName: "NextCobec",
  authors: [{ name: "Simfort" }],
  generator: "Next.js",
  creator: "Simfort",
  publisher: "NextCobec",

  // Open Graph (для соцсетей)
  openGraph: {
    title: "NextCobec — генератор собеседований на основе ИИ",
    description:
      "Создавайте профессиональные собеседования за минуты с помощью нейросети.",
    url: "https://www.nextcobec.com",
    siteName: "NextCobec",
    locale: "ru_RU",
    type: "website",
  },

  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "NextCobec — генератор собеседований на основе ИИ",
    description:
      "Создавайте профессиональные собеседования за минуты с помощью нейросети.",
    creator: "@NextCobec",
  },

  // Дополнительные мета-теги
  alternates: {
    canonical: "https://www.nextcobec.com",
  },

  icons: {
    icon: [
      { url: "/clever.png", sizes: "32x32", type: "image/png" },
      {
        url: "/clever.png",
        sizes: "180x180",
        type: "image/png",
        rel: "apple-touch-icon",
      },
    ],
  },

  // Безопасность и производительность
  themeColor: "#01c93d",
  colorScheme: "light dark",

  // Structured Data (JSON-LD)
  other: {
    jsonld: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "NextCobec",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "HR Management",
      description:
        "Генератор собеседований на основе искусственного интеллекта",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "RUB",
      },
    }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Footer />
      </body>
    </html>
  );
}
