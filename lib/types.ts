export type Question = {
  id: number;
  question: string;
  answer: string;
  type: "common" | "code" | "select";
  rate: 2;
  answerUser: string;
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
export type ResultAnswer = {
  question: string;
  answerUser: string;
  answer: string;
  success: boolean;
};
export type ResultInterview = {
  answer: ResultAnswer[];
  passed: boolean;
  salary: number;
};
