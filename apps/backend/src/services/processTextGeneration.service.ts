import type { TextGenerationJobData, TextGenerationJobResult } from "../types/generateTextJob.types.js";
import { buildPrompt } from "../utils/textpromptBuilder.js";
import type { AIProvider } from "../providers/ai/ai.provider.js";
import { AiProviderRegistry } from "../providers/ai/llm.registry.js";
import { env } from "../config/env.js";
import { validatePrompt } from "./validateStory.service.js";
import { ValidationError } from "../errors/appError.js";
import type { StreamEvent } from "../infrastructure/redis/streamChannels.js";


export type tokenHandler = (token : StreamEvent) => Promise<void> | void;

export async function processTextGenerationJob(
  data: TextGenerationJobData,
  tokenhandler? : tokenHandler
) : Promise<TextGenerationJobResult> {
    
    const result = await validatePrompt(data.text);
    if (!result.valid) {
        throw new ValidationError(result.reason ?? "Invalid prompt");
    }
    const prompt = buildPrompt(data);

    const aiProvider : AIProvider = AiProviderRegistry.getProvider(data.provider?.toLowerCase() || env.FALBACK_TEXT_MODEL);

    // const generatedText =
    //     await aiProvider.generate({

    //         userPrompt: prompt,

    //         temperature: 0.8,
    //     });
    let generatedText : string = "";
    let stream = aiProvider.generateTextStream({
        userPrompt : prompt,
        temperature : 0.8
    })     
    try {
        for await (const token of stream) {

            generatedText += token;
            await tokenhandler?.({
                type: "token",
                data: token.toString(),
            });
        }
        await tokenhandler?.({
            type: "complete",
        });
    } catch(err) {
        if(err instanceof Error)
            await tokenhandler?.({
                type: "error",
                message: err.message,
            });
        else
            await tokenhandler?.({
                type: "error",
                message: "Not instance of error message.",
            });
    }   
    return {
        textResult : generatedText,
    };
}