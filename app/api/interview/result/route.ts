import openai from "@/config/openai";
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
Ты — эксперт по оценке технических собеседований. К тебе приходят ответы в формате JSON:

text
[
  
    
      {
        "id": number,
        "stage": string,
        "questions": [{
          "id": number,
          "question": string,
          "answer": string,
          "type": "common" | "code" ,
          "rate": 2,
          "answerUser": string
  }]
      }
    
  
]
Ты сравниваешь question и проверяешь правильное ли ответил answerUser.Оцени ответы кандидата и верни только JSON (без пояснений и лишнего текста) по шаблону:

text
{
  "answer": [
    {
      "question": "текст вопроса",
      "answer": "эталонный ответ",
      "answerUser": "ответ кандидата",
      "success": true/false
    }
  ],
  "salary": число,
  "passed": true/false
}
Правила оценки:

1."success": true, если ответ кандидата соответствует эталонному на ≥ 70 % — учитывается смысловое соответствие, а не только дословное совпадение. Признаки соответствия:
 - ключевые термины и понятия совпадают;
 - основная логика решения верна (для задач на код);
 - суть ответа передана, даже если формулировка другая;
 - незначительные опечатки или синтаксические ошибки не влияют на смысл (для кода);
 - для вопросов с выбором (type: "select") — выбран правильный вариант.
false — если соответствие ниже 70 %, либо ответ отсутствует/не по теме.
3."passed": true при ≥ 70 % успешных ответов ("success": true), иначе false.
4."salary": Достойная цена за работу
Требования:

строго соблюдай структуру и названия полей;
сохраняй дословность текста в полях "question", "answer", "answerUser";
все текстовые значения — в двойных кавычках;
корректный синтаксис JSON;
верни ТОЛЬКО JSON, без каких‑либо комментариев, пояснений или текста до/после JSON.
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
      const result = JSON.parse(responseText);

      // Валидация структуры JSON
      if (
        !Array.isArray(result.answer) ||
        typeof result.salary !== "number" ||
        typeof result.passed !== "boolean"
      ) {
        throw new Error("Неверная структура JSON");
      }

      return NextResponse.json(result);
    } catch (parseError) {
      console.error("Ошибка парсинга JSON от модели:", parseError);
      console.error("Полученный текст:", responseText);

      // Резервный ответ при ошибке парсинга
      return NextResponse.json({
        answer: [],
        salary: 50000,
        passed: false,
      });
    }
  } catch (error) {
    console.error("Ошибка в API /api/check-answers:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
