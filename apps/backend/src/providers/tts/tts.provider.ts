import type { TTSRequest, TTSResult, TTSProviderMetadata } from "@repo/types"
import { getTTSProvider } from "./registry.js";
/**
 * Every Text-to-Speech provider must implement this contract.
 */
export interface TTSProvider {
  readonly metadata : TTSProviderMetadata;
  generate(request: TTSRequest): Promise<TTSResult>;
}
