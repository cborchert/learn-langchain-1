import * as dotenv from "dotenv";
import { OpenAI } from "langchain";

dotenv.config();

const model = new OpenAI({
  modelName: "gpt-3.5-turbo",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const res = await model.call(
  "What's a good idea for an application to build with GPT-3?"
);

console.log(res);
/*
EXAMPLE OUTPUT: 

One idea for an application to build with GPT-3 could be a personalized writing assistant that helps users generate high-quality content for various purposes. The application could use GPT-3's natural language processing capabilities to suggest ideas, provide structure and grammar suggestions, and assist with research to create compelling articles, blog posts, emails, and other written materials.

The user could input a topic or subject, and the application could provide a set of suggested outlines and keywords to guide the user's writing. The application could also offer suggestions for citations, language style, tone, and other aspects of writing to help users produce polished, error-free content.

The application could also be programmed to learn from user feedback, analyzing the effectiveness of different writing strategies to refine its recommendations over time. With the help of GPT-3, this application could offer users a streamlined, effective way to produce high-quality content quickly and easily.

*/
