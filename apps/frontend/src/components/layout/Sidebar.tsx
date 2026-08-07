import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  BookOpen, 
  Mic, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
}

export function SidebarContent({ onNavigate, collapsed }: { onNavigate?: () => void; collapsed?: boolean }) {
  const navItems = [
    {
      to: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      to: "/story",
      label: "Story Generator",
      icon: BookOpen,
      badge: "AI",
    },
    {
      to: "/tts",
      label: "Text To Speech",
      icon: Mic,
      badge: "Voice",
    },
  ];

  return (
    <div className="flex h-full flex-col justify-between py-4 px-3 select-none">
      <div className="space-y-6">
        {/* Logo Section */}
        <div className={`flex items-center gap-3 px-2 ${collapsed ? "justify-center" : ""}`}>
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-md shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-foreground text-base leading-none">
                StoryCraft <span className="text-indigo-600 dark:text-indigo-400">AI</span>
              </span>
              <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase mt-1">
                Content Studio
              </span>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider mb-2">
              Workspace
            </p>
          )}

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onNavigate}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400 font-semibold"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  } ${collapsed ? "justify-center px-2" : ""}`
                }
                title={collapsed ? item.label : undefined}
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-5 w-5 shrink-0 transition-colors ${
                      isActive ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground group-hover:text-foreground"
                    }`} />
                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="ml-auto rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Footer Info Card */}
      {!collapsed ? (
        <div className="space-y-3 pt-4 border-t border-border/40">
          <div className="rounded-xl bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-cyan-500/5 border border-indigo-500/10 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-semibold text-foreground">AI Engine Online</span>
              </div>
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">Ready</span>
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground leading-tight">
              Multi-provider speech & story generator workspace.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex justify-center pt-4 border-t border-border/40">
          <span className="relative flex h-2.5 w-2.5" title="AI Engine Ready">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
      )}
    </div>
  );
}

export function Sidebar({ collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside
      className={`hidden md:flex flex-col border-r border-border/60 bg-card/60 backdrop-blur-xl transition-all duration-300 relative z-20 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <SidebarContent collapsed={collapsed} />

      {/* Collapse/Expand Toggle Button */}
      {onToggleCollapse && (
        <Button
          variant="outline"
          size="icon"
          onClick={onToggleCollapse}
          className="absolute -right-3 top-6 h-6 w-6 rounded-full border shadow-sm bg-background hover:bg-accent text-muted-foreground hover:text-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-3.5 w-3.5" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5" />
          )}
        </Button>
      )}
    </aside>
  );
}
