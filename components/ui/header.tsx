"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage } from "@/components/shared-header";
import { getTranslations } from "@/lib/content";

interface HeaderProps {
  currentLanguage?: string;
  onLanguageChange?: (language: { code: string }) => void;
  showLanguageSwitcher?: boolean;
}

export function Header({
  currentLanguage,
  onLanguageChange,
  showLanguageSwitcher = true,
}: HeaderProps) {
  const pathname = usePathname();
  const { currentLanguage: contextLanguage } = useLanguage();
  const t = getTranslations(contextLanguage);

  // Use the language from context or fallback to currentLanguage prop
  const activeLanguage = contextLanguage || currentLanguage || "ar";

  return (
    <nav className="border-b sticky top-0 z-40 backdrop-blur-md bg-background/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="grid grid-cols-3 items-center gap-4">
          {/* Left: Logo */}
          <div className="flex items-center justify-start">
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3"
              prefetch
            >
              <Image
                src="/logo.webp"
                alt="CVIFI Logo"
                width={50}
                height={25}
                className="h-6 sm:h-8 md:h-10 lg:h-12 w-auto"
                priority
              />
              <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-primary">
                CVIFI
              </span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-4"></div>

          <div className="flex items-center justify-end">
            <Link
              href="/builder"
              className="text-xs sm:text-sm font-medium hover:text-primary transition-colors duration-200 py-2 px-1 sm:px-2"
              prefetch
            >
              <span className="hidden sm:inline">{t.header.buildCV}</span>
              <span className="sm:hidden">
                {activeLanguage === "ar" ? "إنشاء" : "Build"}
              </span>
            </Link>
            <Link
              href="/jobs"
              className={`text-xs sm:text-sm font-medium hover:text-primary transition-colors duration-200 py-2 px-1 sm:px-2 ${
                pathname === "/jobs" ? "text-primary" : ""
              }`}
              prefetch
            >
              {t.header.jobs}
            </Link>
            {showLanguageSwitcher && (
              <LanguageSwitcher
                currentLanguage={activeLanguage}
                onLanguageChange={onLanguageChange}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
