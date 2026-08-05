

export async function playStream(
  response: Response,
  audio: HTMLAudioElement
) {
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
            console.log("canplay fired");
            audio.play().catch(console.error);
        },
        { once: true }
    );
//   audio.play().catch(console.error);

  const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");

  const reader = response.body!.getReader();

  while (true) {
  const { done, value } = await reader.read();
    // console.log("Appending", value?.length, "bytes");''
  if (done) {
    if (mediaSource.readyState === "open") {
       mediaSource.endOfStream();
    }
    // console.log("Stream finished");
    break;
  }

  await new Promise<void>((resolve) => {
    sourceBuffer.addEventListener("updateend", () => resolve(), {
      once: true,
    });

    sourceBuffer.appendBuffer(value);

      console.log(
        "readyState:",
        audio.readyState,
        "paused:",
        audio.paused
        );
  });

}
}