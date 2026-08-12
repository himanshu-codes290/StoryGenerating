import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { generateText } from "../features/tts/api/generateTextApi";
import { 
  Bot, 
  Sparkles, 
  Wand2, 
  Copy, 
  Check, 
  Mic, 
  BookOpen, 
  Type, 
  AlertCircle,
  SlidersHorizontal,
  FileText
} from "lucide-react";

export function ScriptAssistantPage() {
  const navigate = useNavigate();
  const [idea, setIdea] = useState("");
  const [task, setTask] = useState("write");
  const [tone, setTone] = useState("professional");
  const [generatedScript, setGeneratedScript] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const stopStreamingRef = useRef<(() => void) | null>(null);

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
        {
          text: idea,
          task: task,
          tone: tone,
        },
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

  const handleCopy = () => {
    if (!generatedScript) return;
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendToTTS = () => {
    if (!generatedScript) return;
    navigate("/tts", { state: { text: generatedScript } });
  };

  const handleSendToStory = () => {
    if (!generatedScript) return;
    navigate("/story", { state: { prompt: generatedScript } });
  };

  const wordCount = generatedScript.trim() ? generatedScript.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Studio Header Card */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-r from-cyan-500/10 via-indigo-500/5 to-background p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              <Bot className="h-3.5 w-3.5" />
              AI Script Writing Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              AI Script Assistant
            </h1>
            <p className="text-sm text-muted-foreground">
              Draft, summarize, translate, or enhance scripts with streaming AI assistance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground bg-card px-3 py-1.5 rounded-lg border border-border/60 shadow-xs flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
              Streaming AI Active
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Setup & Generated Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Script Setup & Generation Controls */}
        <Card className="lg:col-span-5 border-border/60 shadow-md flex flex-col justify-between">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-border/40 pb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <SlidersHorizontal className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Script Configuration</h3>
                <p className="text-[11px] text-muted-foreground">Set your idea, task mode, and tone</p>
              </div>
            </div>

            {/* Idea Textarea */}
            <div className="space-y-2">
              <Label htmlFor="idea" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Type className="h-3.5 w-3.5 text-cyan-500" />
                Describe Your Idea or Paste Content
              </Label>
              <Textarea
                id="idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder={
                  task === "summarize"
                    ? "Paste the text you want to summarize..."
                    : task === "rewrite"
                    ? "Paste the text you want to rewrite or improve..."
                    : task === "translate"
                    ? "Enter the text you want to translate..."
                    : "Describe what you want AI to write (e.g. A 60-second podcast intro on renewable energy)..."
                }
                className="min-h-36 resize-y rounded-xl border-border/80 bg-background/50 p-3.5 text-sm shadow-inner transition-colors focus-visible:ring-2 focus-visible:ring-cyan-500/50"
              />
            </div>

            {/* Task & Tone Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="task" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Task Mode
                </Label>
                <Select value={task} onValueChange={setTask}>
                  <SelectTrigger id="task" className="h-10 bg-background/80 border-border/80 rounded-lg">
                    <SelectValue placeholder="Select task" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="write">✍️ Write</SelectItem>
                    <SelectItem value="summarize">📝 Summarize</SelectItem>
                    <SelectItem value="rewrite">🔄 Rewrite</SelectItem>
                    <SelectItem value="improve">✨ Improve</SelectItem>
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

            {/* Generate CTA Button */}
            <Button
              type="button"
              className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-semibold shadow-md py-2.5 rounded-xl transition-all"
              disabled={loading || idea.trim().length === 0}
              onClick={handleGenerate}
            >
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4 animate-spin text-white" />
                  Generating Script Stream...
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
          </CardContent>
        </Card>

        {/* Right Column: Generated Script Output & Studio Export Actions */}
        <Card className="lg:col-span-7 border-border/70 bg-card/80 backdrop-blur-xl shadow-md flex flex-col justify-between">
          <CardContent className="p-6 space-y-5 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Output Header */}
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white shadow-sm shadow-cyan-500/20">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Generated Script</h3>
                    <p className="text-[11px] text-muted-foreground">
                      {wordCount} words &bull; {generatedScript.length} characters
                    </p>
                  </div>
                </div>

                {generatedScript && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="text-xs border-border/60 hover:bg-accent flex items-center gap-1.5 h-8"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                        Copy
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Text Output Box */}
              {generatedScript ? (
                <Textarea
                  value={generatedScript}
                  onChange={(e) => setGeneratedScript(e.target.value)}
                  placeholder="Generated script will appear here..."
                  className="min-h-72 font-sans leading-relaxed text-sm rounded-xl border-border/80 bg-background/50 p-4 shadow-inner"
                />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-72 rounded-xl border border-dashed border-border/80 bg-muted/10 p-6 text-center space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <p className="text-sm font-semibold text-foreground">Script Canvas Ready</p>
                    <p className="text-xs text-muted-foreground">
                      Configure your prompt on the left and click <strong className="text-foreground">"Generate Script"</strong> to stream AI text.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions: Send to TTS / Story */}
            {generatedScript && (
              <div className="border-t border-border/40 pt-4 space-y-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Send Script to Studio
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    type="button"
                    onClick={handleSendToTTS}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs py-2 rounded-xl shadow-sm flex items-center justify-center gap-2"
                  >
                    <Mic className="h-3.5 w-3.5" />
                    Send to Text-to-Speech
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSendToStory}
                    className="border-border/80 hover:bg-accent font-medium text-xs py-2 rounded-xl flex items-center justify-center gap-2"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-purple-500" />
                    Send to Story Studio
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
