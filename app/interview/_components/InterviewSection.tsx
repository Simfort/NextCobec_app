"use client";

import useStageControllerDB from "@/lib/hooks/useStageControllerDB";
import {
  AudioLines,
  Leaf,
  MessageCircleWarning,
  Pause,
  Send,
  TriangleAlert,
  WifiOff,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import ProgressBar from "./ProgressBar";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import useStatusNetwork from "@/lib/hooks/useStatusNetwork";

const textLoading = "...".split("");
const textStart = "Начните".split("");

export default function InterviewSection() {
  const [description, setDescription] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [progress, setProgress] = useState<number>(0); // прогресс в процентах
  const { addAll, clearAllData } = useStageControllerDB();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const router = useRouter();
  const isOffline = useStatusNetwork();

  const handleSpeech = (): void => {
    const windowWithSpeech = window as unknown as Window & {
      SpeechRecognition: unknown;
      webkitSpeechRecognition: unknown;
    };

    // Проверяем поддержку SpeechRecognition
    if (
      !windowWithSpeech.SpeechRecognition &&
      !windowWithSpeech.webkitSpeechRecognition
    ) {
      setError("Ваш браузер не поддерживает распознавание речи");
      return;
    }

    // Получаем конструктор SpeechRecognition с учётом префиксов
    const SpeechRecognition =
      windowWithSpeech.SpeechRecognition ||
      windowWithSpeech.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Не удалось инициализировать распознавание речи");
      return;
    }

    if (isListening) {
      // Останавливаем распознавание, если оно уже идёт
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    // Создаём новый экземпляр распознавателя
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // Настраиваем параметры
    recognition.continuous = false;
    recognition.lang = "ru-RU"; // Русский язык
    recognition.interimResults = false; // Не показывать промежуточные результаты
    recognition.maxAlternatives = 1;

    // Обработчик успешного распознавания
    recognition.onresult = (event: SpeechRecognitionEvent): void => {
      const transcript = (
        event as unknown as { results: [[{ transcript: string }]] }
      ).results[0][0].transcript;
      // Добавляем распознанный текст к существующему описанию
      setDescription((prev) => prev + " " + transcript);

      setIsListening(false);
      setError(null);
    };

    // Обработчик ошибок
    recognition.onerror = (event: Event): void => {
      console.error("Ошибка распознавания речи:", event);
      let errorMessage = "Произошла ошибка при распознавании речи";

      if ("error" in event) {
        switch (event.error) {
          case "not-allowed":
            errorMessage = "Доступ к микрофону запрещён";
            break;
          case "permission-denied":
            errorMessage = "Необходимо разрешить доступ к микрофону";
            break;
          case "network":
            errorMessage = "Ошибка сети";
            break;
          default:
            errorMessage = `Ошибка: ${event.error}`;
        }
      }

      setError(errorMessage);
      setIsListening(false);
    };

    // Обработчик завершения
    recognition.onend = (): void => {
      setIsListening(false);
    };

    // Запускаем распознавание
    try {
      recognition.start();
      setIsListening(true);
      setError(null);
    } catch (err) {
      console.error("Ошибка запуска распознавания:", err);
      setError("Не удалось запустить распознавание речи");
    }
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    setProgress(0);

    if (!description) {
      setError("Вы не написали описание!");
      setIsLoading(false);
      return;
    }

    try {
      // Этап 1: очистка данных (10%)

      setProgress(10);
      await clearAllData();

      // Этап 2: запрос к API (30%)
      setProgress(30);
      const res = await fetch("/api/interview", {
        method: "POST",
        body: JSON.stringify({ description }),
      });

      const data = await res.json();
      console.log(data);
      setProgress(50);
      // Этап 3: добавление данных в БД (50%)

      await addAll(data);
      localStorage.setItem("last_interview", description);
      // Завершение (100%)
      setProgress(100);
      router.push("/interview/view");
    } catch (error) {
      console.error(error);
      setError("Произошла ошибка при создании собеседования");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 2000);
    }
  };

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <section className="grow shrink-0 flex flex-col py-20 gap-10 max-sm:px-5 items-center justify-center">
      {isOffline && (
        <div className="bg-red-200 p-2 flex items-center gap-2  shadow rounded-md">
          <WifiOff size={20} className="shrink-0 text-red-500 " />
          <p className="text-red-900 font-bold">
            Вы в оффлайн режиме.Создание собеседования недоступно
          </p>
        </div>
      )}
      <Leaf
        size={50}
        fill="green"
        className="text-primary shrink-0 border p-2 rounded-full"
      />
      <AnimatePresence mode="wait">
        {" "}
        {isLoading ? (
          <div className="px-5">
            <motion.h2
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-2xl max-sm:text-xl">
              Создание программы собеседования
              {textLoading.map((point, i) => (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 * i,
                    repeat: Infinity,
                  }}
                  key={i}>
                  {point}
                </motion.span>
              ))}
            </motion.h2>
            <ProgressBar progress={progress} />
          </div>
        ) : (
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl">
            {textStart.map((char, i) => (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: 0.1 * i,
                  ease: "easeOut",
                }}
                key={i}>
                {char}
              </motion.span>
            ))}
          </motion.h1>
        )}
      </AnimatePresence>
      <div className="w-100 max-sm:w-full flex flex-col gap-10">
        <div>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-accent shadow-md shadow-[#00000043]  p-2.5  flex flex-col rounded-md">
            <textarea
              disabled={isOffline}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSubmit();
                }
              }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-describedby="description-interview"
              aria-label="Напишите описание собеседования"
              className="w-full h-34.5 resize-none outline-0"
              placeholder="Описание собеседования"
            />
            <div className="flex w-full gap-2 justify-end">
              <button
                disabled={isLoading}
                onClick={handleSpeech}
                aria-disabled={isLoading}
                aria-label="Записать микрофон"
                className="text-primary disabled:text-accent transition-all not-disabled:cursor-pointer not-disabled:active:opacity-50 not-disabled:hover:opacity-40 bg-foreground/5 p-2 rounded-full">
                {isListening ? (
                  <Pause size={20} className="text-blue-500" />
                ) : (
                  <AudioLines size={20} />
                )}
              </button>{" "}
              <button
                disabled={isLoading}
                onClick={handleSubmit}
                aria-disabled={isLoading}
                aria-label="Отправить собеседование"
                className="text-primary disabled:text-accent  transition-all  not-disabled:cursor-pointer not-disabled:active:opacity-50 not-disabled:hover:opacity-40 bg-foreground/5 p-2 rounded-full">
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        </div>
        {error && (
          <div
            role="alert"
            aria-live="assertive"
            className="bg-red-200 p-2 flex items-center gap-2 shadow rounded-md">
            <TriangleAlert
              size={20}
              className="shrink-0 text-red-500 rotate-y-180"
            />
            <p className="text-red-900 font-bold">{error}</p>
          </div>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="flex flex-col gap-5">
          <h2 className="text-2xl max-sm:text-xl text-center ">Инструкция</h2>
          <div className="flex gap-2">
            <MessageCircleWarning
              size={20}
              className="shrink-0 text-warn rotate-y-180"
            />
            <p id="description-interview" className="text-foreground/80">
              Напишите описание собеседование.В описание пишите,какие вопросы
              хотите видеть и на какой теме сделать акцент.Затем нейросеть
              создаст программу собеседования.В программе будут вопросы в ходе
              которой вы должны отвечать.Под конец она скажет прошли ли вы
              собеседование или нет
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
