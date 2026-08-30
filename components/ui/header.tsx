"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
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
        {/* Natural flex direction (!flex-row overrides the global RTL
            row-reverse): justify-between puts the logo at the start (left in
            LTR, right in RTL) and the actions at the end, in both directions. */}
        <div className="flex !flex-row items-center justify-between gap-3">
          <Link
            href="/"
            className="flex !flex-row items-center gap-2 sm:gap-2.5 shrink-0"
            prefetch
          >
            <Logo className="h-7 w-7 sm:h-9 sm:w-9" size={36} />
            <span className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              CV<span className="text-primary">IFI</span>
            </span>
          </Link>

          <div className="flex !flex-row items-center gap-1 sm:gap-3">
            <Link
              href="/builder"
              className="whitespace-nowrap text-sm font-medium hover:text-primary transition-colors duration-200 py-2 px-2"
              prefetch
            >
              <span className="hidden sm:inline">{t.header.buildCV}</span>
              <span className="sm:hidden">
                {activeLanguage === "ar" ? "إنشاء" : "Build"}
              </span>
            </Link>
            <Link
              href="/jobs"
              className={`whitespace-nowrap text-sm font-medium hover:text-primary transition-colors duration-200 py-2 px-2 ${
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
