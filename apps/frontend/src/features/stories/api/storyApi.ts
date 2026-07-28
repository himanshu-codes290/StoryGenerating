import type { GenerateStoryRequest, GenerateStoryResponse } from "../types/story.types";
import type {ApiResponse} from "../../../../../packages/types/api.types"

export async function generateStory(
    request : GenerateStoryRequest
) : Promise<GenerateStoryResponse> {

    // 1. Submit the task to queue
    const response = await fetch('/api/v1/generate/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });

    const body = await response.json() as ApiResponse<{ jobId: string; streamUrl: string }>;
    
    if (!response.ok || !body.data) {
        throw new Error(body.error?.message ?? "Failed to initiate story generation.");
    }
    
    const { streamUrl } = body.data;

    // 2. Wrap EventSource in a Promise to return GenerateStoryResponse smoothly
    return new Promise((resolve, reject) => {
        const eventSource = new EventSource(streamUrl);

    // Stream status update (Optional: pass to a callback if you want UI progress)
        eventSource.addEventListener('status', (e) => {
        console.log('Story generation status:', JSON.parse(e.data));
    });
    
    // Story complete event -> Resolve the Promise
    eventSource.addEventListener('completed', (e) => {
      try {
        const data = JSON.parse(e.data) as GenerateStoryResponse;
        eventSource.close(); // Always close stream connection on success
        resolve(data);
      } catch (err) {
        eventSource.close();
        reject(new Error("Failed to parse completed story response."));
      }
    });

    // Error event -> Reject the Promise
    eventSource.addEventListener('error', (e) => {
      console.error('SSE connection error:', e);
      eventSource.close(); // Always close stream connection on error
      reject(new Error("Story generation failed or connection was lost."));
    });
});

    // const response = await fetch("/api/v1/generate-story",{
    //     method : "POST",
    //     headers : {
    //         "Content-Type" : "application/json",
    //     },
    //     body : JSON.stringify(request)
    // });

    // const body = await response.json() as ApiResponse<GenerateStoryResponse>;

    // if (!response.ok) {
    // throw new Error(
    //     body.error?.message ?? "Failed to generate story."
    // );
    // }

    // if (!body.data) {
    // throw new Error("Response did not contain story data.");
    // }

    // return body.data;
}
