import fs from "node:fs";
import * as dotenv from "dotenv";
import { TextLoader } from "langchain/document_loaders";
import { TokenTextSplitter } from "langchain/text_splitter";
import {
  estimateCostEmbedding,
} from "../src/lib/estimateUsage.ts";

// load environment variables from .env
dotenv.config();

// get all filenames from the ./_sources directory
const documentPaths = fs.readdirSync("./_sources").map(a => `./_sources/${a}`);

// load the first file -- the result is an array containing a single Document
// a Document is an object of type
// { pageContent: string, metdata: { source: string, ... }}
// where source is the path passed into the loader
// @see https://js.langchain.com/docs/api/document/classes/Document
const documentOneLoader = new TextLoader(documentPaths[0]);
const documentOne = await documentOneLoader.load();

// get the estimated cost of embedding this document
// ex. a 7,500 word document would cost approx. 0.0044846 dollars to embed using openai's ada api
const documentOneEmbeddingCost = estimateCostEmbedding(documentOne[0].pageContent);
console.log(`cost of embedding a document of ${documentOne[0].pageContent.length} chars: ~$${documentOneEmbeddingCost}`);

// load and splt the text into overlapping chunks
const splitter = new TokenTextSplitter({ 
  chunkOverlap: 50,  // default 200
  chunkSize: 600,     // default 1000    
});
// the result is of type Document[]
const documentOneSplit = await documentOneLoader.loadAndSplit(splitter);

// get the total cost of embedding the overlapping chunks
// ex. embedding the same 7,500 word document as 20 overlapping chunks would cost approx. 0.0048689 dollars, or a 10% increase
const documentOneSplitEmbeddingCost = documentOneSplit.reduce((acc, cur) => acc + estimateCostEmbedding(cur.pageContent), 0);
console.log(`cost of embedding the same document split up into ${documentOneSplit.length} chunks: ~$${documentOneSplitEmbeddingCost}`);
