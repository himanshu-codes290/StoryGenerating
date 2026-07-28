import type { TTSRequest, TTSResult } from "@repo/types/speech/generateSpeechRequest"
import { getTTSProvider } from "../providers/tts/registry.js";

import { PassThrough } from "node:stream";
import { chunkText } from "../utils/textChunking.js";

// const MAX_DEEPGRAM_CHARS = 2000;

export async function generateSpeech(
  request: TTSRequest
): Promise<TTSResult> {

  const provider = getTTSProvider(request.provider);

  const chunks = chunkText(request.text, {maxLength : provider.metadata.maxCharacters});
  
  if (chunks.length === 1) {
    return provider.generate(request);
  }
  const output = new PassThrough();

  (async () => {
    try {
      for (const chunk of chunks) {
        const result = await provider.generate({
          ...request,
          text: chunk,
        });

        await new Promise<void>((resolve, reject) => {
          result.stream.pipe(output, { end: false });

          result.stream.once("end", resolve);
          result.stream.once("error", reject);
        });
      }

      output.end();
    } catch (error) {
      output.destroy(error as Error);
    }
  })();

  return {
  stream: output,
  contentType: "audio/mpeg",
  };

}