"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "./language-switcher";

interface HeaderProps {
  currentLanguage?: string;
  onLanguageChange?: (language: { code: string }) => void;
  showLanguageSwitcher?: boolean;
}

export function Header({
  currentLanguage = "en",
  onLanguageChange,
  showLanguageSwitcher = true,
}: HeaderProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Language Switcher - Fixed position */}
      {showLanguageSwitcher && onLanguageChange && (
        <div
          className={`fixed top-16 sm:top-4 z-50 language-switcher ${
            currentLanguage === "ar"
              ? "left-2 sm:left-4 ms-4 sm:ms-8"
              : "right-2 sm:right-4 me-4 sm:me-8"
          }`}
        >
          <LanguageSwitcher onLanguageChange={onLanguageChange} />
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
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
            <div
              className={`flex items-center gap-2 sm:gap-4 ${
                currentLanguage === "ar"
                  ? "ml-2 sm:ml-8 lg:ml-16"
                  : "mr-2 sm:mr-8 lg:mr-16"
              }`}
            >
              <Link
                href="/builder"
                className="text-xs sm:text-sm font-medium hover:text-primary transition-colors duration-200 py-2 px-1 sm:px-2"
                prefetch
              >
                <span className="hidden sm:inline">Build CV</span>
                <span className="sm:hidden">Build</span>
              </Link>
              <Link
                href="/jobs"
                className={`text-xs sm:text-sm font-medium hover:text-primary transition-colors duration-200 py-2 px-1 sm:px-2 ${
                  pathname === "/jobs" ? "text-primary" : ""
                }`}
                prefetch
              >
                Jobs
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
