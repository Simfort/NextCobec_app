import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NextCobec — генератор собеседований на основе ИИ",
    short_name: "NextCobec",
    description:
      "Создавайте профессиональные собеседования за минуты с помощью нейросети. Подготовьте вопросы для любой должности и отточите навыки прохождения интервью.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/clever.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/clever.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
