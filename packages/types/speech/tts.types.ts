export interface generateSpeechRequest {
    text : string
}

export type TTSProviderName = "deepgram" | "elevenlabs" | "google_tts";

export type TTSRequest = {
  text: string;
  provider: TTSProviderName;
  language : string;
  voice?: string;
};

export type TTSResult<T = Record<string, unknown>> = {
  stream : any;
  contentType: string;
  metadata? : T;
};

export type TTSBufferResult<T = Record<string, unknown>> = {
  audio: Uint8Array;
  contentType: string;
  metadata?: T;
};


export interface TTSProviderMetadata {
    maxCharacters: number;
}