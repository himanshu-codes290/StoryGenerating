
type TTSAudioPlayerProps = {
  audioUrl: string | null;
  error: string | null;
};

export function TTSAudioPlayer({audioUrl,error } : TTSAudioPlayerProps)
{
    return (
        <>
            {
                error ? "Error" :
                audioUrl ? <audio controls src={audioUrl} className="w-full"></audio> : "🎵 Generated Audio will come Here."
            }
        </>
    )
}