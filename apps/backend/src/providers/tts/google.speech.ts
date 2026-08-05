import {protos, TextToSpeechClient } from "@google-cloud/text-to-speech";
import type { TTSProvider } from "./tts.provider.js";
import type { TTSProviderMetadata, TTSRequest, TTSResult } from "@repo/types";
import { env } from "../../config/env.js";
import { AppError } from "../../errors/appError.js";
import { Readable } from "node:stream";
import {TTS_PROVIDERS} from "@repo/shared"

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

          const provider = TTS_PROVIDERS.find(
            (p) => p.id === "google_tts"
        );

        if (!provider) {
            throw new AppError(
                "Google provider configuration not found.",
                500,
                "GOOGLE_PROVIDER_NOT_FOUND"
            );
        }

        const voice = provider.voices.find(
            (v) => v.id === request.voice
        );

        if (!voice) {
            throw new AppError(
                "Invalid Google voice.",
                400,
                "INVALID_VOICE"
            );
        }
        const langCode = voice.providerVoiceId!
            .split("-")
            .slice(0, 2)
            .join("-");

        const send : protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
            input: {
            text: request.text
            },
            voice: {
            languageCode: langCode || "en-US",
            name: voice.providerVoiceId || "en-US-Neural2-F"
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