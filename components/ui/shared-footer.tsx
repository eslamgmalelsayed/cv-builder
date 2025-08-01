"use client";

import { useLanguage } from "@/components/shared-header";
import { getTranslations } from "@/lib/content";

export function SharedFooter() {
  const { currentLanguage } = useLanguage();
  const t = getTranslations(currentLanguage);

  return (
    <footer className="bg-background border-t py-6">
      <div className="container mx-auto px-4">
        <p className="text-muted-foreground text-center">
          {t.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
