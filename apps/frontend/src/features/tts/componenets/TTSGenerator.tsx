import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
// import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";


type TTSGeneratorProps = {
    text: string;
    onTextChange : (value: string) => void;
    onGenerate: () => Promise<void>;
    loading: boolean;
};


export function TTSGenerator(props : TTSGeneratorProps)
{

    async function handleSubmit() {
       await props.onGenerate();
    }

    return (
        <div className="space-y-6">
        <Textarea 
        value = {props.text}
        onChange={(e)=>props.onTextChange(e.target.value)}
        placeholder="Enter the text you want to convert into speech. For example: Welcome to our podcast! Today we're exploring artificial intelligence..."
        className="min-h-40 resize-none"
        />
        <div className="flex justify-end">
        <p className="text-sm text-muted-foreground">
            {props.text.length} characters
        </p>
        </div>
        <Button 
        disabled= {props.loading || props.text.trim().length===0 }
        onClick={handleSubmit}
        >
            {props.loading && (
            <Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {props.loading
            ? "Generating..."
            : "Generate Speech"}
        </Button>
        </div>
    )
}