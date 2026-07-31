import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription} from "@/components/ui/sheet";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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
                    task: "tts_script",
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
                        placeholder="Example: Write a motivational speech for software engineers beginning their careers."
                        className="min-h-32 resize-none"
                        />

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