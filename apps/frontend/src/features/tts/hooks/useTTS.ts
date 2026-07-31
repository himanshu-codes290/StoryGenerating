import { useState, useEffect, useRef } from "react";
import type { TTSRequest } from "@repo/types/speech/tts.types";
import { generateSpeech } from "@/features/tts/api/ttsApi";

export function useTTS() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store the active Object URL to revoke it safely
  const audioUrlRef = useRef<string | null>(null);

  async function generate(request: TTSRequest) {
    setLoading(true);
    setError(null);

    try {
      const blob = await generateSpeech(request);

      // Clean up previous URL if exists to avoid memory leaks
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }

      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      setAudioUrl(url);
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

  // Component unmount hone par memory cleanup
  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, []);

  return {
    audioUrl,
    loading,
    error,
    generate,
  };
}