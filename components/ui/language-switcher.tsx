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
  onLanguageChange?: (language: Language) => void;
  className?: string;
}

export function LanguageSwitcher({
  onLanguageChange,
  className,
}: LanguageSwitcherProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    languages[0]
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if there's a saved language preference
    const savedLang = localStorage.getItem("preferred-language");
    if (savedLang) {
      const found = languages.find((lang) => lang.code === savedLang);
      if (found) {
        setCurrentLanguage(found);
        document.documentElement.dir = found.dir;
        document.documentElement.lang = found.code;
        if (found.dir === "rtl") {
          document.body.classList.add("font-cairo");
          document.body.classList.remove("font-inter");
        } else {
          document.body.classList.add("font-inter");
          document.body.classList.remove("font-cairo");
        }
      }
    }
  }, []);

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);

    // Update HTML attributes
    document.documentElement.dir = language.dir;
    document.documentElement.lang = language.code;

    // Update font family based on language
    if (language.dir === "rtl") {
      document.body.classList.add("font-cairo");
      document.body.classList.remove("font-inter");
    } else {
      document.body.classList.add("font-inter");
      document.body.classList.remove("font-cairo");
    }

    // Save preference
    localStorage.setItem("preferred-language", language.code);

    // Notify parent component
    onLanguageChange?.(language);
  };

  if (!mounted) {
    return null;
  }

  return (
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
      <DropdownMenuContent align="end" className="min-w-[150px]">
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
  );
}
