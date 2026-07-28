import {protos, TextToSpeechClient } from "@google-cloud/text-to-speech";
import type { TTSProvider } from "./tts.provider.js";
import type { TTSProviderMetadata, TTSRequest, TTSResult } from "@repo/types/speech/generateSpeechRequest";
import { env } from "../../config/env.js";
import { AppError } from "../../errors/appError.js";
import { Readable } from "node:stream";

export class googleProvider implements TTSProvider
{
    readonly metadata: TTSProviderMetadata = {maxCharacters : 2000};

    private readonly client : TextToSpeechClient;
    constructor() {
    if (!env.GOOGLE_TTS_API_KEY) {
        throw new Error("GOOGLE_TTS_API_KEY missing");
    }

    this.client = new TextToSpeechClient({
        apiKey: env.GOOGLE_TTS_API_KEY,
    });
    }
    async generate(request: TTSRequest): Promise<TTSResult> {
        
        if(!env.GOOGLE_TTS_API_KEY){
            throw new AppError("Invalid Api Key",500,"INVALID_API_KEY")
        }

        // const client = new TextToSpeechClient({apiKey : env.GOOGLE_TTS_API_KEY});

        const send : protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
            input: {
            text: request.text
            },
            voice: {
            languageCode: "en-US",
            name: "en-US-Neural2-F"
            },
            audioConfig: {
            audioEncoding: "MP3" as const
            }
        };

    const [response] = await this.client.synthesizeSpeech(send);

    if (!response.audioContent) {
      throw new AppError(
        "Google TTS returned no audio",
        500,
        "TTS_FAILED"
      );
    }

    const stream = Readable.from(Buffer.from(response.audioContent));

    return {
      stream,
      contentType: "audio/mpeg",
    };
    }
}