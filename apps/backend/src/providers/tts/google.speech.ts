import {protos, TextToSpeechClient } from "@google-cloud/text-to-speech";
import type { TTSProvider } from "./tts.provider.js";
import type { TTSProviderMetadata, TTSRequest, TTSResult, TTSBufferResult } from "@repo/types";
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

    private async buildRequest(request: TTSRequest): Promise<protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest> {
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

        return {
            input: { text: request.text },
            voice: {
                languageCode: langCode || "en-US",
                name: voice.providerVoiceId || "en-US-Neural2-F"
            },
            audioConfig: {
                audioEncoding: "MP3" as const
            }
        };
    }

    /** Returns the full audio as a Buffer — single Redis SET-friendly. */
    async generate(request: TTSRequest): Promise<TTSBufferResult> {
        const send = await this.buildRequest(request);
        const [response] = await this.client.synthesizeSpeech(send);

        if (!response.audioContent) {
            throw new AppError("Google TTS returned no audio", 500, "TTS_FAILED");
        }

        return {
            audio: Buffer.from(response.audioContent),
            contentType: "audio/mpeg",
        };
    }

    /** Returns a Readable stream — for future streaming/paid clients. */
    async generateStream(request: TTSRequest): Promise<TTSResult> {
        const send = await this.buildRequest(request);
        const [response] = await this.client.synthesizeSpeech(send);

        if (!response.audioContent) {
            throw new AppError("Google TTS returned no audio", 500, "TTS_FAILED");
        }

        const stream = Readable.from(Buffer.from(response.audioContent));

        return {
            stream,
            contentType: "audio/mpeg",
        };
    }
}