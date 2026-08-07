import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Sparkles, 
  BookOpen, 
  Mic, 
  Wand2, 
  ArrowRight, 
  Bot, 
  Volume2, 
  CheckCircle2 
} from "lucide-react";

export function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white p-6 sm:p-10 shadow-xl">
        {/* Subtle decorative background circles */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -top-10 h-48 w-48 rounded-full bg-purple-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1 text-xs font-semibold text-indigo-200 border border-white/15">
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            <span>AI Powered Content Creation Studio</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Craft Captivating Stories & Realistic Voices
          </h1>

          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed">
            Generate creative stories from simple prompts and transform them into life-like voice audio using multiple state-of-the-art TTS providers.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild size="lg" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold shadow-lg">
              <Link to="/story">
                <BookOpen className="mr-2 h-4 w-4 text-indigo-600" />
                Start Story Generator
              </Link>
            </Button>

            <Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm">
              <Link to="/tts">
                <Mic className="mr-2 h-4 w-4 text-purple-300" />
                Text to Speech
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Creative Tools & Features
          </h2>
          <p className="text-sm text-muted-foreground">
            Select a tool to start generating content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Story Generator Card */}
          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-indigo-500/40 flex flex-col justify-between">
            <CardHeader className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
                <Wand2 className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Story Generator</CardTitle>
                <CardDescription className="mt-1">
                  Turn your ideas, themes, or plots into structured narratives with instant AI script support.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Customizable prompt input</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" />
                  <span>One-click audio voice synthesis</span>
                </li>
              </ul>
              <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                <Link to="/story" className="flex items-center justify-center gap-2">
                  Launch Story Studio
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Text To Speech Card */}
          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-purple-500/40 flex flex-col justify-between">
            <CardHeader className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                <Volume2 className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">Voice Synthesis (TTS)</CardTitle>
                <CardDescription className="mt-1">
                  Convert written text into natural human voices with selection of languages and providers.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-500" />
                  <span>Multiple TTS voice providers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-500" />
                  <span>Built-in audio player & controls</span>
                </li>
              </ul>
              <Button asChild variant="outline" className="w-full border-purple-500/30 hover:bg-purple-500/10 text-purple-700 dark:text-purple-300">
                <Link to="/tts" className="flex items-center justify-center gap-2">
                  Open Voice Studio
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* AI Script Assistant Card */}
          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-cyan-500/40 flex flex-col justify-between md:col-span-2 lg:col-span-1">
            <CardHeader className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Script Assistant</CardTitle>
                <CardDescription className="mt-1">
                  Draft, summarize, translate, or refine scripts in professional or casual tones with streaming feedback.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-500" />
                  <span>Streaming text completion engine</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-500" />
                  <span>Tone & task mode selector</span>
                </li>
              </ul>
              <Button asChild variant="secondary" className="w-full">
                <Link to="/tts" className="flex items-center justify-center gap-2">
                  Try Script Assistant
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Capabilities Stats Bar */}
      <section className="rounded-xl border border-border/60 bg-card/50 p-6 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">Multi</p>
            <p className="text-xs font-medium text-muted-foreground">TTS Providers</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">100%</p>
            <p className="text-xs font-medium text-muted-foreground">Custom Prompts</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">Realtime</p>
            <p className="text-xs font-medium text-muted-foreground">Audio Generation</p>
          </div>
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">Dark/Light</p>
            <p className="text-xs font-medium text-muted-foreground">Theme Support</p>
          </div>
        </div>
      </section>
    </div>
  );
}