import { useState } from "react";

import { StoryGenerator } from "../features/stories/components/StoryGenerator.tsx";
import { StoryOutput } from "../features/stories/components/StoryOutput.tsx";
import { generateStory } from "../features/stories/api/storyApi.ts"

import { Container } from "../components/layout/Container.tsx";
import { PageHeader } from "../components/layout/PageHeader.tsx";
import { Card } from "@/components/ui/Card.tsx";

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
            const response = await generateStory({prompt,});
            setStory(response.story);
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
            <Container
            className="flex flex-col gap-4"
            >
                <PageHeader title={
                "AI Story Generating"}
                description="Generate creative stories from your ideas."
                />

                <Card
                className="p-4"
                >
                    <StoryGenerator 
                    onGenerate={handleGenerate}
                    loading={loading}
                    />
                </Card>
                
                <Card
                className="p-4"
                >
                    <StoryOutput 
                    story={story}
                    error={error}
                    />
                </Card>
            </Container>
        </main>
    );
}