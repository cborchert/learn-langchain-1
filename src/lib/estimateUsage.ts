/**
 * note that these do not necessarily match the actual model names
 * for those, you'll need to check out the OpenAI API docs 
 * @see https://platform.openai.com/docs/models/overview
 */
enum ModelName {
  ADA="ADA",
  BABBAGE="BABBAGE",
  CURIE="CURIE",
  DAVINCI="DAVINCI",
  GPT_3_5_TURBO="GPT_3_5_TURBO",
  GPT_4_PROMPT_8K="GPT_4_PROMPT_8K",
  GPT_4_PROMPT_32K="GPT_4_PROMPT_32K",
  GPT_4_COMPLETE_8K="GPT_4_COMPLETE_8K",
  GPT_4_COMPLETE_32K="GPT_4_COMPLETE_32K",
}

/**
 * Cost in dollars of using the API for 1000 tokens
 * Updated 2023/05/16 
 * @see https://openai.com/pricing
 */
const MODEL_COSTS_PER_1K_TOKENS: {[k in ModelName]: number} = {
  ADA: 0.0004,
  BABBAGE: 0.0005,
  CURIE: 0.002,
  DAVINCI: 0.02,
  GPT_3_5_TURBO: 0.002,
  GPT_4_PROMPT_8K: 0.03,
  GPT_4_PROMPT_32K: 0.06,
  GPT_4_COMPLETE_8K: 0.06,
  GPT_4_COMPLETE_32K: 0.12,
};


/**
 * Estimates the number of tokens used. The rough estimate is the length of the text divided by 4. 
 * Not exact, but good enough for our purposes.
 * @param {string} text the text to estimate
 * @returns {number} the number of tokens used
*/
function estimateTokens(text: string): number {
  return text.length / 4;
}

/**
 * Estimates the cost of the API call. The rough estimate is the number of tokens divided by 1000,
 * multiplied by the cost per thousand tokens.
 * 
 * @param {number} tokens the number of tokens to estimate
 * @param {number} costPerThousandTokens the cost per thousand tokens
 * @returns {number} the cost of the API call
 */
function estimateCostOfTokens(tokens: number, costPerThousandTokens: number): number {
  return tokens / 1000 * costPerThousandTokens;
}


/**
 * Estimates the cost of the API call. The rough estimate is the number of tokens divided by 1000,
 * multiplied by the cost per thousand tokens.
 * 
 * @param {string} text the text to estimate
 * @param {number} costPerThousandTokens the cost per thousand tokens
 * @returns {number} the cost of the API call
 */
function estimateCostOfText(text: string, costPerThousandTokens: number): number {
  return estimateCostOfTokens(estimateTokens(text),  costPerThousandTokens);
}


/**
 * Estimates the cost of creating an embedding for the given text on the OpenAI Ada model.
 * @param text the text to embed
 * @returns the cost of the API call
 */
function estimateCostEmbedding(text: string): number {
  return estimateCostOfText(text, MODEL_COSTS_PER_1K_TOKENS.ADA);
}

function estimateCostPrompt(text: string, model: ModelName = ModelName.GPT_4_COMPLETE_8K, maxTokensToGenerate = 512): number {
  const costPerThousandTokens = MODEL_COSTS_PER_1K_TOKENS[model];
  return estimateCostOfTokens(maxTokensToGenerate, costPerThousandTokens) + estimateCostOfText(text, costPerThousandTokens);
}

export {
  estimateCostEmbedding,
  estimateCostPrompt,
  estimateCostOfText,
  estimateCostOfTokens,
  estimateTokens,
  MODEL_COSTS_PER_1K_TOKENS,
  ModelName,
};