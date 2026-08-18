import "dotenv/config"

export const env = {
    PORT : Number(process.env.PORT ?? 3000),
    HOST : process.env.HOST ?? "0.0.0.0",
    GROQ_API_KEY : process.env.GROQ_API_KEY,
    ELEVENLABS_API_KEY : process.env.ELEVENLABS_API_KEY,
    DEEPGRAM_API_KEY : process.env.DEEPGRAM_API_KEY,
    GOOGLE_TTS_API_KEY : process.env.GOOGLE_TTS_API_KEY,
    FALBACK_TEXT_MODEL : "groq",
    // Redis — set REDIS_URL for Upstash cloud (rediss://...), or use host/port for local
    REDIS_URL : process.env.REDIS_URL,
    REDIS_HOST : process.env.REDIS_HOST ?? "127.0.0.1",
    REDIS_PORT : Number(process.env.REDIS_PORT ?? 6379),
    // CORS — comma-separated list of allowed frontend origins
    FRONTEND_ORIGIN : process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
};