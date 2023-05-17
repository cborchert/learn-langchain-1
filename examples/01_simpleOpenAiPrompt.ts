import * as dotenv from "dotenv";
import { OpenAI } from "langchain";
import { getUserInput, requireYes } from "../src/lib/input.ts";
import { ModelName, estimateCostPrompt } from "../src/lib/estimateUsage.ts";

// load environment variables from .env
dotenv.config();

const MAX_TOKENS = 512;

const prompt = await getUserInput("What shall we ask gpt 3.5 turbo?");

const maxCost = estimateCostPrompt(prompt, ModelName.GPT_3_5_TURBO, MAX_TOKENS);
await requireYes(`Potential cost: $${maxCost}\nAre you sure?`);

// create a new model
const model = new OpenAI({
  modelName: "gpt-3.5-turbo",
  openAIApiKey: process.env.OPENAI_API_KEY,
  maxTokens: MAX_TOKENS
});

// send a zero-shot prompt to the model -- took ~10 - 20s during tests
console.log("Sending request...");
console.time("response took");
const res = await model.call(prompt);
console.timeEnd("response took");

console.log(res);
