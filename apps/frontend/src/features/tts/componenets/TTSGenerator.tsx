import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Volume2, Type } from "lucide-react";

type TTSGeneratorProps = {
  text: string;
  onTextChange: (value: string) => void;
  onGenerate: () => Promise<void>;
  loading: boolean;
  onOpenAssistant?: () => void;
};

export function TTSGenerator({
  text,
  onTextChange,
  onGenerate,
  loading,
  onOpenAssistant,
}: TTSGeneratorProps) {
  async function handleSubmit() {
    await onGenerate();
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Type className="h-3.5 w-3.5 text-indigo-500" />
            Input Script / Speech Text
          </label>
          <span className="text-xs font-medium text-muted-foreground">
            {text.length} characters
          </span>
        </div>

        {/* Text Input Area */}
        <Textarea
          value={text}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Enter the text you want to convert into speech. For example: Welcome to our podcast! Today we're exploring artificial intelligence and voice synthesis..."
          className="min-h-44 resize-y rounded-xl border-border/80 bg-background/50 p-4 text-sm leading-relaxed shadow-inner transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500/50"
        />
      </div>

      {/* Helper & Assistant Row directly below text box */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {onOpenAssistant && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenAssistant}
            className="group border-indigo-500/30 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/15 hover:text-indigo-700 dark:hover:text-indigo-300 text-xs font-medium transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 mr-1.5 text-indigo-500 group-hover:scale-110 transition-transform" />
            Need help writing script?
            <span className="ml-1.5 text-[10px] bg-indigo-500/10 px-1.5 py-0.5 rounded font-semibold border border-indigo-500/20">
              AI Drawer
            </span>
          </Button>
        )}

        <Button
          type="button"
          disabled={loading || text.trim().length === 0}
          onClick={handleSubmit}
          className="sm:ml-auto bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-md font-semibold px-6 py-2 transition-all"
        >
          {loading ? (
            <>
              <Spinner className="mr-2 h-4 w-4 animate-spin text-white" />
              Generating Voice...
            </>
          ) : (
            <>
              <Volume2 className="mr-2 h-4 w-4" />
              Generate Speech
            </>
          )}
        </Button>
      </div>
    </div>
  );
}