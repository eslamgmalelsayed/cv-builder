import { useState, useEffect } from "react";
import { getTranslations, type AppTranslations } from "@/lib/content";
import { useLanguage } from "@/components/shared-header";

export function useContent() {
  const { currentLanguage } = useLanguage();
  const [content, setContent] = useState<AppTranslations>(() =>
    getTranslations(currentLanguage || "ar")
  );

  useEffect(() => {
    if (currentLanguage) {
      setContent(getTranslations(currentLanguage));
    }
  }, [currentLanguage]);

  return content;
}
