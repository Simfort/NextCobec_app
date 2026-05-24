export type Question = {
  id: number;
  question: string;
  answer: string;
  type: "common" | "code" | "select";
  rate: 2;
  answerUser: string;
  passed: null | boolean;
};
export type OnlyStage = {
  id: number;
  stage: string;
};
export type Stage = { id: number; stage: string; questions: Question[] };
export type UseStages = {
  stages: Stage[];
  setStages: (arg: Stage[]) => void;
};

export type ResultInterview = {
  stages: Stage[];
  passed: boolean;
  salary: number;
};
