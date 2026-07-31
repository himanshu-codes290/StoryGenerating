import { NavLink } from "react-router-dom"

export function Navbar()
{
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
        ? "font-semibold text-primary"
        : "text-muted-foreground";
    return (
        <nav className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
        <NavLink
          to="/"
          className={`${navLinkClass} font-bold text-lg`}
        >
          AI Playground
        </NavLink>

        <NavLink
          to="/story"
          className={navLinkClass}
        >
          Story
        </NavLink>

        <NavLink
          to="/tts"
          className={navLinkClass}
        >
          Text to Speech
        </NavLink>
      </div>
    </nav>
    )
}