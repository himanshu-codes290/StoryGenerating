import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { env } from "../../config/env.js";
import {Readable} from "node:stream"


import {TTS_PROVIDERS} from "../../../../../packages/shared/tts/tts.config.js"
import type { TTSProvider } from "./tts.provider.js";
import type { TTSProviderMetadata, TTSRequest, TTSResult } from "@repo/types/speech/tts.types";

export class ElevenLabsProvider implements TTSProvider {
  readonly metadata: TTSProviderMetadata = {maxCharacters : 2500}; 

    private readonly client = new ElevenLabsClient({
      apiKey: env.ELEVENLABS_API_KEY!,
    });
  async generate(request: TTSRequest): Promise<TTSResult> {
    if (!env.ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is missing");
    }
    // const elevenlabs = new ElevenLabsClient({
    //   apiKey: env.ELEVENLABS_API_KEY,
    // });
    const provider = TTS_PROVIDERS.find(
      (p) => p.id === "elevenlabs"
    );

    if (!provider) {
      throw new Error("ElevenLabs provider configuration not found.");
    }

    const voice = provider.voices.find(
      (v) => v.id === request.voice
    );

    if (!voice) {
      throw new Error(
        `Voice '${request.voice}' is not supported by ElevenLabs.`
      );
    }
    if(!voice.providerVoiceId)
    {
      throw new Error(
        `Voice '${request.voice}' is not supported by ElevenLabs.`
      );
    }

    const audioStream = await this.client.textToSpeech.stream( voice.providerVoiceId!, {
      modelId: "eleven_v3",
      text : request.text,
      outputFormat: "mp3_44100_128",
      // Optional voice settings that allow you to customize the output
      voiceSettings: {
        stability: 0,
        similarityBoost: 1.0,
        useSpeakerBoost: true,
        speed: 1.0,
      },
    });

    const nodeStream = Readable.from(audioStream)

    return {
      stream : nodeStream,
      contentType : "audio/mpeg"
    }
  }
}