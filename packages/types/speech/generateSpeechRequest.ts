import type { Readable } from "node:stream"

export interface generateSpeechRequest {
    text : string
}

export type TTSProviderName = "deepgram" | "elevenlabs";

export type TTSRequest = {
  text: string;
  provider: TTSProviderName;
  voice?: string;
  model? : string;
};

export type TTSResult<T = Record<string, unknown>> = {
  stream :  Readable;
  contentType: string;
  metadata? : T;
};

export interface TTSProviderMetadata {
    maxCharacters: number;
}