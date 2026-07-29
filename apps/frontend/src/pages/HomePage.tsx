import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HomePage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center py-16 text-center">
      <h1 className="text-4xl font-bold">AI Playground</h1>

      <p className="mt-4 text-muted-foreground">
        Choose a tool.
      </p>

      <div className="mt-8 flex flex-col gap-4 w-full max-w-xs">
        <Button asChild size="lg">
          <NavLink to="/story">
            Story Generator
          </NavLink>
        </Button>

        <Button asChild size="lg" variant="outline">
          <NavLink to="/tts">
            Text To Speech
          </NavLink>
        </Button>
      </div>
    </div>
  );
}