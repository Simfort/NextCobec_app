import openai from "@/config/openai";
import { ResultInterview, Stage } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { stages } = await req.json();

    if (!stages || !Array.isArray(stages)) {
      return NextResponse.json(
        { error: "Некорректные данные: ожидается массив stages" },
        { status: 400 },
      );
    }

    const dataString = JSON.stringify(stages, null, 2);

    const prompt = `
Ты — эксперт по оценке технических собеседований. Получаешь данные в формате JSON:

[
  {
    "id": number,
    "stage": string,
    "questions": [
      {
        "id": number,
        "question": string,
        "answer": string,
        "type": "common" | "code",
        "rate": 2,
        "answerUser": string
      }
    ]
  }
]

Оцени, насколько ответ кандидата (answerUser) релевантен вопросу (question). Не используй поле answer для сопоставления. Если answerUser пуст — ставь в passed для этого вопроса false. Верни только JSON по шаблону:

{
  "stages": [
    {
      "id": number,
      "stage": string,
      "questions": [
        {
          "id": number,
          "question": string,
          "answer": string,
          "type": "common" | "code",
          "rate": 2,
          "answerUser": string,
          "passed": boolean
        }
      ]
    }
  ],
  "salary": number,
  "passed": boolean
}

Правила:

- passed в объекте вопроса: true, если ответ в целом покрывает суть вопроса и демонстрирует базовое понимание темы (достаточно существенного смыслового соответствия — не требуется исчерпывающий или идеально точный ответ), иначе false (в том числе если answerUser пустой);
- passed на верхнем уровне: true, если ≥ 70 % вопросов в stages имеют passed: true, иначе false;
- salary: число — достойная цена за работу (в рублях) для специалиста с таким результатом собеседования.

Требования:

- строго соблюдай структуру и названия полей из шаблона;
- сохраняй дословный текст в полях question, answer, answerUser, stage;
- все строки заключай в двойные кавычки;
- возвращай только корректный JSON, без какого-либо текста;
- значения number — без кавычек, boolean — true/false без кавычек.
- оценивай мыгко,необязательно должно быть все в точь в точь.Если есть правильная мысль то засчитывай.

Данные: ${dataString}
`.trim();

    const completion = await openai.chat.completions.create({
      model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    // Безопасное извлечение ответа
    const responseText = completion.choices[0].message.content?.trim();

    if (!responseText) {
      return NextResponse.json(
        { error: "Пустой ответ от модели" },
        { status: 500 },
      );
    }

    try {
      // Попытка парсинга JSON
      const result: ResultInterview = JSON.parse(responseText);

      // Валидация структуры JSON
      if (
        !Array.isArray(result.stages) ||
        typeof result.salary !== "number" ||
        typeof result.passed !== "boolean"
      ) {
        throw new Error("Неверная структура JSON");
      }

      return NextResponse.json(result);
    } catch (parseError) {
      console.error("Ошибка парсинга JSON от модели:", parseError);
      console.error("Полученный текст:", responseText);

      return NextResponse.json(
        {
          stages: [],
          salary: 0,
          passed: false,
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Ошибка в API /api/check-answers:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
