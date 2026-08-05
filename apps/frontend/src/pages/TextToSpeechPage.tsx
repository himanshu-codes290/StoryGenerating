import { Container } from "../components/layout/Container";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/card"
import { Button } from "@/components/ui/button";

import { TTSGenerator } from "../features/tts/componenets/TTSGenerator"
import { TTSAudioPlayer } from "../features/tts/componenets/TTSAudioPlayer"
import { ScriptAssistantDrawer } from "@/features/tts/componenets/ScriptAssistantDrawer";
import { useTTS } from "@/features/tts/hooks/useTTS";
import { useState, useEffect, useRef } from "react";
import type { TTSProviderName } from "@repo/types";
import { TTS_PROVIDERS } from "@repo/shared";
import { TTSSettings } from "@/features/tts/componenets/TTSSettings";
import { TTS_LANGUAGES } from "@repo/shared";

export function TextToSpeechPage()
{
    const {loading, error, generate} = useTTS();
    const [text, setText] = useState("");
    const audioRef = useRef<HTMLAudioElement>(null);

    const [language, setLanguage] = useState("en");
    const [provider, setProvider] = useState<TTSProviderName>("deepgram");
    const [voice, setVoice] = useState("");

    const availableProviders = TTS_PROVIDERS.filter((provider) =>
      provider.voices.some((voice) => voice.languageId === language)
    );

    const selectedProvider = availableProviders.find(
        (p) => p.id === provider
    );

    const availableVoices = selectedProvider?.voices.filter(
        (voice) => voice.languageId === language
    ) ?? [];



    useEffect(() => {
    if (
        !availableProviders.some((p) => p.id === provider)
    ) {
        setProvider(availableProviders[0]?.id ?? "deepgram");
    }
    }, [language, availableProviders, provider]);

    useEffect(() => {
    if (
    !availableVoices.some((v) => v.id === voice)
    ) {
    setVoice(availableVoices[0]?.id ?? "");
    }
    }, [provider, language, availableVoices, voice]);



    const [assistantOpen, setAssistantOpen] = useState(false);

    return (
        <>
            <Container>
                <Card className="p-4">
                    <PageHeader
                        title="Convert Text to Speech"
                        description="Give your words a voice."/>
        
                    <TTSSettings
                        language={language}
                        provider={provider}
                        voice={voice}

                        languages={TTS_LANGUAGES}
                        providers={availableProviders}
                        voices={availableVoices}

                        onLanguageChange={setLanguage}
                        onProviderChange={setProvider}
                        onVoiceChange={setVoice}
                    />

                    <TTSGenerator
                    text={text}
                    onTextChange={setText}
                    onGenerate={ async () => {
                        if (!audioRef.current) return;
                        await generate({text,
                            provider,
                            language,
                            voice,
                        }, audioRef.current);
                    }}
                    loading= {loading}
                    />
                </Card>
                <Card className="p-4 mt-4">
                    <TTSAudioPlayer
                        audioRef={audioRef}
                        error={error}
                    />
                </Card>
                <Card>
                    <Button
                        variant="outline"
                        onClick={() => setAssistantOpen(true)}
                    >
                        ✨ Need help writing?
                    </Button>

                    <ScriptAssistantDrawer
                        open={assistantOpen}
                        onOpenChange={setAssistantOpen}
                        onUseScript={setText}
                    />
                </Card>
            </Container>

        </>
    )
}