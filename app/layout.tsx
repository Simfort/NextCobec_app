import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import "./globals.css";
import Footer from "./_components/Footer";
import Provider from "./Provider";
import Script from "next/script";
import Ads from "./_components/ADS";

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
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />{" "}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.yaContextCb=window.yaContextCb||[]`,
          }}
        />
        {/* Загрузка основного скрипта Яндекс.RTB */}
        <Script
          src="https://yandex.ru/ads/system/context.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <Ads blockId="R-A-19349016-1" />
        <Provider>{children}</Provider>
        <Footer />
      </body>
    </html>
  );
}
