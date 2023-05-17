/**
 * Example 02: Simple embedding queries
 * 
 * The goal of this example is to embed a document, save the embedding to an ephemeral in-memory vector store, and query the vector store.
 * 
 * @see https://js.langchain.com/docs/modules/models/embeddings/integrations#tensorflowembeddings
 * @see https://js.langchain.com/docs/modules/models/embeddings/integrations#openaiembeddings
 * @see https://js.langchain.com/docs/modules/indexes/vector_stores/integrations/memory
 */

import fs from "node:fs";
import * as dotenv from "dotenv";

import { TokenTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { TextLoader } from "langchain/document_loaders/fs/text";

// choose your tensorflow backend we're using the node backend here
import "@tensorflow/tfjs-node";
import { TensorFlowEmbeddings } from "langchain/embeddings/tensorflow";
// alternatively
// import { OpenAIEmbeddings } from "langchain/embeddings";

import { getUserInput } from "../src/lib/input.ts";
import { estimateCostEmbedding } from "../src/lib/estimateUsage.ts";


// load environment variables from .env
dotenv.config();


// create a new embeddings instance (we're using TensorFlow which runs on local cpu here to reduce the cost of making queries to the openai embeddings API)
const embeddings = new TensorFlowEmbeddings();
// alternatively 
// import { OpenAIEmbeddings } from "langchain/embeddings/openai";
// const embeddings = new OpenAIEmbeddings(); // note that the OPENAI_API_KEY key must be set in the .env file or the config {openAIApiKey: "your key here"} must be passed to the constructor

// TEST 1. create a new vector store from a simple list of texts and a list of metadata objects
// const vectorStoreOne = await MemoryVectorStore.fromTexts(
//     ["hello", "goodbye", "cat", "ciao"], 
//     [{id: 1}, {id: 2}, {id: 3}, {id: 4}],
//     embeddings
// );
// // search for the 2 most similar vectors to the vector of the word "dog"
// const resultOne = await vectorStoreOne.similaritySearch("dog", 2);
// console.log(resultOne);


// create embeddings for documents in the ./_sources directory
const splitter = new TokenTextSplitter({ 
  chunkOverlap: 50,  // default 200
  chunkSize: 600,     // default 1000    
});
const documentPaths = fs.readdirSync("./_sources").map(a => `./_sources/${a}`);

// TEST 2. Create an embedding for a single document
// TENSORFLOW CPU 
// Tested on Dell Latitude 5420 
// Window 10 enterprise
// 11th Gen Intel(R) Core(TM) i5-1145G7 @ 2.60GHz   1.50 GHz
// 16.0 GB (15.6 GB usable)
// 64-bit operating system, x64-based processor
// doc0 : 44668 chars   48.493s
// doc1 : 4366 chars    5.441s
// doc2 : 5220 chars    7.561s
// doc3 : 14392 chars   15.064s

// TENSORFLOW NODE
// doc0 : 44668 chars   696.79ms
// doc1 : 4366 chars    209.581ms
// doc2 : 5220 chars    262.892ms
// doc3 : 14392 chars   450.868ms

// OpenAI Ada Embeddings
// doc0 : 44668 chars   1.693s  ~$0.0048689   actual $0.0043364 (text-embedding-ada-002-v2, 1 request 10,841 prompt + 0 completion = 10,841 tokens)@$0.0004 per 1k tokens

// const DOC_NUM = 3;
// console.time(`Creating and storing embeddings for document ${DOC_NUM}`);
// const loader = new TextLoader(documentPaths[DOC_NUM]);
// const chunks =  await loader.loadAndSplit(splitter);
// const documentOneSplitEmbeddingCost = chunks.reduce((acc, cur) => acc + estimateCostEmbedding(cur.pageContent), 0);
// await MemoryVectorStore.fromDocuments(chunks, embeddings);
// console.timeEnd(`Creating and storing embeddings for document ${DOC_NUM}`);
// console.log(`cost of embedding if using OpenAI: ~$${documentOneSplitEmbeddingCost}`);


// TEST 3. Create an embedding for multiple documents
// TENSORFLOW NODE 978.34ms
// Tested on Dell Latitude 5420 
// Window 10 enterprise
// 11th Gen Intel(R) Core(TM) i5-1145G7 @ 2.60GHz   1.50 GHz
// 16.0 GB (15.6 GB usable)
// 64-bit operating system, x64-based processor

// OPENAI   1.594s    ~$0.007449199999999999    actual cost
console.time(`Creating and storing embeddings all documents`);
const documentChunks = await Promise.all(documentPaths.map(async (path) => {
    const loader = new TextLoader(path);
    return loader.loadAndSplit(splitter);
}));
const flattenedChunks = documentChunks.flat();
const chunkedDocumentsEmbeddingCost = flattenedChunks.reduce((acc, cur) => acc + estimateCostEmbedding(cur.pageContent), 0);
const vectorStore3 = await MemoryVectorStore.fromDocuments(flattenedChunks, embeddings);
console.timeEnd(`Creating and storing embeddings all documents`);
console.log(`cost of embedding if using OpenAI: ~$${chunkedDocumentsEmbeddingCost}`);

// TEST 4. Query the vector store for similar results
const prompt = await getUserInput("What shall we query?");
const similaritySearchResults = await vectorStore3.similaritySearch(prompt, 2);
console.log("Similarity search results: ", similaritySearchResults);


// NEXT STEP: create a retrieval QA system
// @see https://docs.langchain.com/docs/use-cases/qa-docs
// @see https://js.langchain.com/docs/modules/chains/index_related_chains/retrieval_qa