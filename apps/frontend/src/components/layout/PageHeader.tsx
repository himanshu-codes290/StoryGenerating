type PageHeaderProps = {
    title : string,
    description? : string,
    className? : string
}

export function PageHeader({title,description, className=''}:PageHeaderProps)
{
    return (
        <header className={`mb-8 space-y-2 border-gray-200 dark:border-gray-800 ${className} `} >
            <h1
            className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-700 sm:text-3xl"
            >{title}</h1>
            { description && <p
            className="text-sm text-gray-500 dark:text-gray-400 sm:text-base ml-4"
            >{description}</p>}
        </header>
)};