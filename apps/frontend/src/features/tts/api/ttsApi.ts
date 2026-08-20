import type { TTSRequest } from "@repo/types/speech/tts.types";
import type { ApiResponse } from "@repo/types";
import { API_BASE_URL } from "../../../lib/apiConfig";

export async function generateSpeech(request: TTSRequest): Promise<Response> {
  const response = await fetch(`${API_BASE_URL}/api/v1/generate/speech`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let errorMessage = "Failed to generate speech.";
    try {
      const errorBody = (await response.json()) as ApiResponse<null> & { message?: string };
      if (errorBody?.error?.message) {
        errorMessage = errorBody.error.message;
      } else if (errorBody?.message) {
        errorMessage = errorBody.message;
      }
    } catch {
      // Fallback to HTTP status text or default message if body is not JSON
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response;
}