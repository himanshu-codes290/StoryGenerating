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
    <div className="grid gap-4 md:grid-cols-3">

      {/* Language */}

      <div className="space-y-2">
        <Label>Language</Label>

        <Select
          value={language}
          onValueChange={onLanguageChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>

          <SelectContent>
            {languages.map((language) => (
              <SelectItem
                key={language.id}
                value={language.id}
              >
                {language.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Provider */}

      <div className="space-y-2">
        <Label>Provider</Label>

        <Select
          value={provider}
          onValueChange={(value) =>
            onProviderChange(value as TTSProviderName)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select provider" />
          </SelectTrigger>

          <SelectContent>
            {providers.map((provider) => (
              <SelectItem
                key={provider.id}
                value={provider.id}
              >
                {provider.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Voice */}

      <div className="space-y-2">
        <Label>Voice</Label>

        <Select
          value={voice}
          onValueChange={onVoiceChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select voice" />
          </SelectTrigger>

          <SelectContent>
            {voices.map((voice) => (
              <SelectItem
                key={voice.id}
                value={voice.id}
              >
                {voice.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

    </div>
  );
}