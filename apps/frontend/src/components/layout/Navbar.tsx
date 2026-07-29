import { NavLink } from "react-router-dom"

export function Navbar()
{
    return (
        <nav className="border-b">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-6 px-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "font-semibold text-primary" : "text-muted-foreground"
          }
        >
          AI Playground
        </NavLink>

        <NavLink
          to="/story"
          className={({ isActive }) =>
            isActive ? "font-semibold text-primary" : "text-muted-foreground"
          }
        >
          Story
        </NavLink>

        <NavLink
          to="/tts"
          className={({ isActive }) =>
            isActive ? "font-semibold text-primary" : "text-muted-foreground"
          }
        >
          Text to Speech
        </NavLink>
      </div>
    </nav>
    )
}