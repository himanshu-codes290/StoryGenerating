import { useState } from "react";
import { playSpeech } from "../api/speechApi";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Volume2 } from "lucide-react";

interface SpeechGeneratorProps {
  story: string;
  error: string | null;
}

export function SpeechGenerator({ story, error }: SpeechGeneratorProps) {
  const [speechLoading, setSpeechLoading] = useState(false);

  const handlePlay = async () => {
    if (!story) return;
    setSpeechLoading(true);

    try {
      await playSpeech(story);
    } catch (err) {
      console.error(err);
    } finally {
      setSpeechLoading(false);
    }
  };

  if (!story) return null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <Volume2 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-foreground">Audio Narration</p>
          <p className="text-[11px] text-muted-foreground">Synthesize generated story into voice audio</p>
        </div>
      </div>

      <Button
        type="button"
        onClick={handlePlay}
        disabled={error !== null || speechLoading || !story}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-4 py-2 rounded-lg shadow-sm flex items-center gap-2"
      >
        {speechLoading ? (
          <>
            <Spinner className="h-3.5 w-3.5 animate-spin text-white" />
            Playing Audio...
          </>
        ) : (
          <>
            <Volume2 className="h-3.5 w-3.5" />
            Play As Audio
          </>
        )}
      </Button>
    </div>
  );
}
