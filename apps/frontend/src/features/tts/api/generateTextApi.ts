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

  // Named SSE "event: error" frames sent by the backend
  eventSource.addEventListener("error", (event) => {
    let message = "An unexpected error occurred. Please try again.";
    if (event instanceof MessageEvent && event.data) {
      try {
        const parsed = JSON.parse(event.data) as { data?: string };
        if (parsed.data) message = parsed.data;
      } catch {
        message = String(event.data);
      }
    }
    callbacks.onError(message);
    eventSource.close();
  });

  // Connection-level failures (network error, CORS block, server crash, etc.)
  // These fire on onerror with a plain Event, NOT a MessageEvent.
  eventSource.onerror = () => {
    // Only handle if the source hasn't already been closed by the named handler above
    if (eventSource.readyState === EventSource.CLOSED) return;
    callbacks.onError("Connection lost or failed to reach the server. Please try again.");
    eventSource.close();
  };

  return () => {
    eventSource.close();
  };
}
