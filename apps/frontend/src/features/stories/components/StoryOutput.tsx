interface StoryOutputProps {
    story : string;
    error : string | null;
}

export function StoryOutput({story,error} : StoryOutputProps)
{
    return (
        <>
        {story}
        {error && (
            <p>{error}</p>
        )}
        </>
    )
}