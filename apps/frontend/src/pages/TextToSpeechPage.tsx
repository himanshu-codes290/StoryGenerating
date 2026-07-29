import { Container } from "../components/layout/Container";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/card"

import type { TTSRequest } from "@repo/types/speech/tts.types";
import { TTSGenerator } from "../features/tts/componenets/TTSGenerator"
import { TTSAudioPlayer } from "../features/tts/componenets/TTSAudioPlayer"
import { useState, useEffect, useRef } from "react";
import { generateSpeech } from "@/features/tts/api/ttsApi";


export function TextToSpeechPage()
{
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const audioUrlRef = useRef<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current);
            }
        };
    }, []);

    async function handleGenerate(request: TTSRequest) {
        setLoading(true);
        setError(null);

        try {
            const blob = await generateSpeech(request);

            // Remove previous object URL if one exists
            if (audioUrlRef.current) {
            URL.revokeObjectURL(audioUrlRef.current);
            }

            const url = URL.createObjectURL(blob);

            setAudioUrl(url);
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
        <>
            <Container>
                <Card className="p-4">
                    <PageHeader
                        title="Convert Text to Speech"
                        description="Give your words a voice."/>
        
                    <TTSGenerator
                    onGenerate={ handleGenerate}
                    loading= {loading}
                    />
                </Card>
                <Card className="p-4 mt-4">
                    <TTSAudioPlayer
                        audioUrl={audioUrl}
                        error={error}
                    />
                </Card>
            </Container>

        </>
    )
}