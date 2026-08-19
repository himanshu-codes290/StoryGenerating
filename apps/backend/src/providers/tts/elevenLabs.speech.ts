import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { env } from "../../config/env.js";
import { Readable } from "node:stream"

import {TTS_PROVIDERS} from "@repo/shared"
import type { TTSProvider } from "./tts.provider.js";
import type { TTSProviderMetadata, TTSRequest, TTSResult, TTSBufferResult } from "@repo/types";

export class ElevenLabsProvider implements TTSProvider {
  readonly metadata: TTSProviderMetadata = {maxCharacters : 2500}; 

  private readonly client = new ElevenLabsClient({
    apiKey: env.ELEVENLABS_API_KEY!,
  });

  private resolveVoiceId(request: TTSRequest): string {
    if (!env.ELEVENLABS_API_KEY) {
      throw new Error("ELEVENLABS_API_KEY is missing");
    }

    const provider = TTS_PROVIDERS.find((p) => p.id === "elevenlabs");
    if (!provider) {
      throw new Error("ElevenLabs provider configuration not found.");
    }

    const voice = provider.voices.find((v) => v.id === request.voice);
    if (!voice) {
      throw new Error(`Voice '${request.voice}' is not supported by ElevenLabs.`);
    }
    if (!voice.providerVoiceId) {
      throw new Error(`Voice '${request.voice}' has no providerVoiceId.`);
    }

    return voice.providerVoiceId;
  }

  private get voiceSettings() {
    return {
      stability: 0,
      similarityBoost: 1.0,
      useSpeakerBoost: true,
      speed: 1.0,
    };
  }

  /** Returns the full audio as a Buffer — single Redis SET-friendly. */
  async generate(request: TTSRequest): Promise<TTSBufferResult> {
    const providerVoiceId = this.resolveVoiceId(request);

    // convert() returns a ReadableStream<Uint8Array>; collect all chunks into one Buffer
    const audioStream = await this.client.textToSpeech.convert(providerVoiceId, {
      modelId: "eleven_v3",
      text: request.text,
      outputFormat: "mp3_44100_128",
      voiceSettings: this.voiceSettings,
    });

    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      chunks.push(Buffer.from(chunk));
    }

    return {
      audio: Buffer.concat(chunks),
      contentType: "audio/mpeg",
    };
  }

  /** Returns a Readable stream — for future streaming/paid clients. */
  async generateStream(request: TTSRequest): Promise<TTSResult> {
    const providerVoiceId = this.resolveVoiceId(request);

    const audioStream = await this.client.textToSpeech.stream(providerVoiceId, {
      modelId: "eleven_v3",
      text: request.text,
      outputFormat: "mp3_44100_128",
      voiceSettings: this.voiceSettings,
    });

    const nodeStream = Readable.from(audioStream);

    return {
      stream: nodeStream,
      contentType: "audio/mpeg",
    };
  }
}