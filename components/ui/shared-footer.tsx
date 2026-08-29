"use client";

import Link from "next/link";
import { useLanguage } from "@/components/shared-header";
import { getTranslations } from "@/lib/content";
import { Logo } from "./logo";

export function SharedFooter() {
  const { currentLanguage } = useLanguage();
  const t = getTranslations(currentLanguage);

  return (
    <footer className="border-t bg-background py-10">
      <div className="mx-auto w-full max-w-7xl flex flex-col items-center gap-5 px-4 sm:px-6 lg:px-8 text-center">
        <Link href="/" className="flex items-center gap-2">
          <Logo className="h-7 w-7" size={28} />
          <span className="text-lg font-bold tracking-tight text-foreground">
            CV<span className="text-primary">IFI</span>
          </span>
        </Link>
        <p className="max-w-md text-sm text-muted-foreground">
          {t.footer.description}
        </p>
        <p className="text-sm text-muted-foreground">{t.footer.copyright}</p>
      </div>
    </footer>
  );
}
