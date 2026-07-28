import { DeepgramProvider } from "./deepgram.speech.js";
import { ElevenLabsProvider } from "./elevenLabs.speech.js";

import type {TTSProvider } from "./tts.provider.js"
import type {TTSProviderName } from "@repo/types/speech/generateSpeechRequest"
import { googleProvider } from "./google.speech.js";


const providers: Record<TTSProviderName, TTSProvider> = {
    deepgram : new DeepgramProvider(),
    elevenlabs : new ElevenLabsProvider(),
    google_tts : new googleProvider()
};

// const providers: new Map([
//     ["deepgram" , new DeepgramProvider()],
//     ["elevenlabs" , new ElevenLabsProvider()]
// ]);

export function getTTSProvider(provider : TTSProviderName) : TTSProvider {
    const selectedProvider = providers[provider];
    if (!selectedProvider) {
        throw new Error(`Unsupported TTS provider: ${provider}`);
    }

    return selectedProvider;
}