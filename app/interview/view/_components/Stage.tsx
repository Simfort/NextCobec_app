"use client";

import { Stage as IStage } from "@/lib/types";
import { ArrowLeft, MessageCircleWarning, Section } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Question from "./Question";
import { AnimatePresence, motion } from "framer-motion";
import Final from "./Final";

export default function Stage({ stages }: { stages: IStage[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const stageSearch = searchParams.get("stage");
  const questionSearch = searchParams.get("question");
  const stageIndex = Number(stageSearch);
  const questionIndex = Number(questionSearch);
  const stage = stages[stageIndex];
  const final = searchParams.get("final");

  const handleLetsGo = () => {
    if (!stageSearch) router.push(`?stage=${0}&question=0`);
    if (stageSearch) router.push(`?stage=${stageSearch}&question=0`);
  };
  const handleBack = () => {
    router.push(
      `?stage=${stageIndex - 1}&question=${stages[stageIndex - 1].questions.length - 1}`,
    );
  };
  if (final) {
    return <Final />;
  }
  if (!stageSearch || !questionSearch)
    return (
      <section
        key={stageIndex}
        className="w-full gap-5 bg-accent h-screen flex flex-col items-center justify-center">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-4xl max-sm:text-2xl text-center text-secondary">
          {stage.stage}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-sm text-foreground/50">
          {stage.questions.length} вопроса
        </motion.p>{" "}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex gap-20">
          <button
            onClick={handleBack}
            className=" cursor-pointer flex items-center gap-2  hover:opacity-50 active:opacity-40 transition-colors   rounded-md text-primary">
            <ArrowLeft /> Назад
          </button>
          <button
            onClick={handleLetsGo}
            className="px-5 cursor-pointer shadow hover:opacity-50 active:opacity-40 transition-colors py-2 text-background rounded-md bg-primary">
            Проходить
          </button>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex gap-2 items-center text-foreground/50">
          <MessageCircleWarning className="rotate-y-180" size={20} />
          Прогресс сохраняется
        </motion.p>
      </section>
    );
  return (
    <section className="w-full h-screen gap-5 pt-10  bg-accent max-sm:pt-0 flex flex-col items-center justify-center">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-4xl max-sm:text-2xl max-sm:px-1 text-center text-secondary">
        {stage.stage}
      </motion.h2>
      <div className="flex flex-col gap-5">
        <AnimatePresence mode="wait">
          {" "}
          <Question
            key={stageSearch + questionSearch}
            stage={stageIndex}
            question={stage.questions[questionIndex]}
            index={questionIndex}
          />
        </AnimatePresence>
      </div>
    </section>
  );
}
