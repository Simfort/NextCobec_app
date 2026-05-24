export default function registerServiceWorker() {
  // Проверяем, что код выполняется на клиенте
  if (typeof window === "undefined") {
    return;
  }

  // Проверяем поддержку Service Worker
  if (!("serviceWorker" in navigator)) {
    console.warn("Service Worker не поддерживается в этом браузере");
    return;
  }
  const handleLoad = () => {
    try {
      navigator.serviceWorker
        .register("/sw.js") // Укажите путь к вашему Service Worker
        .then((registration: ServiceWorkerRegistration) => {
          console.log("Service Worker зарегистрирован успешно:", registration);
        })
        .catch((error: Error) => {
          console.error("Ошибка регистрации Service Worker:", error);
        });
    } catch (error) {
      console.error(
        "Критическая ошибка при регистрации Service Worker:",
        error,
      );
    }
  };
  window.addEventListener("load", handleLoad);
  return () => window.removeEventListener("load", handleLoad);
}
