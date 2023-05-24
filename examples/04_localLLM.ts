/**
 * Example 04: Local LLM
 *
 * The goal of this example is to make a query to a locally hosted llm
 *
 * Note that during the initial run of this program you will be required to install the model, which is several gigabytes and may take a few minutes.
 * Run it and go grab a coffee or call that relative you've avoided talking to for the last 3 years. They miss you.
 *
 * ---
 *
 * Preliminary notes
 *
 * @see https://github.com/imartinez/privateGPT/blob/main/privateGPT.py for inspiration
 * @see https://github.com/Atome-FE/llama-node/blob/main/example/js/langchain/langchain.js node bindings for llama in langchain
 * @see https://huggingface.co/models for downloading models ggl
 *  - @see https://huggingface.co/nomic-ai/gpt4all-lora/tree/main
 *
 * Otherwise, consider
 * - Mounting an LLM as a service in a docker container and an API to access it (python + gpt4all + flask?)
 * - Creating a GPT4All model for langchain.ts
 *  - inspired by @see https://github.com/hwchase17/langchainjs/blob/d60eae5/langchain/src/llms/openai.ts
 *  - and @see https://github.com/nomic-ai/gpt4all-ts/blob/main/src/gpt4all.ts
 *  - and @see https://python.langchain.com/en/latest/modules/models/llms/integrations/gpt4all.html
 * - Port llamacpp as wasm
 *
 * Other resources
 *  @see https://towardsai.net/p/machine-learning/llama-gpt4all-simplified-local-chatgpt
 *
 * ---
 *
 * After further investigation, it seems that there has already been some work in getting gpt4all working with langchain.
 * Notably the npm package [langchainjs-gpt4all](https://www.npmjs.com/package/langchain-gpt4all) which has a pending PR for
 * langchain [here](https://github.com/hwchase17/langchainjs/pull/1204)
 *
 * Note that the current version of gpt4all available on npm (as of 21 May 2023) is *not* working and will give a 404 axios error if you
 * try to instantiate GPT4All. You can work around this by modifying the local file `node_modules/gpt4all/dist/gpt4all.js` so that the hardcoded
 * urls for the binaries match what is currently in the repo https://github.com/nomic-ai/gpt4all-ts/.
 *
 * An issue has been raised [here](https://github.com/nomic-ai/gpt4all-ts/issues/30)
 *
 * Note that we're just using a local version of the package for this exercise.
 *
 */

import { GPT4All } from "gpt4all";
import { getUserInput } from "../src/lib/input.ts";

// Instantiate GPT4All with default or custom settings
const gpt4all = new GPT4All("gpt4all-lora-unfiltered-quantized", true); // Default is 'gpt4all-lora-quantized' model

// Initialize and download missing files
console.log("initializing local gpt");
console.time("initialized local gpt");
await gpt4all.init();
console.timeEnd("initialized local gpt");

// Open the connection with the model
console.log("opening connection to local gpt");
console.time("opened connection to local gpt");
await gpt4all.open();
console.timeEnd("opened connection to local gpt");

// Allow the user to ask questions
while (true) {
  const prompt = await getUserInput("What shall we query (type exit to quit)?");
  if (
    !prompt ||
    prompt.toLowerCase() === "exit" ||
    prompt.toLowerCase() === "quit"
  ) {
    break;
  }
  console.log("prompting");
  console.time("prompt");
  const res = await gpt4all.prompt(prompt);
  console.timeEnd("prompt");
  console.log("\nResponse:\n\n", res, "\n");
}
console.log("closing");
// Close the connection when you're done
gpt4all.close();
console.log("bye");

/**
 * Results:
 *
 * The results are very underwhelming: response times are very long, my computer's fan spun right up, and the model vastly underperforms even gpt3.
 * The local model struggled to produce code, or respond to technical questions, but seemed capable of responding to simple questions or analyzing
 * the tone of a sentence.
 * That said, it's really impressive that we can run this technology locally at all.
 *
 * My personal opinion is that it's better to shell out the money for using gpt 3+ or another hosted model, but it's worth looking into other local solutions in the future.
 *
 *
 * Example:
 *
 * initializing local gpt
 * initialized local gpt: 2.217ms
 * opening connection to local gpt
 * opened connection to local gpt: 11.406s
 * What shall we query (type exit to quit)? what color is the sky?
 * prompting
 * prompt: 5.812s
 *
 * Response:
 *
 * The Sky Is Blue
 *
 * What shall we query (type exit to quit)? How many roads must a man walk down, before you can call him a man ?
 * prompting
 * prompt: 11.190s
 *
 * Response:
 *
 * Four (or more) - as long as he's not just one of them. ����
 *
 * What shall we query (type exit to quit)? Parlez vous français ?
 * prompting
 * prompt: 16.373s
 *
 * Response:
 *
 * Oui ! Je parle un peu le Français, mais je suis toujours prêt à apprendre plus si nécessaire. ���️ ------------------ Parlez-vous espagnol? ¿Hablamos español aquí o solo inglés?
 *
 * What shall we query (type exit to quit)? How do I install python3 on windows?
 * prompting
 * prompt: 26.690s
 *
 * Response:
 *
 * To Install Python3 in Windows, you can follow these steps. 1) Download the latest version of Anaconda from https://www.anacondasoftware.com/downloads/. You will need to download and extract it for this process.  2) Open a terminal or command prompt window (if your operating system is not already set up with one). If you don't have access to the Command Prompt, open Windows Explorer by clicking on Start
 *
 * What shall we query (type exit to quit)? Please write me a javascript function that calculates the nth fibonacci number. The solution should have a time complexity of O(n)
 * prompting
 * prompt: 12.504s
 *
 * Response:
 *
 * anacondasoftware\anaconda2_041719805". This will launch the Conda environment window where all your Python packages are installed and ready to be used, including NumPy etc..
 *
 * What shall we query (type exit to quit)? Please write me a javascript function that calculates the nth fibonacci number. The solution should have a time complexity of O(n)
 * prompting
 * prompt: 21.493s
 *
 * Response:
 *
 *  function getFibNumber (num, nth){
 *     var result = 0; // initialize to zero for first value
 *     ndx=1;//initialize counter variable
 * while((result+Math.pow(-2,-nth))%num!=0 && num
 *
 * What shall we query (type exit to quit)? analyze the following sentence: "Hey jerk face what took you so long?" what can we say about its tone?
 * prompting
 * prompt: 21.244s
 *
 * Response:
 *
 * The use of 'jerk' and 'face' in this context suggests a negative or sarcastic tone. The speaker is likely frustrated with their friend for taking too long to respond, which could be interpreted as rude or condescending towards them.
 *
 */
