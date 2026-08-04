import { TTSProviderConfig } from "./tts.types.js";
import { DEEPGRAM_VOICES } from "./deepgram/voice.js";
import { ELEVENLABS_VOICES } from "./elevenlabs/voice.js";
import { GOOGLE_TTS_VOICES } from "./google/voice.js";

export const TTS_PROVIDERS: TTSProviderConfig[] = [
  {
    id: "deepgram",
    label: "Deepgram",
    voices: DEEPGRAM_VOICES,
  },

  {
    id: "elevenlabs",
    label: "ElevenLabs",
    voices: ELEVENLABS_VOICES,
  },

  {
    id: "google_tts",
    label: "Google",
    voices: GOOGLE_TTS_VOICES,
  },
];