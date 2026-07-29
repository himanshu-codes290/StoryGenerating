import { Button } from "@/components/ui/button";
// import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import type { TTSRequest, TTSProviderName } from "@repo/types/speech/tts.types"

import { useState } from "react";

type TTSGeneratorProps = {
  onGenerate: (request: TTSRequest) => Promise<void>;
  loading: boolean;
};


export function TTSGenerator(props : TTSGeneratorProps)
{
    const [text, setText] = useState("");
    const [provider, setProvider] = useState<TTSProviderName>("deepgram");

    async function handleSubmit() {
        await props.onGenerate({
            text,
            provider,
        });
    }

    return (
        <>
        <Textarea 
        value = {text}
        onChange={(e)=>setText(e.target.value)}
        />
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
        disabled= {props.loading}
        onClick={handleSubmit}
        >
            Generate
            </Button>
        </>
    )
}