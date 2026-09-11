"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage, type Lang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const LANGUAGES: { code: Lang; label: string; flag: string; short: string }[] = [
  { code: "fr", label: "Français", flag: "🇫🇷", short: "FR" },
  { code: "en", label: "English", flag: "🇬🇧", short: "EN" },
];

export function LanguageToggle({ variant = "light-header" }: { variant?: "light-header" | "dark-header" }) {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const isDark = variant === "dark-header";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-semibold transition-colors",
          isDark
            ? "text-white hover:bg-white/15 bg-white/10 backdrop-blur-sm border border-white/20"
            : "text-foreground hover:bg-secondary border border-border bg-background"
        )}
        aria-label="Language selector"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.short}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1.5 min-w-[160px] rounded-xl border border-border bg-popover shadow-xl z-50 overflow-hidden">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors text-left",
                l.code === lang
                  ? "bg-accent/10 text-accent font-semibold"
                  : "text-foreground hover:bg-secondary"
              )}
            >
              <span className="text-lg leading-none">{l.flag}</span>
              <span className="flex-1">{l.label}</span>
              {l.code === lang && <Check className="h-4 w-4 text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
