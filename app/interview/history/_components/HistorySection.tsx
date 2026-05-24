"use client";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isDBReady) {
      if (window) {
        const descriptionStorage = localStorage.getItem("last_interview");
        const passedStorage = localStorage.getItem("last_passed");

        if (descriptionStorage) {
          setDescription(descriptionStorage);
          if (passedStorage) setPassed(JSON.parse(passedStorage));
          getAllStages()
            .then((stages) => setStages(stages))
            .catch((err) => console.error(err));
        }
      }
    }
  }, [isDBReady]);

  if (!mounted) {
    return null;
  }

  if (!stages.length) {
    return (
      <section className="py-12 px-4 flex items-center justify-center flex-col">
        <div className="max-w-2xl mx-auto text-center">
          <AppWindowMac className="w-16 h-16 mx-auto text-primary/60 mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-4">
            История последнего собеседования
          </h1>
          <p className="text-lg text-foreground/70">
            Пока нет данных о собеседованиях
          </p>{" "}
        </div>{" "}
        <Link href={"/interview"} className="text-primary ">
          Начать собеседование
        </Link>{" "}
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
    <section className="py-12 px-4 bg-background/50">
      <div className="max-w-4xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold max-sm:text-3xl text-foreground mb-2">
            История последнего собеседования
          </h1>
          <p className="text-foreground/70">Ваш прогресс и результаты</p>
        </div>
        {/* Основной блок */}
        <div className="bg-background border border-primary/20 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
          {/* Заголовок собеседования */}
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">
              {description.slice(0, 20)}
              {description.length > 20 && "..."}
            </h2>
          </div>
          {/* Статистика */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Блок с количеством вопросов */}
            <div className="text-center p-6 bg-foreground/5 rounded-xl border border-foreground/10">
              <h3 className="text-lg font-medium text-foreground/80 mb-4">
                Решено вопросов
              </h3>
              <div className="flex items-center justify-center gap-4">
                <div className="p-4 bg-foreground/20 text-4xl font-bold rounded-lg text-foreground/60">
                  {answeredQuestions.answered}
                </div>
                <span className="text-xl text-foreground/60 font-medium">
                  из
                </span>
                <div className="p-4 bg-primary/10 text-4xl font-bold rounded-lg text-primary">
                  {answeredQuestions.all}
                </div>{" "}
                <div className="flex items-center justify-center gap-4">
                  <p className="text-xl text-foreground/60 font-medium">
                    правильных
                  </p>
                  <div
                    className={`p-4 text-${status} bg-${status}/20 text-4xl font-bold rounded-lg `}>
                    {answeredQuestions.rights}
                  </div>
                </div>
              </div>{" "}
            </div>

            {/* Блок статуса прохождения */}
            <div className="text-center p-6 bg-foreground/5 rounded-xl border border-foreground/10">
              <h3 className="text-lg font-medium text-foreground/80 mb-4">
                Статус прохождения
              </h3>
              <div className="flex items-center justify-center gap-2">
                {passed ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500" />
                )}
                <span
                  className={`text-xl font-semibold ${passed ? "text-green-500" : "text-red-500"}`}>
                  {passed ? "Успешно" : "Не завершено"}
                </span>
              </div>
            </div>
          </div>
          {/* Прогресс-бар */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
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
          </div>
          {/* Детализация по этапам */}
          <div className="mt-6">
            <h4 className="text-lg font-medium text-foreground mb-3">
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
                if (percentRights >= 70) {
                  statusQuestion = "primary";
                } else if (percentRights <= 50) {
                  statusQuestion = "danger";
                } else {
                  statusQuestion = "warn";
                }

                return (
                  <div
                    key={stage.id || index}
                    className="p-4 bg-foreground/5 rounded-lg border border-foreground/10">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">
                        {stage.stage || `Этап ${index + 1}`}
                      </span>
                      <span className="text-sm text-foreground/70">
                        {stageAnswered}/{stageTotal}
                      </span>
                    </div>
                    <div className="w-full bg-foreground/10 rounded-full h-2 mt-2 overflow-hidden">
                      <div
                        className={`h-full bg-${statusQuestion} rounded-full transition-all duration-300`}
                        style={{ width: `${stageProgress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>{" "}
          <Link
            href={"/interview/view"}
            className="mt-2 px-5 py-2 block text-center hover:opacity-50 active:opacity-40 transition-opacity rounded-md w-full bg-primary text-background">
            Продолжить
          </Link>
        </div>{" "}
      </div>
    </section>
  );
}
