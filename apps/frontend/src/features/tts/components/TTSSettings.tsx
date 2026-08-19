import type { TTSProviderName } from "@repo/types";
import type {
  TTSLanguage,
  TTSProviderConfig,
  TTSVoice,
} from "@repo/shared";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Globe, Cpu, Mic2 } from "lucide-react";

type Props = {
  language: string;
  provider: TTSProviderName;
  voice: string;

  languages: TTSLanguage[];
  providers: TTSProviderConfig[];
  voices: TTSVoice[];

  onLanguageChange: (language: string) => void;
  onProviderChange: (provider: TTSProviderName) => void;
  onVoiceChange: (voice: string) => void;
};

export function TTSSettings({
  language,
  provider,
  voice,

  languages,
  providers,
  voices,

  onLanguageChange,
  onProviderChange,
  onVoiceChange,
}: Props) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-4 sm:p-5 space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Language */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-indigo-500" />
            Language
          </Label>

          <Select value={language} onValueChange={onLanguageChange}>
            <SelectTrigger className="h-10 bg-background/80 border-border/80 rounded-lg">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>

            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.id} value={lang.id}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Provider */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-indigo-500" />
            TTS Provider Engine
          </Label>

          <Select
            value={provider}
            onValueChange={(val) => onProviderChange(val as TTSProviderName)}
          >
            <SelectTrigger className="h-10 bg-background/80 border-border/80 rounded-lg font-medium">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>

            <SelectContent>
              {providers.map((prov) => (
                <SelectItem key={prov.id} value={prov.id}>
                  <span className="font-semibold">{prov.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Voice */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Mic2 className="h-3.5 w-3.5 text-indigo-500" />
            Voice Model
          </Label>

          <Select value={voice} onValueChange={onVoiceChange}>
            <SelectTrigger className="h-10 bg-background/80 border-border/80 rounded-lg font-medium">
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>

            <SelectContent>
              {voices.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}