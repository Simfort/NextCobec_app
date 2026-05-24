import { useEffect, useState } from "react";

export default function useIndexDB() {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const openRequest = indexedDB.open("interviewApp", 1);

    openRequest.onerror = function (event) {
      const err =
        (event.target as unknown as { error: Error }).error ||
        new Error("Неизвестная ошибка открытия IndexedDB");
      console.error("Ошибка открытия БД:", err);
      setError(err);
      setIsLoading(false);
    };

    openRequest.onsuccess = function (event) {
      const database = (event.target as IDBOpenDBRequest).result;
      setDb(database);
      console.log("База данных успешно открыта");
      setIsLoading(false);
    };

    openRequest.onupgradeneeded = function (event) {
      const db = (event.target as IDBOpenDBRequest).result;
      console.log("Инициализация базы данных");

      // Создаём хранилище объектов для этапов
      if (!db.objectStoreNames.contains("stages")) {
        const stagesStore = db.createObjectStore("stages", {
          keyPath: "id",
          autoIncrement: true,
        });

        // Создаём индексы для быстрого поиска
        stagesStore.createIndex("stageTitle", "stage", { unique: false });
      }

      // Создаём хранилище для вопросов
      if (!db.objectStoreNames.contains("questions")) {
        const questionsStore = db.createObjectStore("questions", {
          keyPath: "id",
          autoIncrement: true,
        });

        // Индексы для вопросов
        questionsStore.createIndex("questionText", "question", {
          unique: false,
        });
        questionsStore.createIndex("answerText", "answer", { unique: false });
        questionsStore.createIndex("questionType", "type", { unique: false });
        questionsStore.createIndex("questionRate", "rate", { unique: false });
        questionsStore.createIndex("stageId", "stageId", { unique: false }); // связь с этапом
        questionsStore.createIndex("answerUser", "answerUser", {
          unique: false,
        });
        questionsStore.createIndex("passed", "passed", { unique: false });
      }
    };

    // Обработчик блокировки — если другая вкладка пытается обновить версию БД
    openRequest.onblocked = function () {
      console.warn(
        "Открытие БД заблокировано — другая вкладка обновляет версию",
      );
      setError(new Error("БД заблокирована другой вкладкой"));
      setIsLoading(false);
    };
  }, []);

  // Функция для закрытия соединения с БД
  const closeDB = () => {
    if (db) {
      db.close();
      setDb(null);
    }
  };

  // Функция проверки готовности БД
  const isDBReady = !!db && !isLoading && !error;

  return {
    db,
    isLoading,
    error,
    closeDB,
    isDBReady,
  };
}
