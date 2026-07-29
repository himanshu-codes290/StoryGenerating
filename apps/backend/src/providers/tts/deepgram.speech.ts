import type { TTSProvider } from "./tts.provider.js";
import type { TTSProviderMetadata, TTSRequest, TTSResult } from "@repo/types/speech/tts.types"
import { env } from "../../config/env.js"

import { DeepgramClient } from "@deepgram/sdk";
import {Readable} from "node:stream";

export class DeepgramProvider implements TTSProvider {
  // readonly maxCharacter = 2000;
  readonly metadata: TTSProviderMetadata = {maxCharacters : 2000 };
  async generate(request: TTSRequest): Promise<TTSResult> {

    const deepgram =new DeepgramClient({apiKey : env.DEEPGRAM_API_KEY});
    const response = await deepgram.speak.v1.audio.generate({ 
      text: request.text,
      model: request.model ?? "aura-2-thalia-en",
    });

    const webstream = await response.stream();

    if (!webstream) {
      throw new Error("Deepgram returned an empty audio stream.");
    }
    
    const stream = Readable.fromWeb(webstream as any);
    return {
      stream,
      contentType : "audio/mpeg"
    }
  }
}