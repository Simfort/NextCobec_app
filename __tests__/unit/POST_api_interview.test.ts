import { POST } from "../../app/api/interview/route"; // замените на реальный путь к вашему эндпоинту
import { NextRequest } from "next/server";
import { vi, describe, it, expect, beforeEach, Mock } from "vitest";

// Мокаем модуль с клиентом OpenAI
vi.mock("@/config/openai", () => ({
  default: {
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  },
}));

// Импортируем мок после объявления vi.mock
const mockOpenai = await import("@/config/openai");

describe("POST /api/interview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return structured interview plan when description is provided", async () => {
    const mockCompletionContent = JSON.stringify([
      {
        stage: "Technical Screening",
        questions: [
          {
            question: "What is a closure in JavaScript?",
            answer:
              "A closure is a function that retains access to its outer function’s variables.",
            type: "common",
            rate: 3,
          },
        ],
      },
    ]);

    (mockOpenai.default.chat.completions.create as Mock).mockResolvedValue({
      choices: [
        {
          message: {
            content: mockCompletionContent,
          },
        },
      ],
    });

    const req = new NextRequest("http://localhost/api/interview", {
      method: "POST",
      body: JSON.stringify({ description: "Senior JavaScript Developer" }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(JSON.parse(mockCompletionContent));
    expect(mockOpenai.default.chat.completions.create).toHaveBeenCalled();
  });

  it("should return 400 when description is missing", async () => {
    const req = new NextRequest("http://localhost/api/interview", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: "Описание вакансии обязательно" });
  });

  it("should return 500 when OpenAI API returns invalid response", async () => {
    (mockOpenai.default.chat.completions.create as Mock).mockResolvedValue({
      choices: [
        {
          message: {
            content: "This is not JSON",
          },
        },
      ],
    });

    const req = new NextRequest("http://localhost/api/interview", {
      method: "POST",
      body: JSON.stringify({ description: "Test" }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Внутренняя ошибка сервера" });
  });

  it("should return 500 when OpenAI API throws an error", async () => {
    (mockOpenai.default.chat.completions.create as Mock).mockRejectedValue(
      new Error("API error"),
    );

    const req = new NextRequest("http://localhost/api/interview", {
      method: "POST",
      body: JSON.stringify({ description: "Test" }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Внутренняя ошибка сервера" });
  });
});
