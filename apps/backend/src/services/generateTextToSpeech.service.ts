import type { TTSRequest, TTSResult, TTSBufferResult } from "@repo/types"
import { getTTSProvider } from "../providers/tts/registry.js";

import { PassThrough } from "node:stream";
import { chunkText } from "../utils/textChunking.js";

// ── Stream path (kept for future streaming/paid clients) ──────────────────────

export async function generateSpeech(
  request: TTSRequest
): Promise<TTSResult> {

  const provider = getTTSProvider(request.provider);

  const chunks = chunkText(request.text, {maxLength : provider.metadata.maxCharacters});
  
  if (chunks.length === 1) {
    return provider.generateStream(request);
  }
  const output = new PassThrough();

  (async () => {
    try {
      for (const chunk of chunks) {
        const result = await provider.generateStream({
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

// ── Buffer path (default for all current clients, Redis-friendly) ─────────────

/**
 * Generates speech for the full text, collecting all chunk audio into a single
 * Buffer. Callers can then store it in Redis with a single SET command.
 */
export async function generateSpeechBuffer(
  request: TTSRequest
): Promise<TTSBufferResult> {
  const provider = getTTSProvider(request.provider);
  const chunks = chunkText(request.text, { maxLength: provider.metadata.maxCharacters });

  const buffers: Buffer[] = [];

  for (const chunk of chunks) {
    const result = await provider.generate({ ...request, text: chunk });
    buffers.push(Buffer.from(result.audio));
  }


  return {
    audio: Buffer.concat(buffers),
    contentType: "audio/mpeg",
  };
}