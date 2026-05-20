"use client";

import useStageControllerDB from "@/lib/hooks/useStageControllerDB";

import { useStages } from "@/store/useStages";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import StepBar from "./StageBar";
import Stage from "./Stage";

export default function StageContainer() {
  const { getAllStages, isDBReady } = useStageControllerDB();
  const { setStages, stages } = useStages();
  const searchParams = useSearchParams();
  const stage = Number(searchParams.get("stage") || 0);
  const question = Number(searchParams.get("question") || -1);
  const isFinal = Boolean(searchParams.get("final"));
  useEffect(() => {
    if (window && isDBReady)
      getAllStages()
        .then((stages) => {
          setStages(stages);
        })
        .catch((err) => console.error(err));
  }, [isDBReady, question]);

  return (
    <section className="flex w-full h-full max-sm:flex-col  items-center">
      <StepBar isFinal={isFinal} stageI={stage} questionI={question} />
      {stages.length && <Stage stages={stages} />}
    </section>
  );
}
