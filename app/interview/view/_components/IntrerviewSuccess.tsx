"use client";
import { ResultInterview } from "@/lib/types";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, ChevronUp, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function InterviewSuccess({
  result,
}: {
  result: ResultInterview;
}) {
  const [open, setOpen] = useState(false);
  const rightAnswers = result.answer.reduce((a, b) => {
    if (b.success) {
      return a + 1;
    } else {
      return a;
    }
  }, 0);
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const percentEnd = Math.round((rightAnswers / result.answer.length) * 100);
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev < percentEnd) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="bg-background rounded-xl w-200 max-sm:w-full  max-h-200  max-sm:max-h-159 overflow-hidden  flex flex-col items-center">
      {" "}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="text-2xl flex bg-green-100 px-5 w-full max-sm:text-xl items-center justify-center py-2 text-primary  gap-3">
        Собеседование не пройдено <Check size={50} className="max-sm:size-10" />
      </motion.h2>
      <div className="flex p-5 flex-col gap-2 items-center">
        <div className="rounded-full border-primary border size-30 flex items-center justify-center">
          <p className="text-primary text-5xl">{percent}%</p>
        </div>
        <p className="text-sm text-foreground/50">Правильность ответов</p>
      </div>
      <p className="py-5">
        Ваша зарабатная плата -{" "}
        <span className="text-primary">{result.salary} рублей</span>{" "}
      </p>
      <button
        onClick={() => setOpen(!open)}
        className="flex gap-2 w-full bg-accent/50 justify-center py-2 border-accent border-y-2 cursor-pointer hover:opacity-50 active:opacity-40 transition-opacity">
        Ваши ответы{open ? <ChevronUp /> : <ChevronDown />}
      </button>
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="flex  flex-col px-5 py-2 overflow-y-auto overflow-x-hidden  gap-10">
            <div className="flex flex-col gap-10">
              {result.answer.map((answer, index) => (
                <div key={index} className="max-sm:w-80">
                  <h4>
                    {index + 1}.{answer.question}
                  </h4>
                  <div className="bg-accent p-2 rounded-md">
                    {answer.success ? (
                      <p className="text-primary text-sm">
                        {" "}
                        + {answer.answerUser}
                      </p>
                    ) : (
                      <>
                        <p className="text-primary text-sm">
                          {" "}
                          + {answer.answer}
                        </p>{" "}
                        <p className="text-danger text-sm">
                          {" "}
                          - {answer.answerUser}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>{" "}
          </motion.div>
        )}
      </AnimatePresence>
      <Link
        href={"/interview"}
        className="bg-primary text-center   text-background  cursor-pointer hover:opacity-50 active:opacity-40 transition-opacity shadow py-2 w-full">
        Новое собеседование
      </Link>
    </div>
  );
}
