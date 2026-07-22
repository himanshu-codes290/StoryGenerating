interface StoryOutputProps {
    story : string;
    error : string | null;
}

export function StoryOutput({story,error} : StoryOutputProps)
{
    return (
        <>
        {error && (
            <p>{error}</p>
        )}

        {!story && (
            <p className="text-sm text-muted-foreground"> Your generated story will appear here. <br />
                Start by describing a scene, character, or idea.
            </p>
        )}
        </>
    )
}