import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TTSGenerator } from "../features/tts/componenets/TTSGenerator";
import { TTSAudioPlayer } from "../features/tts/componenets/TTSAudioPlayer";
import { ScriptAssistantDrawer } from "@/features/tts/componenets/ScriptAssistantDrawer";
import { TTSSettings } from "@/features/tts/componenets/TTSSettings";
import { useTTS } from "@/features/tts/hooks/useTTS";
import type { TTSProviderName } from "@repo/types";
import { TTS_PROVIDERS, TTS_LANGUAGES } from "@repo/shared";
import { Mic, Sparkles } from "lucide-react";

export function TextToSpeechPage() {
  const { loading, error, audioUrl, generate } = useTTS();
  const [text, setText] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  const [language, setLanguage] = useState("en");
  const [provider, setProvider] = useState<TTSProviderName>("deepgram");
  const [voice, setVoice] = useState("");

  const availableProviders = TTS_PROVIDERS.filter((p) =>
    p.voices.some((v) => v.languageId === language)
  );

  const selectedProvider = availableProviders.find((p) => p.id === provider);

  const availableVoices =
    selectedProvider?.voices.filter((v) => v.languageId === language) ?? [];

  useEffect(() => {
    if (!availableProviders.some((p) => p.id === provider)) {
      setProvider(availableProviders[0]?.id ?? "deepgram");
    }
  }, [language, availableProviders, provider]);

  useEffect(() => {
    if (!availableVoices.some((v) => v.id === voice)) {
      setVoice(availableVoices[0]?.id ?? "");
    }
  }, [provider, language, availableVoices, voice]);

  const [assistantOpen, setAssistantOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Studio Header Card */}
      <div className="rounded-2xl border border-border/60 bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-background p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              <Mic className="h-3.5 w-3.5" />
              Voice Synthesis Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Text to Speech Studio
            </h1>
            <p className="text-sm text-muted-foreground">
              Transform written text into natural, life-like audio across multiple AI voice providers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground bg-card px-3 py-1.5 rounded-lg border border-border/60 shadow-xs flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              {availableVoices.length} Voices Available
            </span>
          </div>
        </div>
      </div>

      {/* Main Generator Card */}
      <Card className="border-border/60 shadow-md">
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* TTS Configuration Options */}
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

          {/* Text Area Input with Need Help Writing button directly beneath it */}
          <TTSGenerator
            text={text}
            onTextChange={setText}
            onGenerate={async () => {
              if (!audioRef.current) return;
              await generate(
                {
                  text,
                  provider,
                  language,
                  voice,
                },
                audioRef.current
              );
            }}
            loading={loading}
            onOpenAssistant={() => setAssistantOpen(true)}
          />
        </CardContent>
      </Card>

      {/* Audio Player Card */}
      <TTSAudioPlayer audioRef={audioRef} error={error} audioUrl={audioUrl} />

      {/* AI Script Assistant Drawer */}
      <ScriptAssistantDrawer
        open={assistantOpen}
        onOpenChange={setAssistantOpen}
        onUseScript={setText}
      />
    </div>
  );
}