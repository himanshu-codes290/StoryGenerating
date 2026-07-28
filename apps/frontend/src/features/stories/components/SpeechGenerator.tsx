import { playSpeech } from "../api/speechApi"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";

interface SpeechGeneratorProps {
    story : string;
    error : string | null;
}

export function SpeechGenerator({story,error} : SpeechGeneratorProps)   {
    const [speechLoading, setSpeechLoading] = useState(false);

    const handlePlay = async () => {
        if (!story) return;
        setSpeechLoading(true);

        try {
        await playSpeech(story);
        } catch (err) {
        console.error(err);
        } finally {
        setSpeechLoading(false);
        }
    };
    return (
        <>
        {
            speechLoading ?
            <Spinner/> : 
            <Button
            onClick={handlePlay}
            disabled={error !== null}
            >
                Play As Audio
            </Button>
        }
        </>
    )
}
