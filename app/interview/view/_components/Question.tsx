"use client";
import useStageControllerDB from "@/lib/hooks/useStageControllerDB";
import { Question as IQuestion } from "@/lib/types";
import { useStages } from "@/store/useStages";
import { javascript } from "@codemirror/lang-javascript";
import { githubLight } from "@uiw/codemirror-theme-github";
import ReactCodeMirror, { lineNumbers } from "@uiw/react-codemirror";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  AudioLines,
  MessageCircleWarning,
  Pause,
  Star,
  TriangleAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function Question({
  stage,
  question,
  index,
}: {
  stage: number;
  question: IQuestion;
  index: number;
}) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<typeof window.SpeechRecognition | null>(null);
  const [error, setError] = useState<null | string>("");
  const [answer, setAnswer] = useState(question.answerUser);
  const router = useRouter();
  const { stages } = useStages();
  const { addAnswer } = useStageControllerDB();
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
  };
  const handleNext = async () => {
    if (
      stage + 1 >= stages.length &&
      index >= stages[stage].questions.length - 1
    ) {
      router.push(`?stage=${stage}&question=${index}&final=true`);
      await addAnswer(question.id, answer);
    } else if (index >= stages[stage].questions.length - 1) {
      router.push(`?stage=${stage + 1}`);
      await addAnswer(question.id, answer);
    } else {
      await addAnswer(question.id, answer);
      router.push(`?stage=${stage}&question=${index + 1}`);
    }
  };
  const handleBack = () => {
    if (index <= 0) {
      router.push(`?stage=${stage}`);
    } else {
      router.push(`?stage=${stage}&question=${index - 1}`);
    }
  };
  const handleSpeech = () => {
    if (!window.SpeechRecognition) {
      setError("Ваш браузер не поддерживает распознавание речи");
      return;
    }
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
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
    const recognition: typeof window.SpeechRecognition =
      new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.lang = "ru-RU"; // Русский язык
    recognition.interimResults = false; // Не показывать промежуточные результаты
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: SpeechRecognitionEvent): void => {
      const transcript = event.results[0][0].transcript;
      // Добавляем распознанный текст к существующему описанию
      setAnswer((prev) => prev + " " + transcript);

      setIsListening(false);
      setError(null);
    }; // Обработчик ошибок
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
  return (
    <motion.div
      initial={{ opacity: 0, transition: { duration: 1, delay: 0.3 } }}
      animate={{ opacity: 1, transition: { duration: 1, delay: 0.3 } }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="flex flex-col max-sm:items-center p-5 w-200 max-sm:w-full gap-2">
      <h3 className="text-lg ">
        {index + 1}. {question.question}
      </h3>
      <div className="flex gap-1">
        <p className="text-foreground/50 text-sm">Сложность:</p>
        {new Array(question.rate).fill(null).map((_, starIndex) => (
          <Star size={20} key={starIndex} fill="yellow" className="text-warn" />
        ))}
      </div>{" "}
      {question.type == "common" ? (
        <div className="bg-background shadow-md shadow-[#00000043]  p-2.5 max-sm:w-full flex flex-col rounded-md">
          <textarea
            disabled={question.answerUser ? true : false}
            value={answer}
            onChange={handleChange}
            name=""
            id=""
            className="w-full h-34.5 resize-none outline-0"
            placeholder="Ответ на вопрос"
          />
          <div className="flex w-full gap-2 justify-end">
            <button
              onClick={handleBack}
              className="text-primary size-9 disabled:text-accent transition-all not-disabled:cursor-pointer not-disabled:active:opacity-50 not-disabled:hover:opacity-40 bg-foreground/5 p-2 rounded-full">
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={handleSpeech}
              className="text-primary size-9 disabled:text-accent transition-all not-disabled:cursor-pointer not-disabled:active:opacity-50 not-disabled:hover:opacity-40 bg-foreground/5 p-2 rounded-full">
              {isListening ? (
                <Pause size={20} className="text-blue-500" />
              ) : (
                <AudioLines size={20} />
              )}
            </button>{" "}
            <button
              onClick={handleNext}
              disabled={isListening || !answer}
              className="bg-primary disabled:text-accent  disabled:bg-background transition-all  not-disabled:cursor-pointer not-disabled:active:opacity-50 not-disabled:hover:opacity-40 text-sm text-background p-2 rounded-md">
              Дальше
            </button>
          </div>
          {error && (
            <div className="bg-red-200 mt-2 p-2 flex items-center gap-2 shadow rounded-md">
              <TriangleAlert
                size={20}
                className="shrink-0 text-red-500 rotate-y-180"
              />
              <p className="text-red-900 font-bold">{error}</p>
            </div>
          )}
        </div>
      ) : (
        <>
          {" "}
          <ReactCodeMirror
            value={answer}
            height="200px"
            className="max-sm:w-full"
            theme={githubLight}
            readOnly={question.answerUser ? true : false}
            extensions={[javascript({ jsx: true }), lineNumbers()]}
            onChange={(value) => setAnswer(value)}
          />{" "}
          <div className="flex w-full gap-2 justify-end">
            <button
              onClick={handleBack}
              className="text-primary size-9 disabled:text-accent transition-all not-disabled:cursor-pointer not-disabled:active:opacity-50 not-disabled:hover:opacity-40 bg-foreground/5 p-2 rounded-full">
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={handleSpeech}
              className="text-primary size-9 disabled:text-accent transition-all not-disabled:cursor-pointer not-disabled:active:opacity-50 not-disabled:hover:opacity-40 bg-foreground/5 p-2 rounded-full">
              {isListening ? (
                <Pause size={20} className="text-blue-500" />
              ) : (
                <AudioLines size={20} />
              )}
            </button>{" "}
            <button
              onClick={handleNext}
              disabled={isListening || !answer}
              className="bg-primary disabled:text-accent  disabled:bg-background transition-all  not-disabled:cursor-pointer not-disabled:active:opacity-50 not-disabled:hover:opacity-40 text-sm text-background p-2 rounded-md">
              Дальше
            </button>
          </div>
          {error && (
            <div className="bg-red-200 mt-2 p-2 flex items-center gap-2 shadow rounded-md">
              <TriangleAlert
                size={20}
                className="shrink-0 text-red-500 rotate-y-180"
              />
              <p className="text-red-900 font-bold">{error}</p>
            </div>
          )}
        </>
      )}
      <div className="self-center flex gap-2">
        <MessageCircleWarning
          size={20}
          className="text-warn shrink-0 rotate-y-180"
        />
        <p className="text-foreground/40  ">
          После нажатия кнопки `дальшe` нельзя будет изменить свой ответ
        </p>
      </div>
    </motion.div>
  );
}
