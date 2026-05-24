"use client";
import { ResultInterview } from "@/lib/types";
import { useStages } from "@/store/useStages";
import { motion } from "framer-motion";
import { Loader, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import InterviewSuccess from "./IntrerviewSuccess";
import InterviewFailed from "./InterviewFailed";
import useStatusNetwork from "@/lib/hooks/useStatusNetwork";
import useStageControllerDB from "@/lib/hooks/useStageControllerDB";

export default function Final() {
  const { stages, setStages } = useStages();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResultInterview | null>(null);
  const isOffline = useStatusNetwork();
  const { addAll, clearAllData, isDBReady } = useStageControllerDB();
  console.log(result);
  useEffect(() => {
    if (!isOffline && isDBReady) {
      if (!window) return;
      const lastPassed = localStorage.getItem("last_passed");
      const lastSalary = localStorage.getItem("last_salary");

      if (lastPassed && lastSalary && stages.length) {
        setResult({
          stages: stages,
          salary: parseInt(lastSalary),
          passed: JSON.parse(lastPassed),
        });
        return;
      }
      const getResultFinal = async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/interview/result", {
            method: "POST",

            body: JSON.stringify({ stages: stages }),
          });
          const data: ResultInterview = await res.json();
          console.log(data);
          setResult(data);
          await clearAllData();
          await addAll(data.stages);
          setStages(data.stages);
          localStorage.setItem("last_passed", String(data.passed));
          localStorage.setItem("last_salary", String(data.salary));
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      getResultFinal();
    }
  }, [isOffline, isDBReady]);

  useEffect(() => {}, [stages]);

  if (isOffline) {
    return (
      <section className="w-full bg-accent min-h-screen py-20 flex flex-col items-center justify-center gap-8">
        <WifiOff size={50} className="shrink-0 text-red-500 " />
        <h2 className="text-3xl font-semibold text-center">
          Вы в оффлайн режиме
        </h2>
        <p className="text-foreground/50">Вычисление результатов недоступно</p>
      </section>
    );
  }
  if (loading) {
    return (
      <section className="w-full bg-accent min-h-screen py-20 flex flex-col items-center justify-center gap-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-primary">
          <Loader size={80} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-semibold text-center">
          Анализ результатов...
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 text-center max-w-md px-4">
          Система оценивает ваши ответы и формирует итоговый отчёт
        </motion.p>
      </section>
    );
  }

  return (
    <section className="w-full gap-5 max-sm:px-5 bg-accent min-h-screen py-20 flex flex-col items-center justify-center">
      {result && result?.passed ? (
        <InterviewSuccess result={result} />
      ) : (
        result && <InterviewFailed result={result} />
      )}
    </section>
  );
}
