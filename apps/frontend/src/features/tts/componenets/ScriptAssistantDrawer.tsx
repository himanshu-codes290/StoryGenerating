import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription} from "@/components/ui/sheet";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Select,  SelectContent,  SelectItem,  SelectTrigger,  SelectValue, } from "@/components/ui/select";

import { generateText } from "../api/generateTextApi";
import { useRef, useEffect } from "react";

type ScriptAssistantDrawerProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUseScript : (script : string) => void;
};


export function ScriptAssistantDrawer({open , onOpenChange, onUseScript} : ScriptAssistantDrawerProps)
{
    const [idea, setIdea] = useState("");
    const [task, setTask] = useState("write");
    const [tone, setTone] = useState("professional");
    const [generatedScript, setGeneratedScript] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const stopStreamingRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        if (!open) {
            stopStreamingRef.current?.();
    }}, [open]);

    async function handleGenerate() {
        setLoading(true);
        setGeneratedScript("");
        setError(null);

        try {
            // Temporary
            setGeneratedScript("");
            const stopStreaming = await generateText(
                {
                    text: idea,
                    task: task,
                    tone : tone
                },
                {
                    onToken(token) {
                        setGeneratedScript(prev => prev + token);
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
        } catch (err) {
            setError("Failed to generate script.");
        } finally {
            setLoading(false);
        }
    }

    function handleUseScript() {
        onUseScript(generatedScript);
        onOpenChange(false);
    }

    return (
        <div className="p-4">
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="w-full sm:max-w-xl overflow-y-auto">

                    <SheetHeader>

                        <SheetTitle>
                            AI Script Assistant
                        </SheetTitle>

                        <SheetDescription>
                            Describe your idea and let AI create a script.    
                        </SheetDescription>

                    </SheetHeader>
                <div className="mt-8 space-y-6">

                    <div className="space-y-2">

                        <Label htmlFor="idea">
                        Describe your idea
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
                        className="min-h-32 resize-none"
                        />
                        <div
                        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="task">Task</Label>

                                <Select value={task} onValueChange={setTask}>
                                    <SelectTrigger id="task">
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
                                    <SelectItem value="brainstorm">🧠 Brainstorm Ideas</SelectItem>
                                    <SelectItem value="generate">⚡ Generate Content</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tone">Tone</Label>

                                <Select value={tone} onValueChange={setTone}>
                                    <SelectTrigger id="tone">
                                    <SelectValue placeholder="Select a tone" />
                                    </SelectTrigger>

                                    <SelectContent>
                                    <SelectItem value="professional">
                                        💼 Professional
                                    </SelectItem>

                                    <SelectItem value="casual">
                                        😊 Casual
                                    </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <Button
                        className="w-full"
                        disabled={loading || idea.trim().length === 0}
                        onClick={handleGenerate}
                    >
                        Generate Script
                    </Button>

                    {error && (
                        <Alert variant="destructive">
                            <AlertTitle>
                                Generation Failed
                            </AlertTitle>

                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}

                    <Separator />

                    {/* Generated section */}

                    <div className="space-y-2">

    <Label>
        Generated Script
    </Label>

  {generatedScript ? (
    <div>
        <Textarea
            value={generatedScript}
            onChange={(e) =>
                setGeneratedScript(e.target.value)
            }
            className="min-h-64"
        />

        <Button
        className="w-full"
        disabled={!generatedScript.trim()}
        onClick={handleUseScript}
        >
            Use Script
        </Button>
        </div>
        ) : (
            <div
                className="
                    flex
                    min-h-64
                    items-center
                    justify-center
                    rounded-md
                    border
                    border-dashed
                "
            >
                <p className="text-center text-sm text-muted-foreground">
                    Your generated script will appear here.
                </p>
            </div>
        )}

        </div>

                </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}