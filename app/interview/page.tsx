import InterviewSection from "./_components/InterviewSection";

export const metadata = {
  title: "Создать новое собеседование",
  description:
    "Быстро настройте структуру собеседования, добавьте вопросы и пригласите кандидатов в несколько кликов.",
  keywords: [
    "создание собеседования",
    "настройка интервью",
    "HR инструменты",
    "онлайн собеседование",
    "планирование интервью",
  ],
  openGraph: {
    title: "Создать новое собеседование",
    description:
      "Быстро настройте структуру собеседования, добавьте вопросы и пригласите кандидатов.",
    type: "website",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Создать новое собеседование",
    description:
      "Быстро настройте структуру собеседования и пригласите кандидатов.",
  },
};

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen items-center">
      <InterviewSection />
    </main>
  );
}
