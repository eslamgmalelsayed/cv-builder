"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { Header } from "@/components/ui/header";

// Create a language context
const LanguageContext = createContext<{
  currentLanguage: string;
  handleLanguageChange: (language: { code: string }) => void;
}>({
  currentLanguage: "ar",
  handleLanguageChange: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState("ar");

  useEffect(() => {
    // Check for saved language preference
    const savedLang = localStorage.getItem("preferred-language") || "ar";
    setCurrentLanguage(savedLang);
    updateDocumentLanguage(savedLang);
  }, []);

  const updateDocumentLanguage = (langCode: string) => {
    // Update document attributes
    document.documentElement.setAttribute(
      "dir",
      langCode === "ar" ? "rtl" : "ltr"
    );
    document.documentElement.setAttribute("lang", langCode);

    // Apply RTL/LTR classes
    if (langCode === "ar") {
      document.documentElement.classList.add("cairo-font");
      document.body.classList.add("cairo-font");
    } else {
      document.documentElement.classList.remove("cairo-font");
      document.body.classList.remove("cairo-font");
    }
  };

  const handleLanguageChange = (language: { code: string }) => {
    setCurrentLanguage(language.code);
    localStorage.setItem("preferred-language", language.code);
    updateDocumentLanguage(language.code);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, handleLanguageChange }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function SharedHeader() {
  const { currentLanguage, handleLanguageChange } = useLanguage();

  return (
    <Header
      currentLanguage={currentLanguage}
      onLanguageChange={handleLanguageChange}
      showLanguageSwitcher={true}
    />
  );
}
