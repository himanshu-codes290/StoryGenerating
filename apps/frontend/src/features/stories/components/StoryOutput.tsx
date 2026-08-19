import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BookOpen, Copy, Check, AlertCircle, Sparkles, Mic, ArrowRight } from "lucide-react";

interface StoryOutputProps {
  story: string;
  error: string | null;
}

export function StoryOutput({ story, error }: StoryOutputProps) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!story) return;
    navigator.clipboard.writeText(story);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToTTS = () => {
    if (!story) return;
    navigate("/tts", { state: { text: story } });
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card/80 backdrop-blur-xl p-6 shadow-md transition-all space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground tracking-tight">
              Generated Story Output
            </h3>
            <p className="text-xs text-muted-foreground">
              AI generated narrative script
            </p>
          </div>
        </div>

        {story && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="text-xs border-border/60 hover:bg-accent flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                Copy Story
              </>
            )}
          </Button>
        )}
      </div>

      {/* Main Content Area */}
      {error ? (
        <Alert variant="destructive" className="rounded-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Generation Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : story ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-5 text-sm leading-relaxed whitespace-pre-wrap font-sans text-foreground">
            {story}
          </div>

          {/* Send to TTS Studio */}
          <div className="flex items-center justify-between rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Mic className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">Audio Narration</p>
                <p className="text-[11px] text-muted-foreground">
                  Convert this story into voice audio in the TTS Studio
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleSendToTTS}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-4 py-2 rounded-lg shadow-sm flex items-center gap-2"
            >
              Send to TTS Studio
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl border border-dashed border-border/80 bg-muted/10 space-y-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <p className="text-base font-semibold text-foreground">Your Story Will Appear Here</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Describe a scene, character, or plot concept above and click <strong className="text-foreground">"Generate Story"</strong> to create a narrative.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}