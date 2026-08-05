import type { TextGenerationJobData } from "../types/generateTextJob.types.js";

export function buildPrompt(data: TextGenerationJobData): string {
  return `
Task:
${data.task}

Tone:
${data.tone ?? "Default"}

Text:
${data.text}
`;
}