import type { GenerateTextRequest, GenerateTextCallbacks } from "../types/generateText.types";
import type { ApiResponse } from "@repo/types";
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
    let errorMessage = "Failed to start text generation.";
    try {
      const errorBody = (await response.json()) as ApiResponse<null> & { message?: string };
      if (errorBody?.error?.message) {
        errorMessage = errorBody.error.message;
      } else if (errorBody?.message) {
        errorMessage = errorBody.message;
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const body = (await response.json()) as ApiResponse<{
    jobId: string;
    status: string;
    streamUrl: string;
  }>;

  if (!body.data?.streamUrl) {
    throw new Error(body.error?.message ?? "Invalid response from server");
  }

  const rawStreamUrl = body.data.streamUrl;
  const streamUrl = rawStreamUrl.startsWith("/") ? rawStreamUrl : `/${rawStreamUrl}`;

  const eventSource = new EventSource(`${API_BASE_URL}${streamUrl}`);

  let isClosed = false;

  const closeStream = () => {
    if (isClosed) return;
    isClosed = true;
    eventSource.close();
  };

  // data
  eventSource.addEventListener("token", (event) => {
    try {
      const payload = JSON.parse(event.data);
      callbacks.onToken(payload.data ?? payload);
    } catch {
      callbacks.onToken(event.data);
    }
  });

  // complete
  eventSource.addEventListener("complete", () => {
    callbacks.onComplete();
    closeStream();
  });

  // Named SSE "event: error" frames sent by the backend
  eventSource.addEventListener("error", (event) => {
    if (isClosed) return;
    if (event instanceof MessageEvent && event.data) {
      let message = "An unexpected error occurred during text generation.";
      try {
        const parsed = JSON.parse(event.data) as { data?: string; error?: string; message?: string };
        if (parsed.data) message = parsed.data;
        else if (parsed.error) message = parsed.error;
        else if (parsed.message) message = parsed.message;
      } catch {
        message = String(event.data);
      }
      callbacks.onError(message);
      closeStream();
    }
  });

  // Connection-level failures (network error, CORS block, server crash, etc.)
  eventSource.onerror = (event) => {
    if (isClosed) return;
    if (event instanceof MessageEvent && event.data) {
      try {
        const parsed = JSON.parse(event.data) as { data?: string; error?: string; message?: string };
        const msg = parsed.data || parsed.error || parsed.message || String(event.data);
        callbacks.onError(msg);
        closeStream();
        return;
      } catch {
        // ignore
      }
    }
    callbacks.onError("Connection lost or failed to reach the server. Please try again.");
    closeStream();
  };

  return () => {
    closeStream();
  };
}


