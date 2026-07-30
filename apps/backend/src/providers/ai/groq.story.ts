import { Groq } from "groq-sdk/client.js";

import { env } from "../../config/env.js";
import { groqError } from "../../errors/generateStory.Error.js";

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

export async function groqStoryGenerator(prompt:string) : Promise<string>
{
    try {
        const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile", // or another Groq-supported model
        messages: [
            {
            role: "user",
            content: prompt,
            },
        ],
        temperature: 0.8,
        // max_tokens: 300,
        });
        
        const story = response.choices[0]?.message.content;
        if (!story) {
            throw new groqError("Story generation failed");
        }
        return story;
    }catch (err)
    {
        if (err instanceof Error)
            throw new groqError(err.message);
        throw new groqError("Unknown Groq error");
    }
}