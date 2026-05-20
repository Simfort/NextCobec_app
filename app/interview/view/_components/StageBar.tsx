"use client";

import { useIsPhone } from "@/lib/hooks/useWindowMedia";
import { useStages } from "@/store/useStages";
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
  return (
    <section className="lg:px-20 max-sm:py-5 max-sm:fixed top-0 max-sm:bg-background max-sm:w-full max-sm:pr-10 max-sm:flex max-sm:justify-center">
      <div className="grid grid-cols-[60px_1fr] max-sm:flex max-sm:items-center ">
        {stages.map((stage, index) => (
          <Fragment key={index}>
            <div className="flex  flex-col">
              <div className="flex items-center max-sm:flex-row flex-col">
                <div className="flex">
                  {" "}
                  <p
                    className={`border  ${index > stageI ? "text-foreground/20 border-foreground/20" : "border-primary"}  text-sm rounded-full size-7 flex items-center justify-center p-2 transition-colors  duration-500`}>
                    {index + 1}
                  </p>
                </div>
                <div className="max-sm:flex">
                  {stage.questions.map((question, indexQuestion) => (
                    <div
                      key={indexQuestion}
                      className={`w-2 h-4 max-sm:w-4 max-sm:h-2 ${(index <= stageI && indexQuestion <= questionI) || index < stageI || question.answerUser ? (index === stageI && indexQuestion === questionI ? "border-primary animate-pulse bg-secondary/20" : "border-primary bg-secondary") : "border-foreground/20"} border transition-colors  duration-500`}></div>
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
