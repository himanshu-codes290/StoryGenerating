export async function playStream(
  response: Response,
  audio: HTMLAudioElement
): Promise<{ blobUrl: string; blob: Blob }> {
  const mediaSource = new MediaSource();
  audio.src = URL.createObjectURL(mediaSource);

  await new Promise<void>((resolve) => {
    mediaSource.addEventListener("sourceopen", () => resolve(), {
      once: true,
    });
  });

  audio.addEventListener(
    "canplay",
    () => {
      audio.play().catch(console.error);
    },
    { once: true }
  );

  const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
  const reader = response.body!.getReader();
  const chunks: Uint8Array[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      if (mediaSource.readyState === "open") {
        mediaSource.endOfStream();
      }
      break;
    }
    if (value) {
      chunks.push(value);
      await new Promise<void>((resolve) => {
        sourceBuffer.addEventListener("updateend", () => resolve(), {
          once: true,
        });
        sourceBuffer.appendBuffer(value);
      });
    }
  }

  const audioBlob = new Blob(chunks as BlobPart[], { type: "audio/mpeg" });
  const blobUrl = URL.createObjectURL(audioBlob);
  return { blobUrl, blob: audioBlob };
}