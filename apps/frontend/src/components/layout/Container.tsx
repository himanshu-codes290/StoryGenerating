type ContainerProps = {
    children : React.ReactNode,
    className? : string
}

export function Container({children, className=''} : ContainerProps)
{
    return (
    <div className={`mx-auto w-full max-w-4xl px-6 py-8 ${className}`}>
      {children}
    </div>
    )
}