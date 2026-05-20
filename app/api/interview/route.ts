import openai from "@/config/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Получаем описание вакансии из тела запроса
    const { description } = await req.json();

    if (!description) {
      return NextResponse.json(
        { error: "Описание вакансии обязательно" },
        { status: 400 },
      );
    }

    // Формируем промпт для нейросети
    const prompt = `
Ты — опытный HR‑специалист и технический интервьюер. Создай структурированное многоэтапное собеседование по описанию вакансии.

Описание вакансии: "${description}"

Требования к результату:
1. Создай 3–5 этапов собеседования с чёткими названиями.
2. Для каждого этапа придумай  вопросы.
3. Для каждого вопроса укажи:
   - question: сам вопрос (чёткий и конкретный)
   - answer: примерный эталонный ответ (1–3 предложения)
   - rate: сложность вопроса (число от 1 до 5, где 1 — базовый, 5 — сложный)
   - type: написание кода или обычный ответ,должен быть "code" или "common"  

Верни результат строго в формате валидного JSON без дополнительного текста.Толького JSON без лишнего текста. Структура:
[
  {
    "stage": "Название этапа",
    "questions": [
      {
        "question": "Текст вопроса",
        "answer": "Примерный ответ",
        "type":"code",
        
        "rate": 3
      }
    ]
  }
]

Вопросы должны быть разнообразными: теоретические, практические, ситуационные и поведенческие.
    `;

    // Отправляем запрос к модели
    const completion = await openai.chat.completions.create({
      model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free", // Указываем модель
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });
    const result = completion.choices[0].message.content;
    // Извлекаем ответ модели
    if (!result) {
      throw new Error("REsult is undefined");
    }
    const rawResponse = JSON.parse(result);

    // Возвращаем результат
    return NextResponse.json(rawResponse);
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
