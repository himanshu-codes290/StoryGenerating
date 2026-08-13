import type { GenerateTextRequest, GenerateTextCallbacks } from "../types/generateText.types";
import { API_BASE_URL } from "../../../lib/apiConfig";

export async function generateText(
  request: GenerateTextRequest,
  callbacks: GenerateTextCallbacks
): Promise<() => void> {
  const response = await fetch(`${API_BASE_URL}/api/v1/generate/text`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("Failed to start text generation");
  }

  const body = await response.json();
  const rawStreamUrl = body.data?.streamUrl ?? "";
  const streamUrl = rawStreamUrl.startsWith("/") ? rawStreamUrl : `/${rawStreamUrl}`;

  const eventSource = new EventSource(`${API_BASE_URL}${streamUrl}`);

  // data
  eventSource.addEventListener("token", (event) => {
    const payload = JSON.parse(event.data);
    callbacks.onToken(payload.data);
  });

  // complete
  eventSource.addEventListener("complete", () => {
    callbacks.onComplete();
    eventSource.close();
  });

  // error
  eventSource.addEventListener("error", (event) => {
    callbacks.onError(`Generation failed. ${event}`);
    eventSource.close();
  });

  return () => {
    eventSource.close();
  };
}
