import Groq from "groq-sdk";
import {env} from "../config/env.js";


export interface storyGenerateObj {
    prompt:string
}

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

export async function generateStory(obj : storyGenerateObj)
{
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // or another Groq-supported model
      messages: [
        {
          role: "user",
          content: obj.prompt,
        },
      ],
      temperature: 0.8,
      // max_tokens: 300,
    });
    return response;
}