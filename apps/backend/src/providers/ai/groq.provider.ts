import type { AIProvider, GenerateTextOptions } from "./ai.provider.js";
import Groq from "groq-sdk";
import { env } from "../../config/env.js"
import { groqError } from "../../errors/groqError.js";
import { AppError } from "../../errors/appError.js";

export class GroqProvider implements AIProvider {
    private readonly client : Groq;

    constructor() {
        this.client = new Groq({
            apiKey : env.GROQ_API_KEY
        })
    }

    async generate(options: GenerateTextOptions): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: options.model ?? "openai/gpt-oss-120b",

        messages: [
            ...(options.systemPrompt?.trim()
                ? [
                    {
                    role: "system" as const,
                    content: options.systemPrompt,
                    },
                ]
                : []),
            {
                role: "user",
                content: options.userPrompt,
            },
        ],

        temperature: options.temperature ?? 0.8,

        ...(options.maxTokens ? { max_completion_tokens: options.maxTokens } : {})
      });

      const generatedText = response.choices[0]?.message?.content;

      if (!generatedText) {
        throw new Error("No content returned from Groq.");
      }

      return generatedText;
    } catch (error) {
      if (error instanceof Error) {
        throw new groqError(`Groq Provider Error: ${error.message}`);
      }

      throw new Error("Unknown Groq Provider Error");
    }
    }
    
  async* generateTextStream(
    options: GenerateTextOptions
  ): AsyncGenerator<string> {
    try {
    const stream = await this.client.chat.completions.create({
      model: options.model || "llama-3.3-70b-versatile",

      messages: [
        ...(options.systemPrompt?.trim()
                ? [
                    {
                    role: "system" as const,
                    content: options.systemPrompt,
                    },
                ]
                : []),
            {
                role: "user",
                content: options.userPrompt,
            },
      ],

      temperature: options.temperature || 0.8,

      stream: true,
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content;

      if (!token) {
        continue;
      }

      yield token;
    }
  } catch (err) {
    if (err instanceof AppError) {
      throw new groqError(err.message);
    }

    throw new groqError("Unknown Groq error");
  }
}

}