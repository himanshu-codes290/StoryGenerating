import { Groq } from "groq-sdk";

import { env } from "../../config/env.js";
import { groqError } from "../../errors/generateStory.Error.js";

const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});
