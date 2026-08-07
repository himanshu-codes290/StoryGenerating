import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Download,
  Volume2,
  VolumeX,
  AlertCircle,
  Music,
  Radio,
  Sparkles,
  RotateCcw
} from "lucide-react";

type TTSAudioPlayerProps = {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  error: string | null;
  audioUrl?: string | null;
};

export function TTSAudioPlayer({ audioRef, error, audioUrl }: TTSAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setHasAudio(true);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleCanPlay = () => setHasAudio(true);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [audioRef]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(console.error);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVol = parseFloat(e.target.value);
    audio.volume = newVol;
    setVolume(newVol);
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.muted = false;
      setIsMuted(false);
      audio.volume = volume || 1;
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(console.error);
  };

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds === 0) return "00:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleDownload = () => {
    const urlToDownload = audioUrl || audioRef.current?.src;
    if (!urlToDownload) return;

    const link = document.createElement("a");
    link.href = urlToDownload;
    link.download = `speech-audio-${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card/80 backdrop-blur-xl p-6 shadow-md transition-all">
      {/* Hidden Native HTML Audio Element */}
      <audio ref={audioRef} preload="metadata" className="hidden" />

      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20">
            <Music className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground tracking-tight">
              Voice Audio Player
            </h3>
            <p className="text-xs text-muted-foreground">
              Stream preview & high-quality audio download
            </p>
          </div>
        </div>

        {/* Live Audio Status Badge */}
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Playing Speech
            </span>
          ) : hasAudio || audioUrl ? (
            <span className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              <Radio className="h-3 w-3" />
              Audio Ready
            </span>
          ) : (
            <span className="text-xs text-muted-foreground bg-muted/40 px-3 py-1 rounded-full border border-border/40">
              Waiting for input
            </span>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {error ? (
        <Alert variant="destructive" className="rounded-xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Generation Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : hasAudio || audioUrl ? (
        <div className="space-y-6">
          {/* Visual Waveform Equalizer Display */}
          <div className="relative overflow-hidden rounded-xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-950/40 p-6 flex flex-col items-center justify-center min-h-28 shadow-inner">
            <div className="flex items-center justify-center gap-1.5 h-12 w-full">
              {[40, 75, 30, 90, 60, 100, 45, 85, 35, 70, 95, 50, 80, 40, 65].map((height, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-300 ${isPlaying
                      ? "bg-gradient-to-t from-indigo-500 via-purple-400 to-cyan-300 animate-pulse"
                      : "bg-indigo-500/30"
                    }`}
                  style={{
                    height: isPlaying ? `${Math.max(20, (height * (i % 2 === 0 ? 1 : 0.8)))}%` : "20%",
                    animationDelay: `${i * 70}ms`,
                    animationDuration: `${600 + (i % 4) * 200}ms`
                  }}
                />
              ))}
            </div>

            <p className="mt-2 text-[11px] font-medium text-indigo-300/80 tracking-wider uppercase">
              {isPlaying ? "Acoustic Voice Stream Playing" : "Voice Track Loaded"}
            </p>
          </div>

          {/* Progress Slider & Timestamps */}
          <div className="space-y-2">
            <div className="relative flex items-center">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
              />
            </div>
            <div className="flex justify-between text-xs font-mono text-muted-foreground px-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Player Controls & Download Button Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">

            {/* Play/Pause & Restart */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                size="icon"
                onClick={togglePlayPause}
                className="h-12 w-12 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
                title={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white ml-0.5" />}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleRestart}
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground"
                title="Restart Audio"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 ml-2 bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-4 w-4 text-red-400" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-indigo-500" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>

            {/* High-Grade Download Audio Button */}
            <Button
              type="button"
              onClick={handleDownload}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-md px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 group"
            >
              <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
              <span>Download Audio (MP3)</span>
              <span className="ml-1 text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-mono">
                .MP3
              </span>
            </Button>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl border border-dashed border-border/80 bg-muted/10 space-y-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-7 w-7" />
          </div>
          <div className="space-y-1 max-w-sm">
            <p className="text-base font-semibold text-foreground">No Audio Generated Yet</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enter your script above and click <strong className="text-foreground">"Generate Speech"</strong> to create high quality audio with download options.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}