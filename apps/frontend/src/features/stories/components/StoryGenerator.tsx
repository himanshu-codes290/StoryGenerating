import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";


interface StoryGeneratorProps{
    onGenerate : (story : string) => Promise<void>;
    loading : boolean
}


export function StoryGenerator({onGenerate,loading} : StoryGeneratorProps) {
    
    const [prompt,setPrompt] = useState("");
    const maxLenght=300

    async function handleSubmit()
    {
        await onGenerate(prompt);
    }

    function handleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setPrompt(event.target.value);
    }
    
    return (
       <div className="space-y-4">
        <div className="flex flex-col gap-2">
            <Textarea 
            placeholder="Describe the story you want to generate..."
            value={prompt}
            onChange={handleChange}
            className="min-h-32"
            />
            <span className="text-sm text-muted-foreground ml-2"> {prompt.length}/{maxLenght} </span>
        </div>
            {
                loading ? 
                <div  className="flex items-center gap-2">
                <Spinner />
                <span>Generating...</span>
                </div> 
                :  <Button
                onClick={handleSubmit}
                disabled={loading}
            > Generate
            </Button>
            }
           
        </div>
    );
}