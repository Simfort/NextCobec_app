"use client";

import { useIsPhone } from "@/lib/hooks/useWindowMedia";
import { useStages } from "@/store/useStages";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment } from "react/jsx-runtime";

export default function StepBar({
  stageI,
  isFinal,
  questionI,
}: {
  stageI: number;
  questionI: number;
  isFinal: boolean;
}) {
  const { stages } = useStages();
  const isPhone = useIsPhone();
  const router = useRouter();
  const handleClickQuestion = (stageIndex: number, questionIndex: number) => {
    if (stages[stageIndex].questions[questionIndex].answerUser)
      router.push(`?stage=${stageIndex}&questions=${questionIndex}`);
  };
  const handleClickStage = (stageIndex: number) => {
    const isAnswered = stages[stageIndex].questions.find(
      (question) => question.answerUser,
    );
    if (isAnswered) router.push(`?stage=${stageIndex}`);
  };
  return (
    <section className="lg:px-20 max-sm:pt-15 max-sm:pb-2  z-10 top-0 max-sm:bg-background max-sm:w-full  max-sm:flex max-sm:justify-center">
      <div className="grid grid-cols-[60px_1fr] max-sm:flex max-sm:items-center ">
        {stages.map((stage, index) => (
          <Fragment key={index}>
            <div className="flex  flex-col">
              <div className="flex items-center max-sm:flex-row flex-col">
                <div className="flex">
                  {" "}
                  <button
                    onClick={() => handleClickStage(index)}
                    className={`border  ${index > stageI ? "text-foreground/20 border-foreground/20" : "border-primary"}  text-sm rounded-full size-7 cursor-pointer flex items-center justify-center p-2 transition-colors  duration-500`}>
                    {index + 1}
                  </button>
                </div>
                <div className="max-sm:flex max-sm:flex-row flex flex-col">
                  {stage.questions.map((question, indexQuestion) => (
                    <button
                      onClick={() => handleClickQuestion(index, indexQuestion)}
                      key={indexQuestion}
                      className={`w-2 h-4 max-sm:w-4.5 max-sm:h-2 ${(index <= stageI && indexQuestion <= questionI) || index < stageI || question.answerUser ? (index === stageI && indexQuestion === questionI ? "border-primary animate-pulse bg-secondary/20" : "border-primary bg-secondary") : "border-foreground/20"} border  cursor-pointer hover:opacity-50 active:opacity-40 transition-all  duration-500`}></button>
                  ))}
                </div>
              </div>
            </div>
            {!isPhone && (
              <div className="flex pt-1 flex-col">
                <p
                  className={`text-sm  ${index > stageI ? "text-foreground/50" : "text-primary"} transition-colors duration-500`}>
                  {stage.stage}
                </p>
              </div>
            )}
          </Fragment>
        ))}
        <h4
          className={`text-center ${isFinal ? "text-primary" : "text-foreground/20"} max-sm:ml-2 `}>
          Final!
        </h4>
      </div>
    </section>
  );
}
