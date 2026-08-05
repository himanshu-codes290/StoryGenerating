import type { TTSProviderName } from "@repo/types/speech/tts.types";

export interface TTSVoice {
  id: string;
  name: string;
  gender?: "male" | "female" | "neutral";
  previewUrl?: string; 
}

export interface TTSLanguage {
  code: string; // e.g., 'en-US', 'es-ES'
  name: string; // e.g., 'English (US)', 'Spanish'
  voices: TTSVoice[];
}
export interface TTSProvider {
  id: TTSProviderName;
  displayName: string;
  languages: TTSLanguage[];
}

export interface TTSGenerateRequest {
  provider: TTSProviderName;
  languageCode: string;
  voiceId: string;
  text: string;
  model?: string;
}