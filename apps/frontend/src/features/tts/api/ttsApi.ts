import type { TTSRequest } from "@repo/types/speech/tts.types";

export async function generateSpeech( request : TTSRequest) : Promise<Response>
{
    const response = await fetch("/api/v1/generate/speech",{
        method : "POST",
        headers : {
            "Content-Type": "application/json",
        },
        body : JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error("failed to get data through backend.")
    }
    return response;
}