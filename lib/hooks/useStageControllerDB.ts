import { OnlyStage, Question, Stage } from "../types";
import useIndexDB from "./useIndexDB";

export default function useStageControllerDB() {
  const { db, isDBReady } = useIndexDB();
  function addAnswer(questionId: number, answer: string) {
    return new Promise((res, rej) => {
      if (!db) return rej("DB IS NOT INIT");
      const transaction = db.transaction(["questions"], "readwrite");
      const store = transaction.objectStore("questions");
      const questionRequest = store.get(questionId);
      questionRequest.onsuccess = () => {
        const question = { ...questionRequest.result, answerUser: answer };
        const putRequest = store.put(question);
        putRequest.onsuccess = () => res("Updated");
        putRequest.onerror = () => res("Not updated");
      };
      questionRequest.onerror = () => {
        rej("error get question");
      };
    });
  }
  function addStage(title: string) {
    return new Promise<number>((resolve, reject) => {
      if (!db) return reject("DB IS NOT INIT");

      const transaction = db.transaction(["stages"], "readwrite");
      const store = transaction.objectStore("stages");
      const request = store.add({ stage: title });

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  function addQuestion(stageId: number, question: Question) {
    return new Promise<number>((resolve, reject) => {
      if (!db) return reject("DB IS NOT INIT");

      const transaction = db.transaction(["questions"], "readwrite");
      const store = transaction.objectStore("questions");
      const request = store.add({ stageId, ...question });

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async function addAll(stages: Stage[]) {
    if (!db) {
      throw new Error("DB IS NOT INIT");
    }

    const results = {
      stagesAdded: 0,
      questionsAdded: 0,
      errors: [] as string[],
    };

    try {
      for (const stage of stages) {
        try {
          // Получаем реальный ID от IndexedDB
          const stageId = await addStage(stage.stage);
          results.stagesAdded++;

          for (const question of stage.questions) {
            try {
              await addQuestion(stageId, { ...question, answerUser: "" });
              results.questionsAdded++;
            } catch (questionError) {
              const errorMsg =
                questionError instanceof Error
                  ? questionError.message
                  : String(questionError);
              results.errors.push(
                `Ошибка добавления вопроса "${question.question}" для этапа "${stage.stage}": ${errorMsg}`,
              );
            }
          }
        } catch (stageError) {
          const errorMsg =
            stageError instanceof Error
              ? stageError.message
              : String(stageError);
          results.errors.push(
            `Ошибка добавления этапа "${stage.stage}": ${errorMsg}`,
          );
        }
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      results.errors.push(`Критическая ошибка в addAll: ${errorMsg}`);
    }

    if (results.errors.length > 0) {
      console.warn(
        "Добавлены этапы:",
        results.stagesAdded,
        "вопросы:",
        results.questionsAdded,
      );
      throw new Error(results.errors.join("; "));
    }

    return results;
  }
  function getAllStages(): Promise<Stage[]> {
    return new Promise((resolve, reject) => {
      if (!db) return reject("DB IS NOT INIT");

      try {
        const transaction = db.transaction(["stages", "questions"], "readonly");
        const stagesStore = transaction.objectStore("stages");
        const questionsStore = transaction.objectStore("questions");

        // Получаем все этапы
        const allStagesRequest = stagesStore.getAll();

        allStagesRequest.onsuccess = async () => {
          try {
            const stages = allStagesRequest.result as OnlyStage[];
            const allStages: Stage[] = [];

            // Для каждого этапа получаем связанные вопросы
            for (const stage of stages) {
              const index = questionsStore.index("stageId");
              const getQuestionsRequest = index.getAll(
                IDBKeyRange.only(stage.id),
              );

              // Ждём ответа по вопросам
              await new Promise<void>((resolveInner, rejectInner) => {
                getQuestionsRequest.onsuccess = () => {
                  const questions = getQuestionsRequest.result as Question[];
                  allStages.push({
                    id: stage.id,
                    stage: stage.stage,
                    questions: questions,
                  });
                  resolveInner();
                };

                getQuestionsRequest.onerror = () => {
                  rejectInner(getQuestionsRequest.error);
                };
              });
            }

            resolve(allStages);
          } catch (error) {
            reject(error);
          }
        };

        allStagesRequest.onerror = () => {
          reject(allStagesRequest.error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  function removeStage(stageId: number) {
    return new Promise<void>((resolve, reject) => {
      if (!db) return reject("DB IS NOT INIT");

      const transaction = db.transaction(["stages", "questions"], "readwrite");
      const questionsStore = transaction.objectStore("questions");
      const stagesStore = transaction.objectStore("stages");

      // Находим все вопросы для этого этапа
      const index = questionsStore.index("stageId");
      const getQuestionsRequest = index.getAllKeys(IDBKeyRange.only(stageId));

      getQuestionsRequest.onsuccess = () => {
        const questionKeys = getQuestionsRequest.result as number[];

        // Удаляем каждый вопрос
        questionKeys.forEach((key) => {
          questionsStore.delete(key);
        });

        // Затем удаляем сам этап
        const deleteStageRequest = stagesStore.delete(stageId);

        deleteStageRequest.onsuccess = () => resolve();
        deleteStageRequest.onerror = () => reject(deleteStageRequest.error);
      };

      getQuestionsRequest.onerror = () => reject(getQuestionsRequest.error);
    });
  }

  const clearAllData = async () => {
    return new Promise<void>((resolve, reject) => {
      if (!db) return reject("БД не инициализирована");

      const transaction = db.transaction(["stages", "questions"], "readwrite");

      const clearStagesRequest = transaction.objectStore("stages").clear();
      const clearQuestionsRequest = transaction
        .objectStore("questions")
        .clear();

      let stagesCleared = false;
      let questionsCleared = false;

      clearStagesRequest.onsuccess = () => {
        stagesCleared = true;
        if (questionsCleared) resolve();
      };
      clearStagesRequest.onerror = () => reject(clearStagesRequest.error);

      clearQuestionsRequest.onsuccess = () => {
        questionsCleared = true;
        if (stagesCleared) resolve();
      };
      clearQuestionsRequest.onerror = () => reject(clearQuestionsRequest.error);
    });
  };

  return {
    clearAllData,
    removeStage,
    addQuestion,
    addStage,
    addAll,
    getAllStages,
    isDBReady,
    addAnswer,
  };
}
