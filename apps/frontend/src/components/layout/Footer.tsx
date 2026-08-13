import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-card/40 py-6 px-4 md:px-6 text-xs text-muted-foreground transition-colors">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600/10 text-indigo-600 dark:text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="font-semibold text-foreground">StoryCraft AI Studio</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for creative writing
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            All services operational
          </span>
        </div>
      </div>
    </footer>
  );
}
