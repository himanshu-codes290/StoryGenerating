import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Wand2, Type } from "lucide-react";

interface StoryGeneratorProps {
  onGenerate: (story: string) => Promise<void>;
  loading: boolean;
}

export function StoryGenerator({ onGenerate, loading }: StoryGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const maxLength = 300;

  async function handleSubmit() {
    if (prompt.trim().length === 0) return;
    await onGenerate(prompt);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Type className="h-3.5 w-3.5 text-indigo-500" />
            Story Prompt / Character Idea
          </label>
          <span className="text-xs font-medium text-muted-foreground">
            {prompt.length} / {maxLength}
          </span>
        </div>

        <Textarea
          placeholder="Describe the story scene, genre, or plot idea in under 300 words... (e.g. A mystery detective unraveling an ancient clockwork puzzle in Victorian London)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          maxLength={maxLength}
          className="min-h-36 resize-y rounded-xl border-border/80 bg-background/50 p-4 text-sm leading-relaxed shadow-inner transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500/50"
        />
      </div>

      <div className="flex justify-end pt-1">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={loading || prompt.trim().length === 0}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-md px-6 py-2 transition-all flex items-center gap-2"
        >
          {loading ? (
            <>
              <Spinner className="h-4 w-4 animate-spin text-white" />
              Crafting Story...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              Generate Story
            </>
          )}
        </Button>
      </div>
    </div>
  );
}