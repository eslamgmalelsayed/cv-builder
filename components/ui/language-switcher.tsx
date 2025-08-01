"use client";

import { useState, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

type Language = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
};

const languages: Language[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    dir: "ltr",
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    dir: "rtl",
  },
];

interface LanguageSwitcherProps {
  currentLanguage?: string;
  onLanguageChange?: (language: Language) => void;
  className?: string;
}

export function LanguageSwitcher({
  currentLanguage: propCurrentLanguage,
  onLanguageChange,
  className,
}: LanguageSwitcherProps) {
  const [mounted, setMounted] = useState(false);

  // Get current language object
  const getCurrentLanguage = () => {
    const langCode = propCurrentLanguage || "ar";
    return languages.find((lang) => lang.code === langCode) || languages[1];
  };

  const currentLanguage = getCurrentLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (language: Language) => {
    // Save preference
    localStorage.setItem("preferred-language", language.code);

    // Notify parent component - let the context handle DOM updates
    onLanguageChange?.(language);
  };

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="gap-2 min-w-[120px]">
        <Globe className="h-4 w-4" />
        <span>Loading...</span>
      </Button>
    );
  }

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`gap-2 min-w-[120px] ${className}`}
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">
              {currentLanguage.flag} {currentLanguage.nativeName}
            </span>
            <span className="sm:hidden">{currentLanguage.flag}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[150px] z-[60]">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageChange(language)}
              className={`cursor-pointer ${
                currentLanguage.code === language.code ? "bg-accent" : ""
              }`}
            >
              <span className="mr-2">{language.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{language.nativeName}</span>
                <span className="text-xs text-muted-foreground">
                  {language.name}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
