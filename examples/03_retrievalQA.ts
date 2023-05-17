/**
 * Example 03: Retrieval QA system
 * 
 * The goal of this example is to embed a group of document, save the embedding to an ephemeral in-memory vector store, and then be able to ask questions about the documents using an LLM.
 * 
 * @see https://docs.langchain.com/docs/use-cases/qa-docs
 * @see https://js.langchain.com/docs/modules/chains/index_related_chains/retrieval_qa
 */

import fs from "node:fs";
import * as dotenv from "dotenv";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { TextLoader } from "langchain/document_loaders/fs/text";

// choose your tensorflow backend we're using the node backend here
import "@tensorflow/tfjs-node";
import { TensorFlowEmbeddings } from "langchain/embeddings/tensorflow";

import { RetrievalQAChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { getUserInput } from "../src/lib/input.ts";
// import { estimateCostEmbedding } from "../src/lib/estimateUsage.ts";


// load environment variables from .env
dotenv.config();

const MAX_TOKENS = 512;

// create a new embeddings instance (we're using TensorFlow which runs on local cpu here to reduce the cost of making queries to the openai embeddings API)
const embeddings = new TensorFlowEmbeddings();

// create embeddings for documents in the ./_sources directory and store in the memory vector store
const splitter = new RecursiveCharacterTextSplitter({ 
  chunkOverlap: 50,  // default 200
  chunkSize: 600,     // default 1000    
});
const documentPaths = fs.readdirSync("./_sources").map(a => `./_sources/${a}`);
const documentChunks = await Promise.all(documentPaths.map(async (path) => {
    const loader = new TextLoader(path);
    return loader.loadAndSplit(splitter);
}));
const flattenedChunks = documentChunks.flat();
const vectorStore = await MemoryVectorStore.fromDocuments(flattenedChunks, embeddings);

// prepare the model
const model = new OpenAI({
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPENAI_API_KEY,
    maxTokens: MAX_TOKENS
  });


while (true) {
    const prompt = await getUserInput("What shall we query (type exit to quit)?");
    if (!prompt || prompt.toLowerCase() === "exit" || prompt.toLowerCase() === "quit") {
        break;
    }
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
    const res = await chain.call({
      query: prompt,
    });
    console.log("\nResponse:\n\n", res, "\n");
}

console.log("See you, space cowboy.");

