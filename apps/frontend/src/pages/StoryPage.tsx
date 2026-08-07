import { useState } from "react";
import { StoryGenerator } from "../features/stories/components/StoryGenerator";
import { StoryOutput } from "../features/stories/components/StoryOutput";
import { SpeechGenerator } from "@/features/stories/components/SpeechGenerator";
import { generateStory } from "../features/stories/api/storyApi";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Sparkles } from "lucide-react";

export function StoryPage() {
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(prompt: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await generateStory({ prompt });
      setStory(response.story);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Studio Header Card */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-background p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <BookOpen className="h-3.5 w-3.5" />
              Creative Narrative Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              AI Story Studio
            </h1>
            <p className="text-sm text-muted-foreground">
              Generate rich stories, plots, and creative writing from custom prompts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground bg-card px-3 py-1.5 rounded-lg border border-border/60 shadow-xs flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              Story Writer Ready
            </span>
          </div>
        </div>
      </div>

      {/* Main Generator Input Card */}
      <Card className="border-border/60 shadow-md">
        <CardContent className="p-6 sm:p-8">
          <StoryGenerator onGenerate={handleGenerate} loading={loading} />
        </CardContent>
      </Card>

      {/* Story Output Card with Audio Speech Player Extension */}
      <StoryOutput story={story} error={error}>
        <SpeechGenerator story={story} error={error} />
      </StoryOutput>
    </div>
  );
}