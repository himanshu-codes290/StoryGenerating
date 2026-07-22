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

        {story}
        </>
    )
}