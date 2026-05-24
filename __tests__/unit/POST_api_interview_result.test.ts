import { POST } from "../../app/api/interview/result/route";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

vi.mock("@/config/openai", () => ({
  default: {
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  },
}));
const mockOpenai = await import("@/config/openai");

describe("POST /api/interview/result", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should return content when stages required", async () => {
    const mockCompletionContent = JSON.stringify({
      stages: [
        {
          id: 0,
          stage: "Creating code",
          questions: [
            {
              id: 0,
              question: "What is a closure in JavaScript?",
              answer:
                "A closure is a function that retains access to its outer function’s variables",
              type: "common",
              rate: 2,
              answerUser:
                "A closure is a function that retains access to its outer function’s variables",
            },
          ],
        },
      ],
      salary: 5000,
      passed: true,
    });
    (mockOpenai.default.chat.completions.create as Mock).mockResolvedValue({
      choices: [
        {
          message: {
            content: mockCompletionContent,
          },
        },
      ],
    });
    const req = new NextRequest("http://localhost/api/interview/result", {
      method: "POST",
      body: JSON.stringify({
        stages: [
          {
            id: 0,
            stage: "Creating code",
            questions: [
              {
                id: 0,
                question: "What is a closure in JavaScript?",
                answer:
                  "A closure is a function that retains access to its outer function’s variables",
                type: "common",
                rate: 2,
                answerUser:
                  "A closure is a function that retains access to its outer function’s variables",
              },
            ],
          },
        ],
      }),
    });

    const response = await POST(req);
    const data = await response.json();
    console.log(data);
    expect(response.status).toBe(200);
    expect(data).toEqual(JSON.parse(mockCompletionContent));
    expect(mockOpenai.default.chat.completions.create).toHaveBeenCalled();
  });
  it("should return 400 when stages is missing", async () => {
    const req = new NextRequest("http://localhost/api/interview/result", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      error: "Некорректные данные: ожидается массив stages",
    });
  });
  it("should return 500 when OpenAI API returns empty response", async () => {
    (mockOpenai.default.chat.completions.create as Mock).mockResolvedValue({
      choices: [
        {
          message: {
            content: "",
          },
        },
      ],
    });

    const req = new NextRequest("http://localhost/api/interview/result", {
      method: "POST",
      body: JSON.stringify({
        stages: [
          {
            id: 0,
            stage: "Creating code",
            questions: [
              {
                id: 0,
                question: "What is a closure in JavaScript?",
                answer:
                  "A closure is a function that retains access to its outer function’s variables",
                type: "common",
                rate: 2,
                answerUser:
                  "A closure is a function that retains access to its outer function’s variables",
              },
            ],
          },
        ],
      }),
    });
    const response = await POST(req);
    const data = await response.json();
    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Пустой ответ от модели" });
  });
  it("should return 500 when OpenAI API returned invalid JSON", async () => {
    (mockOpenai.default.chat.completions.create as Mock).mockResolvedValue({
      choices: [
        {
          message: {
            content: "JSON ",
          },
        },
      ],
    });

    const req = new NextRequest("http://localhost/api/interview/result", {
      method: "POST",
      body: JSON.stringify({
        stages: [
          {
            id: 0,
            stage: "Creating code",
            questions: [
              {
                id: 0,
                question: "What is a closure in JavaScript?",
                answer:
                  "A closure is a function that retains access to its outer function’s variables",
                type: "common",
                rate: 2,
                answerUser:
                  "A closure is a function that retains access to its outer function’s variables",
              },
            ],
          },
        ],
      }),
    });
    const response = await POST(req);

    expect(response.status).toBe(500);
  });
  it("should return 500 when OpenAI API throws an error", async () => {
    (mockOpenai.default.chat.completions.create as Mock).mockRejectedValue(
      new Error("API error"),
    );

    const req = new NextRequest("http://localhost/api/interview/result", {
      method: "POST",
      body: JSON.stringify({
        stages: [
          {
            id: 0,
            stage: "Creating code",
            questions: [
              {
                id: 0,
                question: "What is a closure in JavaScript?",
                answer:
                  "A closure is a function that retains access to its outer function’s variables",
                type: "common",
                rate: 2,
                answerUser:
                  "A closure is a function that retains access to its outer function’s variables",
              },
            ],
          },
        ],
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: "Внутренняя ошибка сервера" });
  });
});
