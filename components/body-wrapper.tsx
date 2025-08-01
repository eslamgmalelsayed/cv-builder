"use client";

import { useLanguage } from "@/components/shared-header";
import { useEffect } from "react";

interface BodyWrapperProps {
  children: React.ReactNode;
  interClassName: string;
  cairoVariable: string;
}

export function BodyWrapper({
  children,
  interClassName,
  cairoVariable,
}: BodyWrapperProps) {
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    // Set direction and language attributes
    html.setAttribute("dir", currentLanguage === "ar" ? "rtl" : "ltr");
    html.setAttribute("lang", currentLanguage === "ar" ? "ar" : "en");

    // Apply appropriate font classes
    if (currentLanguage === "ar") {
      // Arabic: Use Cairo font
      body.className = `${cairoVariable} cairo-font`;
    } else {
      // English: Use Inter font
      body.className = `${interClassName} ${cairoVariable} font-inter`;
    }
  }, [currentLanguage, interClassName, cairoVariable]);

  return <>{children}</>;
}
