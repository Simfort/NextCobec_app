"use client";

import useCookie from "@/lib/hooks/useCookie";
import useStageControllerDB from "@/lib/hooks/useStageControllerDB";
import { Stage } from "@/lib/types";
import { AppWindowMac, CheckCircle, XCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HistorySection() {
  const { getAllStages, isDBReady } = useStageControllerDB();
  const [description, setDescription] = useState("");
  const [passed, setPassed] = useState<boolean | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [mounted, setMounted] = useState(false);
  const cookies = useCookie<{ last_interview: string; last_passed: string }>();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isDBReady) {
      if (typeof window !== "undefined") {
        const descriptionStorage = cookies.last_interview;
        const passedStorage = cookies.last_passed;

        if (descriptionStorage) {
          setDescription(descriptionStorage);
          if (passedStorage) setPassed(JSON.parse(passedStorage));
          getAllStages()
            .then((stages) => setStages(stages))
            .catch((err) => console.error(err));
        }
      }
    }
  }, [isDBReady, cookies]);

  if (!mounted) {
    return null;
  }

  if (!stages.length) {
    return (
      <section className="py-8 px-4 flex items-center justify-center flex-col min-h-[60vh]">
        <div className="max-w-md mx-auto text-center">
          <AppWindowMac className="w-12 h-12 mx-auto text-primary/60 mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-3 max-sm:text-xl">
            История последнего собеседования
          </h1>
          <p className="text-base text-foreground/70 mb-6 max-sm:text-sm">
            Пока нет данных о собеседованиях
          </p>
          <Link
            href="/interview"
            className="px-4 py-2 bg-primary text-background rounded-lg hover:opacity-80 transition-opacity text-base max-sm:text-sm">
            Начать собеседование
          </Link>
        </div>
      </section>
    );
  }

  const answeredQuestions = stages.reduce(
    (prevValue, currentStage) => {
      let allAnswered = 0;
      let rights = 0;
      const answered = currentStage.questions.reduce(
        (prevQuestion, currentQuestion) => {
          allAnswered += 1;
          if (currentQuestion.passed) {
            rights += 1;
          }
          if (currentQuestion.answerUser) {
            return prevQuestion + 1;
          } else {
            return prevQuestion;
          }
        },
        0,
      );

      return {
        all: prevValue.all + allAnswered,
        answered: answered + prevValue.answered,
        rights: prevValue.rights + rights,
      };
    },
    { all: 0, answered: 0, rights: 0 },
  );

  const completionPercentage =
    answeredQuestions.all > 0
      ? (answeredQuestions.answered / answeredQuestions.all) * 100
      : 0;
  let status: "primary" | "warn" | "danger" = "danger";
  const percentRights = Math.round(
    (answeredQuestions.rights / answeredQuestions.all) * 100,
  );
  if (percentRights >= 70) {
    status = "primary";
  } else if (percentRights <= 50) {
    status = "danger";
  } else {
    status = "warn";
  }

  return (
    <section className="py-6 px-4 bg-background/50 min-h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-6 max-sm:mb-4">
          <h1 className="text-3xl font-bold max-sm:text-2xl text-foreground mb-2">
            История последнего собеседования
          </h1>
          <p className="text-foreground/70 text-base max-sm:text-sm">
            Ваш прогресс и результаты
          </p>
        </div>
        {/* Основной блок */}
        <div className="bg-background border border-primary/20 rounded-2xl shadow-lg p-6 max-sm:p-4 ">
          {/* Заголовок собеседования */}
          <div className="flex items-center gap-3 mb-6 max-sm:flex-col max-sm:items-start max-sm:gap-2">
            <BookOpen className="w-8 h-8 text-primary max-sm:w-6 max-sm:h-6" />
            <h2 className="text-xl font-semibold text-foreground max-sm:text-lg">
              {description.slice(0, 20)}
              {description.length > 20 && "..."}
            </h2>
          </div>
          {/* Статистика */}
          <div className="grid md:grid-cols-2 gap-6 mb-8 max-sm:gap-4">
            {/* Блок с вопросами */}
            <div className="text-center p-5 bg-foreground/5 rounded-xl border border-foreground/10 max-sm:p-4">
              <h3 className="text-lg font-medium text-foreground/80 mb-4 max-sm:text-base">
                Решено вопросов
              </h3>
              <div className="flex  max-sm:flex-col items-center justify-center gap-4 max-sm:gap-3">
                <div className="p-3 bg-foreground/20 text-3xl font-bold rounded-lg text-foreground/60 max-sm:p-2 max-sm:text-2xl">
                  {answeredQuestions.answered}
                </div>
                <span className="text-xl text-foreground/60 font-medium max-sm:text-lg">
                  из
                </span>
                <div className="p-3 bg-primary/10 text-3xl font-bold rounded-lg text-primary max-sm:p-2 max-sm:text-2xl">
                  {answeredQuestions.all}
                </div>
                <div className="flex items-center justify-center gap-3 max-sm:flex-col">
                  <p className="text-lg text-foreground/60 font-medium max-sm:text-base">
                    правильных
                  </p>
                  <div
                    className={`p-3 text-${status} bg-${status}/20 text-3xl font-bold rounded-lg max-sm:p-2 max-sm:text-2xl`}>
                    {answeredQuestions.rights}
                  </div>
                </div>
              </div>
            </div>

            {/* Блок статуса прохождения */}
            <div className="text-center p-5 bg-foreground/5 rounded-xl border border-foreground/10 max-sm:p-4">
              <h3 className="text-lg font-medium text-foreground/80 mb-4 max-sm:text-base">
                Статус прохождения
              </h3>
              <div className="flex items-center justify-center gap-2 max-sm:gap-1 max-sm:flex-col">
                {passed ? (
                  <CheckCircle className="w-8 h-8 text-green-500 max-sm:w-7 max-sm:h-7" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500 max-sm:w-7 max-sm:h-7" />
                )}
                <span
                  className={`text-xl font-semibold
                  ${passed ? "text-green-500" : "text-red-500"}`}>
                  {passed ? "Успешно" : "Не завершено"}
                </span>
              </div>
            </div>
            {/* Прогресс-бар */}
          </div>
          {/* Детализация по этапам */}
          <div className="mt-6">
            {" "}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <span className="text-sm font-medium text-foreground">
                  Прогресс выполнения
                </span>
                <span className={`text-sm font-medium text-${status}`}>
                  {Math.round(completionPercentage)}%
                </span>
              </div>
              <div className="w-full bg-foreground/10 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full bg-${status} rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <h4 className="text-lg font-medium text-foreground mb-3 max-sm:text-base">
                Детализация по этапам:
              </h4>
              <div className="space-y-3">
                {stages.map((stage, index) => {
                  const stageAnswered = stage.questions.filter(
                    (q) => q.answerUser,
                  ).length;
                  const stageTotal = stage.questions.length;
                  const stageProgress =
                    stageTotal > 0 ? (stageAnswered / stageTotal) * 100 : 0;
                  const questionRights = stage.questions.filter(
                    (question) => question.passed,
                  ).length;
                  const percentQuestionRights = Math.round(
                    (questionRights / stageTotal) * 100,
                  );
                  let statusQuestion = "primary";
                  if (percentQuestionRights >= 70) {
                    statusQuestion = "primary";
                  } else if (percentQuestionRights <= 50) {
                    statusQuestion = "danger";
                  } else {
                    statusQuestion = "warn";
                  }

                  return (
                    <div
                      key={stage.id || index}
                      className="p-4 bg-foreground/5 rounded-lg border border-foreground/10 max-sm:p-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                        <span className="font-medium text-foreground max-sm:text-sm">
                          {stage.stage || `Этап ${index + 1}`}
                        </span>
                        <span className="text-sm text-foreground/70 max-sm:text-xs">
                          {stageAnswered}/{stageTotal}
                        </span>
                      </div>
                      <div className="w-full bg-foreground/10 rounded-full h-2 mt-3 overflow-hidden">
                        <div
                          className={`h-full bg-${statusQuestion} rounded-full transition-all duration-300`}
                          style={{ width: `${stageProgress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <Link
              href="/interview/view"
              className="mt-4 px-5 py-3 block text-center hover:opacity-80 active:opacity-60 transition-opacity rounded-lg w-full bg-primary text-background text-base font-medium max-sm:py-2 max-sm:text-sm">
              Продолжить
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
