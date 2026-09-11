"use client";

import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLang}
      className="gap-1.5 text-xs font-bold"
    >
      <Globe className="h-4 w-4" />
      {lang.toUpperCase()}
    </Button>
  );
}
