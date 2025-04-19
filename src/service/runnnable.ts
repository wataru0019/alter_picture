import { RunnableSequence, RunnableLambda } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser, StringOutputParser } from "@langchain/core/output_parsers";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import test from "node:test";

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash"
})

async function test_runnable() {
    const prompt = PromptTemplate.fromTemplate(
        "Tell me why sky blue"
    )
    const parser = new StringOutputParser()
    const chain = prompt.pipe(model).pipe(parser)
    const result = await chain.invoke({})
    console.log(result)
    return result
}

async function run() {
    const prompt = PromptTemplate.fromTemplate(
        "Tell me a joke about {topic}"
    )
    const chain = prompt.pipe(model).pipe(new StringOutputParser())

    const analysisPrompt = PromptTemplate.fromTemplate(
        "is ths a funny joke? {joke}"
    )
    const chain2 = analysisPrompt.pipe(model).pipe(new StringOutputParser())

    const snicalPrompt = PromptTemplate.fromTemplate(
        "ジョークの評価を皮肉ってください {analysis}"
    )

    // const composeChain = new RunnableLambda({
    //     func: async (input: {topic: string}) => {
    //         const result = await chain.invoke(input)
    //         return { joke: result }
    //     }
    // })
    //     .pipe(analysisPrompt)
    //     .pipe(model)
    //     .pipe(new StringOutputParser())

    // const result = await composeChain.invoke({topic: "bears"})
    // console.log(result)
    const composedChainWithLambda = RunnableSequence.from([
        chain,
        (input) => ({joke: input}),
        chain2,
        (input) => ({analysis: input}),
        snicalPrompt,
        model,
        new StringOutputParser()
    ])
    const result = await composedChainWithLambda.stream({topic: "beets"})
    for await (const chunk of result) {
        console.log(chunk)
    }
}

run()