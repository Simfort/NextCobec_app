import HistorySection from "./_components/HistorySection";

export const metadata = {
  title: "История собеседований",
  description:
    "Просмотрите результаты последних собеседований, оценки кандидатов и сохранённые заметки.",
  keywords: [
    "история собеседований",
    "результаты интервью",
    "архив собеседований",
    "HR аналитика",
    "оценка кандидатов",
  ],
  openGraph: {
    title: "История собеседований — HR Platform",
    description: "Результаты и аналитика проведённых собеседований.",
    type: "website",
    locale: "ru_RU",
  },
  twitter: {
    card: "summary_large_image",
    title: "История собеседований",
    description:
      "Результаты последних собеседований и аналитика по кандидатам.",
  },
};

export default function Page() {
  return (
    <main className="flex font-bold  flex-col pt-20 max-sm:pt-10 min-h-screen items-center">
      <HistorySection />
    </main>
  );
}
