import type { GenerateStoryRequest, GenerateStoryResponse } from "../types/story.types";

export async function generateStory(
    request : GenerateStoryRequest
) : Promise<GenerateStoryResponse> {

    const response = await fetch("/api/v1/generate-story",{
        method : "POST",
        headers : {
            "Content-Type" : "application/json",
        },
        body : JSON.stringify(request)
    });

    if (!response.ok){
        const error = await response.json();
        throw new Error(error.messages ?? "Failed to generate story");
    }
    const story = await response.json() as GenerateStoryResponse;
    return story;
}