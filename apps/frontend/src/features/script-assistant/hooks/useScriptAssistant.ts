import { useState, useRef, useEffect } from "react";
import { generateText } from "@/features/tts/api/generateTextApi";

export function useScriptAssistant(activeWhen?: boolean) {
  const [idea, setIdea] = useState("");
  const [task, setTask] = useState("write");
  const [tone, setTone] = useState("professional");
  const [generatedScript, setGeneratedScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const stopStreamingRef = useRef<(() => void) | null>(null);

  // Stop any in-flight stream when the caller signals "inactive" (e.g. drawer closes)
  useEffect(() => {
    if (activeWhen === false) {
      stopStreamingRef.current?.();
    }
  }, [activeWhen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStreamingRef.current?.();
    };
  }, []);

  async function handleGenerate() {
    if (idea.trim().length === 0) return;
    setLoading(true);
    setGeneratedScript("");
    setError(null);

    try {
      const stopStreaming = await generateText(
        { text: idea, task, tone },
        {
          onToken(token) {
            setGeneratedScript((prev) => prev + token);
          },
          onComplete() {
            setLoading(false);
          },
          onError(message) {
            setLoading(false);
            setError(message);
          },
        }
      );

      stopStreamingRef.current = stopStreaming;
    } catch {
      setError("Failed to generate script.");
      setLoading(false);
    }
  }

  function handleCopy() {
    if (!generatedScript) return;
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const wordCount = generatedScript.trim()
    ? generatedScript.trim().split(/\s+/).length
    : 0;

  return {
    idea,
    setIdea,
    task,
    setTask,
    tone,
    setTone,
    generatedScript,
    setGeneratedScript,
    loading,
    error,
    copied,
    wordCount,
    handleGenerate,
    handleCopy,
  };
}
