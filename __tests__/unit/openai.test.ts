import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import OpenAI from "openai";

// Мокаем модуль openai, чтобы не создавать реальный клиент в тестах
vi.mock("openai", () => {
  return {
    default: class {
      baseURL: string;
      apiKey: string;
      constructor(config: { baseURL: string; apiKey: string }) {
        this.baseURL = config.baseURL;
        this.apiKey = config.apiKey;
      }
    },
  };
});

// Сохраняем исходные значения переменных окружения, чтобы восстановить их после тестов

const originalEnv = process.env;

describe("OpenAI client configuration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("should throw an error if OPEN_ROUTER_API_KEY is not defined", async () => {
    delete process.env.OPEN_ROUTER_API_KEY;

    await expect(import("../../config/openai")).rejects.toThrow(
      "OPEN ROUTER API KEY is not defined",
    );
  });

  it("should create OpenAI client with correct config when API key is defined", async () => {
    process.env.OPEN_ROUTER_API_KEY = "test-api-key";

    const { default: openai } = await import("../../config/openai");

    expect(openai.baseURL).toBe("https://openrouter.ai/api/v1");
    expect(openai.apiKey).toBe("test-api-key");
  });
});
