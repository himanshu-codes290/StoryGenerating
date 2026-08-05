import type { TTSProviderName } from "@repo/types/speech/tts.types";


export interface TTSLanguage {
    id: string;
    name: string;
}


export interface TTSVoice {
    id: string;
    name: string;
    languageId: string;
    providerModelId? : string;
    providerVoiceId? : string;
    gender?: "male" | "female" | "neutral";
    description?: string;
}


export interface TTSProviderConfig {
    id: TTSProviderName;

    label: string;

    voices: TTSVoice[];
}