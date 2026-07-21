import { useState } from "react";

import { StoryGenerator } from "../features/stories/components/StoryGenerator.tsx";
import { StoryOutput } from "../features/stories/components/StoryOutput.tsx";
import {generateStory} from "../features/stories/api/storyApi.ts"
import type {GenerateStoryRequest} from "../features/stories/types/story.types.ts"

export function StoryPage()
{
    const [story, setStory] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleGenerate(prompt:string)
    {   
        setLoading(true)
        setError(null)

        try{
            const request : GenerateStoryRequest = {prompt}
            const response = await generateStory(request);
            let story : string  = response.story;
            setStory(story);
        }   
        catch(err) {
            if(err instanceof Error){
                setError(err.message)
            }else {
                setError("Something went wrong.")
            }
        }
        finally{
            setLoading(false)
        }
    }
    return (
        <main>
            <StoryGenerator 
            onGenerate={handleGenerate}
            loading={loading}
            />
            <StoryOutput 
            story={story}
            error={error}
            />
        </main>
    );
}