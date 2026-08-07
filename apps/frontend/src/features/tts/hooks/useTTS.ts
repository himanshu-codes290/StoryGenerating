import { useState } from "react";
import type { TTSRequest } from "@repo/types/speech/tts.types";
import { generateSpeech } from "@/features/tts/api/ttsApi";
import { playStream } from "../utils/streamPlayer";

export function useTTS() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  async function generate(request: TTSRequest, audio: HTMLAudioElement) {
    setLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const response = await generateSpeech(request);
      const { blobUrl } = await playStream(response, audio);
      setAudioUrl(blobUrl);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong while generating audio.");
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    audioUrl,
    generate,
  };
}