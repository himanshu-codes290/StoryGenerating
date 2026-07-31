import { Container } from "../components/layout/Container";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/card"

import { TTSGenerator } from "../features/tts/componenets/TTSGenerator"
import { TTSAudioPlayer } from "../features/tts/componenets/TTSAudioPlayer"
import { useTTS } from "@/features/tts/hooks/useTTS";
import { useState } from "react";


export function TextToSpeechPage()
{
    const { audioUrl, loading, error, generate} = useTTS();
    const [text, setText] = useState("");
    return (
        <>
            <Container>
                <Card className="p-4">
                    <PageHeader
                        title="Convert Text to Speech"
                        description="Give your words a voice."/>
        
                    <TTSGenerator
                    text={text}
                    onTextChange={setText}
                    onGenerate={ generate}
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