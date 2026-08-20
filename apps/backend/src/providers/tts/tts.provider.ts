import type { TTSRequest, TTSResult, TTSBufferResult, TTSProviderMetadata } from "@repo/types"
/**
 * Every Text-to-Speech provider must implement this contract.
 */
export interface TTSProvider {
  readonly metadata : TTSProviderMetadata;
  /** Returns the full audio as a Buffer — use this for Redis caching (single SET). */
  generate(request: TTSRequest): Promise<TTSBufferResult>;
  /** Returns a Readable stream — for future streaming/paid clients. */
  generateStream(request: TTSRequest): Promise<TTSResult>;
}
