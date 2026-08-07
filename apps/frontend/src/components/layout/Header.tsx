import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Menu, ChevronRight, Sparkles, BookOpen, Mic, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import { SidebarContent } from "./Sidebar";

const routeMeta: Record<string, { title: string; subtitle: string; icon: any }> = {
  "/": {
    title: "Dashboard Overview",
    subtitle: "Welcome to your AI Story & Voice Workspace",
    icon: LayoutDashboard,
  },
  "/story": {
    title: "Story Studio",
    subtitle: "Transform ideas into rich narrative stories",
    icon: BookOpen,
  },
  "/tts": {
    title: "Voice Studio (TTS)",
    subtitle: "Convert text scripts to natural multi-voice audio",
    icon: Mic,
  },
};

export function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentMeta = routeMeta[location.pathname] || {
    title: "Studio Workspace",
    subtitle: "AI-powered creative tools",
    icon: Sparkles,
  };

  const PageIcon = currentMeta.icon;

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-border/50 bg-background/80 backdrop-blur-md transition-all">
      <div className="flex h-full items-center justify-between px-4 md:px-6">
        
        {/* Left Side: Mobile Menu Trigger + Breadcrumb / Title */}
        <div className="flex items-center gap-3">
          {/* Mobile Sheet Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-muted-foreground hover:text-foreground"
                aria-label="Open navigation menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Breadcrumb & Title */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-foreground transition-colors font-medium">
                Workspace
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">{currentMeta.title}</span>
            </div>
            <h1 className="text-sm md:text-base font-semibold text-foreground tracking-tight flex items-center gap-2">
              <PageIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400 hidden sm:inline-block" />
              {currentMeta.title}
            </h1>
          </div>
        </div>

        {/* Right Side Tools & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-border/60 bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-spin" style={{ animationDuration: '4s' }} />
            <span>AI Ready</span>
          </div>

          <ThemeToggle />

          {location.pathname !== "/story" && (
            <Button
              asChild
              size="sm"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm transition-all text-xs sm:text-sm"
            >
              <Link to="/story">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                Create Story
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
