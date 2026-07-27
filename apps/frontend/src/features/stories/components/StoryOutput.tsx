interface StoryOutputProps {
    story : string;
    error : string | null;
}

export function StoryOutput({story,error} : StoryOutputProps)
{
    return (
    <>
        {error && <p className="text-sm text-red-500">{error}</p>}

         {story ? (
        <div className="whitespace-pre-wrap text-sm">
          {story}
        </div>
        ) : (
            <p className="text-sm text-muted-foreground">
            Your generated story will appear here. <br />
            Start by describing a scene, character, or idea.
            </p>
        )}
    </>
    )
}