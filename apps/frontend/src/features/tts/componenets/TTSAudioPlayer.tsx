import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type TTSAudioPlayerProps = {
  audioUrl: string | null;
  error: string | null;
};

export function TTSAudioPlayer({audioUrl,error } : TTSAudioPlayerProps)
{
    return (
        <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed p-6">
      {error ? (
        <Alert variant="destructive">
            <AlertTitle>
                Generation Failed
            </AlertTitle>

            <AlertDescription>
                {error}
            </AlertDescription>
        </Alert>
      ) : audioUrl ? (
        <div className="flex flex-col gap-4">
            <audio controls src={audioUrl}  className="w-full min-w-[300px]">
            Your browser does not support the audio element.
            </audio>
            <Button asChild className="w-fit">
                <a
                    href={audioUrl}
                    download="speech.mp3"
                >
                    Download Audio
                </a>
            </Button>
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          <p className="text-lg">🎵 Your generated speech will appear here.</p>
          <p className="mt-2 text-sm">
            Enter some text and click <strong>"Generate Speech"</strong>.
          </p>
        </div>
      )}
    </div>
    )
}