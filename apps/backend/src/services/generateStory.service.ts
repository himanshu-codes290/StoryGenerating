import { groqStoryGenerator } from "../providers/llm/groq.story.js";
import { validatePrompt } from "./validateStory.service.js";
import { ValidationError } from "../errors/generateStory.Error.js";

export interface storyGenerateObj {
    prompt:string
}


export async function generateStory({prompt,} : storyGenerateObj)
{
  const result = await validatePrompt(prompt);
  if (!result.valid) {
    throw new ValidationError(result.reason ?? "Invalid prompt");
  }

  return await groqStoryGenerator(prompt);
}