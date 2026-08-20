import type { GenerateStoryRequest, GenerateStoryResponse } from "../types/story.types";
import type { ApiResponse } from "@repo/types";
import { API_BASE_URL } from "../../../lib/apiConfig";

export async function generateStory(
  request: GenerateStoryRequest
): Promise<GenerateStoryResponse> {
  // 1. Submit the task to queue
  const response = await fetch(`${API_BASE_URL}/api/v1/generate/stories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  let body: (ApiResponse<{ jobId: string; streamUrl: string }> & { message?: string }) | null = null;
  try {
    body = await response.json();
  } catch {
    // Non-JSON response
  }

  if (!response.ok || !body?.data) {
    const errorMsg =
      body?.error?.message ||
      body?.message ||
      response.statusText ||
      "Failed to initiate story generation.";
    throw new Error(errorMsg);
  }

  const { streamUrl } = body.data;
  // Ensure absolute path with leading slash so browser resolves from domain root
  const url = streamUrl.startsWith("/") ? streamUrl : `/${streamUrl}`;

  // 2. Wrap EventSource in a Promise to return GenerateStoryResponse smoothly
  return new Promise((resolve, reject) => {
    const eventSource = new EventSource(`${API_BASE_URL}${url}`);

    // Stream status update (Optional: pass to a callback if you want UI progress)
    eventSource.addEventListener("status", (e) => {
      try {
        console.log("Story generation status:", JSON.parse(e.data));
      } catch {
        // ignore parse error on status
      }
    });

    // Story complete event -> Resolve the Promise
    eventSource.addEventListener("completed", (e) => {
      try {
        const data = JSON.parse(e.data) as GenerateStoryResponse;
        eventSource.close(); // Always close stream connection on success
        resolve(data);
      } catch {
        eventSource.close();
        reject(new Error("Failed to parse completed story response."));
      }
    });

    // Error event -> Reject the Promise
    eventSource.addEventListener("error", (e) => {
      console.error("SSE connection error:", e);
      let errorMsg = "Story generation failed or connection was lost.";
      if (e instanceof MessageEvent && e.data) {
        try {
          const parsed = JSON.parse(e.data) as { error?: string; message?: string };
          if (parsed.error) errorMsg = parsed.error;
          else if (parsed.message) errorMsg = parsed.message;
        } catch {
          errorMsg = String(e.data);
        }
      }
      eventSource.close(); // Always close stream connection on error
      reject(new Error(errorMsg));
    });
  });
}
