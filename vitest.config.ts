import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    name: "unit",
    include: ["./__tests__/unit/*.{test,spec}.ts"],
    exclude: ["**/node_modules/**", "**/.git/**"],
    environment: "node",
  },
});
