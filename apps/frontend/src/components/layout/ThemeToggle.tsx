import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) {
        return savedTheme === "dark";
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setIsDark((prev) => !prev)}
      className="relative rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-amber-400 transition-transform duration-200 rotate-0 scale-100" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 dark:text-slate-200 transition-transform duration-200 rotate-0 scale-100" />
      )}
    </Button>
  );
}
