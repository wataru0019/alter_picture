// import { ChatAnthropic } from '@langchain/anthropic';
import { z } from 'zod';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StringOutputParser, StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

// const model = new ChatAnthropic({
//     model: 'claude-3-5-haiku-20241022',
//     temperature: 0.7,
// })

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    maxOutputTokens: 2048,
  });

const messages = [
    new SystemMessage("You are SVG designer."),
    new HumanMessage("Create a simple SVG image of a PC."),
  ];


export async function ai_chat() {
    const response = await model.invoke(messages);
    console.log(response.content);
    return response.content;
}

async function chaintool() {
    const prompt1 = new PromptTemplate({
        template:"Say {Joke}",
        inputVariables: ["Joke"],
    })
    const parser1 = new StringOutputParser();
    const chain1 = prompt1.pipe(model).pipe(parser1);
    const prompt2 = new PromptTemplate({
        template:"you are revire this {joke}",
        inputVariables: ["joke"],
    })
    const parser2 = new StringOutputParser();
    const chain2 = prompt2.pipe(model).pipe(parser2);
    const chain = chain1.pipe(chain2);
}

async function main() {
    // const prompt = ChatPromptTemplate.fromTemplate("tell me a joke about {topic}");
    // const chain = prompt.pipe(model).pipe(new StringOutputParser());
    const svgSchema = z.object({
        svg: z.string().describe('SVG形式のxml文字列')
    })
    
    const parser = StructuredOutputParser.fromZodSchema(svgSchema);
    
    const formatInstructions = parser.getFormatInstructions();
    
    const prompt_template = new PromptTemplate({
        template: `Create a simple SVG image of a {topic}. {formatInstructions}`,
        inputVariables: ["topic"],
        partialVariables: { formatInstructions },
    });
    const chain = prompt_template.pipe(model).pipe(parser);
    const result = await chain.invoke({ topic: "cats" });
    console.log(result);
}

main()