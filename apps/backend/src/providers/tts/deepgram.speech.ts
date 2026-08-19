import type { TTSProvider } from "./tts.provider.js";
import type { TTSProviderMetadata, TTSRequest, TTSResult, TTSBufferResult } from "@repo/types"
import { env } from "../../config/env.js"

import { DeepgramClient } from "@deepgram/sdk";
import {TTS_PROVIDERS} from "@repo/shared"
import {Readable} from "node:stream";

export class DeepgramProvider implements TTSProvider {
  readonly metadata: TTSProviderMetadata = {maxCharacters : 2000 };

  private getModelId(request: TTSRequest): string {
    const voice = TTS_PROVIDERS
      .find(p => p.id === "deepgram")
      ?.voices.find(v => v.id === request.voice);
    return voice?.providerModelId ?? "aura-2-thalia-en";
  }

  /** Returns the full audio as a Buffer — single Redis SET-friendly. */
  async generate(request: TTSRequest): Promise<TTSBufferResult> {
    const deepgram = new DeepgramClient({ apiKey: env.DEEPGRAM_API_KEY });
    const response = await deepgram.speak.v1.audio.generate({
      text: request.text,
      model: this.getModelId(request),
    });

    const arrayBuffer = await response.arrayBuffer();

    return {
      audio: Buffer.from(arrayBuffer),
      contentType: "audio/mpeg",
    };
  }

  /** Returns a Readable stream — for future streaming/paid clients. */
  async generateStream(request: TTSRequest): Promise<TTSResult> {
    const deepgram = new DeepgramClient({ apiKey: env.DEEPGRAM_API_KEY });
    const response = await deepgram.speak.v1.audio.generate({
      text: request.text,
      model: this.getModelId(request),
    });

    const webstream = await response.stream();

    if (!webstream) {
      throw new Error("Deepgram returned an empty audio stream.");
    }

    const stream = Readable.fromWeb(webstream as any);
    return {
      stream,
      contentType: "audio/mpeg",
    };
  }
}