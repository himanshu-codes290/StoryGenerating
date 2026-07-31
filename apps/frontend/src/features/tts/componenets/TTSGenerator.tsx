import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
// import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import type { TTSRequest, TTSProviderName } from "@repo/types/speech/tts.types"

import { useState } from "react";

type TTSGeneratorProps = {
    text: string;
    onTextChange : (value: string) => void;
  onGenerate: (request: TTSRequest) => Promise<void>;
  loading: boolean;
};


export function TTSGenerator(props : TTSGeneratorProps)
{
    const [provider, setProvider] = useState<TTSProviderName>("deepgram");

    async function handleSubmit() {
        const text = props.text;
        await props.onGenerate({
            text,
            provider,
        });
    }

    return (
        <div className="space-y-6">
        <Textarea 
        value = {props.text}
        onChange={(e)=>props.onTextChange(e.target.value)}
        placeholder="Enter the text you want to convert into speech. For example: Welcome to our podcast! Today we're exploring artificial intelligence..."
        className="min-h-40 resize-none"
        />
        <div className="flex justify-end">
        <p className="text-sm text-muted-foreground">
            {props.text.length} characters
        </p>
        </div>
        {/* <DropdownMenu /> */}
        <select
            className="flex justify-center"
            value={provider}
            onChange={(e) =>
                setProvider(e.target.value as TTSProviderName)
            }
            >
            <option value="deepgram">Deepgram</option>
            <option value="elevenlabs">ElevenLabs</option>
            <option value="google_tts">Google TTS</option>
        </select>
        <Button 
        disabled= {props.loading || props.text.trim().length===0 }
        onClick={handleSubmit}
        >
            {props.loading && (
            <Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {props.loading
            ? "Generating..."
            : "Generate Speech"}
        </Button>
        </div>
    )
}