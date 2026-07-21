import { useState } from "react";



interface StoryGeneratorProps{
    onGenerate : (story : string) => Promise<void>;
    loading : boolean
}


export function StoryGenerator({onGenerate,loading} : StoryGeneratorProps) {
    
    const [prompt,setPrompt] = useState("");

    async function handleSubmit()
    {
        await onGenerate(prompt);
    }

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setPrompt(event.target.value);
    }
    
    return (
       <>
            <h1> Generate your Story</h1>
            <textarea 
            value={prompt}
            onChange={handleChange}
            />
            <button
            onClick={handleSubmit}
            disabled={loading}
            > {loading ? "Generating..." : "Generate"}
            </button>
        </> 
    );
}