import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { env } from "../../config/env.js";
import {Readable} from "node:stream"



import type { TTSProvider } from "./tts.provider.js";
import type { TTSProviderMetadata, TTSRequest, TTSResult } from "@repo/types/speech/generateSpeechRequest";

export class ElevenLabsProvider implements TTSProvider {
  readonly metadata: TTSProviderMetadata = {maxCharacters : 2500}; 
  async generate(request: TTSRequest): Promise<TTSResult> {
    if (!env.ELEVENLABS_API_KEY) {
    throw new Error("ELEVENLABS_API_KEY is missing");
    }
    const elevenlabs = new ElevenLabsClient({
      apiKey: env.ELEVENLABS_API_KEY,
    });


    const audioStream = await elevenlabs.textToSpeech.stream("JBFqnCBsd6RMkjVDRZzb", {
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