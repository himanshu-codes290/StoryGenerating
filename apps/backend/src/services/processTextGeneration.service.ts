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
  tokenhandler?: tokenHandler
): Promise<TextGenerationJobResult> {
  const result = await validatePrompt(data.text);
  if (!result.valid) {
    const reason = result.reason ?? "Invalid prompt";
    await tokenhandler?.({
      type: "error",
      data: reason,
    });
    throw new ValidationError(reason);
  }
  const prompt = buildPrompt(data);

  const aiProvider: AIProvider = AiProviderRegistry.getProvider(
    data.provider?.toLowerCase() || env.FALBACK_TEXT_MODEL
  );

  let generatedText: string = "";
  try {
    const stream = aiProvider.generateTextStream({
      userPrompt: prompt,
      temperature: 0.8,
    });

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
  } catch (err) {
    const errorMsg =
      err instanceof Error ? err.message : "An unexpected error occurred.";
    await tokenhandler?.({
      type: "error",
      data: errorMsg,
    });
    throw err;
  }
  return {
    textResult: generatedText,
  };
}