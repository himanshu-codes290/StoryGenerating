import "dotenv/config"

export const env = {
    PORT : Number(process.env.PORT ?? 3000),
    HOST : process.env.HOST ?? "0.0.0.0",
    GROQ_API_KEY : process.env.GROQ_API_KEY,
    ELEVENLABS_API_KEY : process.env.ELEVENLABS_API_KEY,
    DEEPGRAM_API_KEY : process.env.DEEPGRAM_API_KEY,
};