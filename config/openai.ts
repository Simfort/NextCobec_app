import OpenAI from "openai";

if (!process.env.OPEN_ROUTER_API_KEY) {
  throw new Error("OPEN ROUTER API KEY is not defined");
}
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
});

export default openai;
