import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useScriptAssistant } from "@/features/script-assistant/hooks/useScriptAssistant";
import { Bot, Sparkles, Wand2, Copy, Check, ArrowRight, Type, AlertCircle } from "lucide-react";

type ScriptAssistantDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUseScript: (script: string) => void;
};

export function ScriptAssistantDrawer({
  open,
  onOpenChange,
  onUseScript,
}: ScriptAssistantDrawerProps) {
  const {
    idea, setIdea,
    task, setTask,
    tone, setTone,
    generatedScript, setGeneratedScript,
    loading,
    error,
    copied,
    handleGenerate,
    handleCopy,
  } = useScriptAssistant(open);

  function handleUseScript() {
    onUseScript(generatedScript);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-6 space-y-6">
        {/* Drawer Header */}
        <SheetHeader className="space-y-2 border-b border-border/40 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-md shadow-cyan-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <SheetTitle className="text-xl font-extrabold tracking-tight">
              AI Script Assistant
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs text-muted-foreground">
            Describe your idea and let AI generate, rewrite, or summarize your script.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Idea Input */}
          <div className="space-y-2">
            <Label htmlFor="idea" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Type className="h-3.5 w-3.5 text-cyan-500" />
              Describe your idea or paste text
            </Label>

            <Textarea
              id="idea"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder={
                task === "summarize"
                  ? "Paste the text you want to summarize..."
                  : task === "rewrite"
                  ? "Paste the text you want to rewrite..."
                  : task === "translate"
                  ? "Enter the text to translate..."
                  : "Describe what you want AI to write..."
              }
              className="min-h-32 resize-y rounded-xl border-border/80 bg-background/50 p-3.5 text-sm shadow-inner transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500/50"
            />
          </div>

          {/* Select Task & Tone */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="task" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Task Mode
              </Label>
              <Select value={task} onValueChange={setTask}>
                <SelectTrigger id="task" className="h-10 bg-background/80 border-border/80 rounded-lg">
                  <SelectValue placeholder="Select a task" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="write">✍️ Write</SelectItem>
                  <SelectItem value="summarize">📝 Summarize</SelectItem>
                  <SelectItem value="rewrite">🔄 Rewrite</SelectItem>
                  <SelectItem value="improve">✨ Improve Writing</SelectItem>
                  <SelectItem value="translate">🌐 Translate</SelectItem>
                  <SelectItem value="paraphrase">♻️ Paraphrase</SelectItem>
                  <SelectItem value="expand">📖 Expand</SelectItem>
                  <SelectItem value="shorten">📄 Shorten</SelectItem>
                  <SelectItem value="explain">💡 Explain</SelectItem>
                  <SelectItem value="brainstorm">🧠 Brainstorm</SelectItem>
                  <SelectItem value="generate">⚡ Generate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tone Style
              </Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger id="tone" className="h-10 bg-background/80 border-border/80 rounded-lg">
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">💼 Professional</SelectItem>
                  <SelectItem value="casual">😊 Casual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-semibold shadow-md py-2.5 rounded-xl transition-all"
            disabled={loading || idea.trim().length === 0}
            onClick={handleGenerate}
          >
            {loading ? (
              <>
                <Spinner className="mr-2 h-4 w-4 animate-spin text-white" />
                Generating Script...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Generate Script
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Generation Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Separator className="bg-border/60" />

          {/* Generated Output Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                Generated Script Output
              </Label>

              {generatedScript && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-7 text-xs text-muted-foreground hover:text-foreground"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 mr-1 text-emerald-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              )}
            </div>

            {generatedScript ? (
              <div className="space-y-3">
                <Textarea
                  value={generatedScript}
                  onChange={(e) => setGeneratedScript(e.target.value)}
                  className="min-h-52 font-sans leading-relaxed text-sm rounded-xl border-border/80 bg-background/50 p-4 shadow-inner"
                />

                <Button
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl shadow-sm flex items-center justify-center gap-2"
                  disabled={!generatedScript.trim()}
                  onClick={handleUseScript}
                >
                  <span>Use Script in Studio</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-48 rounded-xl border border-dashed border-border/80 bg-muted/10 p-6 text-center space-y-2">
                <Bot className="h-8 w-8 text-muted-foreground/60" />
                <p className="text-xs text-muted-foreground">
                  Your AI generated script will stream here.
                </p>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}