"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Palette, Languages, Trash2 } from "lucide-react";
import { useCVData } from "@/hooks/use-cv-data";

interface ThemeCustomizerProps {
  onDirectionChange?: (direction: "ltr" | "rtl") => void;
  onLanguageChange?: (language: "en" | "ar") => void;
  onThemeColorChange?: (themeColor: string) => void;
  currentThemeColor?: string;
  currentLanguage?: "en" | "ar";
  currentDirection?: "ltr" | "rtl";
}

const themeColors = [
  { name: "Blue", value: "theme-blue", color: "bg-blue-500" },
  { name: "Green", value: "theme-green", color: "bg-green-500" },
  { name: "Purple", value: "theme-purple", color: "bg-purple-500" },
  { name: "Red", value: "theme-red", color: "bg-red-500" },
  { name: "Orange", value: "theme-orange", color: "bg-orange-500" },
  { name: "Pink", value: "theme-pink", color: "bg-pink-500" },
  { name: "Indigo", value: "theme-indigo", color: "bg-indigo-500" },
  { name: "Teal", value: "theme-teal", color: "bg-teal-500" },
  { name: "Gray", value: "theme-gray", color: "bg-gray-700" },
  { name: "Black", value: "theme-black", color: "bg-black" },
];

const languages = [
  { code: "en", name: "English", direction: "ltr" as const, flag: "🇺🇸" },
  { code: "ar", name: "العربية", direction: "rtl" as const, flag: "🇸🇦" },
];

const translations = {
  en: {
    colors: "Colors",
    themeColors: "Theme Colors",
    current: "Current: ",
    clearData: "Clear All Data",
    clearing: "Clearing...",
  },
  ar: {
    colors: "الألوان",
    themeColors: "ألوان المظهر",
    current: "الحالي: ",
    clearData: "مسح جميع البيانات",
    clearing: "جاري المسح...",
  },
};

export function ThemeCustomizer({
  onDirectionChange,
  onLanguageChange,
  onThemeColorChange,
  currentThemeColor = "theme-black",
  currentLanguage = "en",
  currentDirection = "ltr",
}: ThemeCustomizerProps) {
  const { clearAllData } = useCVData();
  const [mounted, setMounted] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleColorChange = (colorValue: string) => {
    onThemeColorChange?.(colorValue);

    // Apply theme color immediately
    document.documentElement.className = document.documentElement.className
      .replace(/theme-\w+/g, "")
      .concat(` ${colorValue}`);
  };

  const handleLanguageChange = (languageCode: "en" | "ar") => {
    const selectedLang = languages.find((lang) => lang.code === languageCode);
    if (!selectedLang) return;

    // Update document attributes
    document.documentElement.setAttribute("dir", selectedLang.direction);
    document.documentElement.setAttribute("lang", selectedLang.code);

    // Add/remove Cairo font class
    if (selectedLang.code === "ar") {
      document.documentElement.classList.add("cairo-font");
      document.body.classList.add("cairo-font");
    } else {
      document.documentElement.classList.remove("cairo-font");
      document.body.classList.remove("cairo-font");
    }

    // Notify parent components
    onDirectionChange?.(selectedLang.direction);
    onLanguageChange?.(languageCode);
  };

  const handleClearData = async () => {
    setIsClearing(true);

    try {
      // Call the clear function
      clearAllData();

      // Add a small delay to show the clearing state
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error clearing data:", error);
    } finally {
      setIsClearing(false);
    }
  };

  if (!mounted) {
    return null;
  }

  const currentLangData = languages.find(
    (lang) => lang.code === currentLanguage
  );
  const t = translations[currentLanguage];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
      {/* Color Theme Selector */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-center gap-2 bg-transparent w-full sm:w-auto"
          >
            <Palette className="w-4 h-4" />
            {t.colors}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="end">
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">{t.themeColors}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {themeColors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleColorChange(color.value)}
                    className={`w-8 h-8 rounded-full ${
                      color.color
                    } border-2 transition-all hover:scale-110 ${
                      currentThemeColor === color.value
                        ? "border-gray-900 ring-2 ring-gray-300"
                        : "border-gray-200"
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
              <div className="mt-3 text-center">
                <Badge variant="secondary" className="text-xs">
                  {t.current}
                  {themeColors.find((c) => c.value === currentThemeColor)?.name}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>

      {/* Language Selector */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-center gap-2 bg-transparent w-full sm:w-auto"
          >
            <Languages className="w-4 h-4" />
            <span className="flex items-center gap-1">
              {currentLangData?.flag} {currentLangData?.name}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48" align="end">
          <div className="space-y-2">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                variant={currentLanguage === lang.code ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => handleLanguageChange(lang.code as "en" | "ar")}
              >
                <span className="flex items-center gap-2">
                  {lang.flag} {lang.name}
                  {lang.direction === "rtl" && (
                    <Badge variant="outline" className="text-xs">
                      RTL
                    </Badge>
                  )}
                </span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear Data Button */}
      <Button
        variant="outline"
        size="sm"
        className="flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:border-red-300 bg-transparent w-full sm:w-auto"
        onClick={handleClearData}
        disabled={isClearing}
      >
        {isClearing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
            {t.clearing}
          </>
        ) : (
          <>
            <Trash2 className="w-4 h-4" />
            {t.clearData}
          </>
        )}
      </Button>
    </div>
  );
}
