# Intro 

This repo has been copied from the official [Langchain ts starter](https://github.com/domeccleston/langchain-ts-starter/tree/main) repo as a starting point. Thank you 🙏!

# A note about Open AI usage and costs

This project uses the OpenAI API to generate text, for which you need to provide an API key. While new accounts have a small amount of free credit, please remember that this API is *NOT* free to use and you can incur charges relatively quickly. 

I advise you to set up a soft and hard monthly billing limit which seeems acceptable to you [here](https://platform.openai.com/account/billing/limits) before starting to play with this or any other project which uses the OpenAI APIs.

You can monitor your OpenAPI usage [here](https://platform.openai.com/account/usage). Note that it takes a few minutes for the usage to be updated.

Running this project ONCE as it was originally written in the [Langchain ts starter](https://github.com/domeccleston/langchain-ts-starter/tree/main) incurred the following charge:

```
gpt-3.5-turbo-0301, 1 request
24 prompt + 182 completion = 206 tokens
```

At the time of writing, gpt-3.5-tubo costs $0.002 per 1000 tokens, so in the end this cost a mere 0.002 / 1000 * 206 = $0.000412. This is, effectively, nothing, but as you execute longer requests, change to more efficient models, and increase your usage, it could end up costing you money. Please be careful.


# Getting started

- Create a `.env` file by copying `.env.example` and filling in the values
  - For `OPENAI_API_KEY`, you need to have an OpenAI account and create an API key [here](https://platform.openai.com/account/api-keys)
- `npm install` to install dependencies
- `npm start` to run your program


# Dev and build

- `npx turbo run build lint format` to run build scripts quickly in parallel
- `npm start` to run your program


# langchain-ts-starter notes

Boilerplate to get started quickly with the [Langchain Typescript SDK](https://github.com/hwchase17/langchainjs).

This uses the same tsconfig and build setup as the [examples repo](https://github.com/hwchase17/langchainjs/tree/main/examples), to ensure it's in sync with the official docs.
