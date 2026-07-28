import { moderateCheck } from "../providers/llm/groq.moderator.js";

export interface validationResult{
    valid : boolean,
    reason? : string
}
const MIN_PROMPT_WORDS = 5;
const MAX_PROMPT_LENGTH = 300;

export function validatePromptInput(prompt : string) : validationResult
{
    const trimmed = prompt.trim();

  if (!trimmed) 
    return {
        valid : false,
        reason : "Prompt cannot be empty."
    }

  if (trimmed.length > MAX_PROMPT_LENGTH)
    return {
        valid : false,
        reason : `Prompt cannot exceed ${MAX_PROMPT_LENGTH} characters.`
    }

  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;

  if (wordCount < MIN_PROMPT_WORDS)
    return {
        valid : false,
        reason : `Prompt must contain at least ${MIN_PROMPT_WORDS} words.`
    }

  return {
    valid : true
  };
}

export async function validatePrompt(prompt : string) : Promise<validationResult>
{
   const inputValidationResult = validatePromptInput(prompt);
   if (!inputValidationResult.valid)
        return inputValidationResult;
   const moderationResult = await moderateCheck(prompt)
   if (moderationResult!='safe')
        return {
            valid : false,
            reason : "moderation check failed."
    }
    return  {
        valid : true
    }
}