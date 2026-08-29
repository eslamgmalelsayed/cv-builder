"use client";

import { useLanguage } from "@/components/shared-header";
import { useEffect } from "react";

interface BodyWrapperProps {
  children: React.ReactNode;
  interClassName: string;
  interVariable: string;
  cairoVariable: string;
}

export function BodyWrapper({
  children,
  interClassName,
  interVariable,
  cairoVariable,
}: BodyWrapperProps) {
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;

    // Set direction and language attributes
    html.setAttribute("dir", currentLanguage === "ar" ? "rtl" : "ltr");
    html.setAttribute("lang", currentLanguage === "ar" ? "ar" : "en");

    // Always keep BOTH font CSS variables defined on the body so that
    // var(--font-inter)/var(--font-cairo) resolve regardless of language
    // (e.g. .ltr-content inside Arabic pages). Only the active marker class
    // changes which family is the default.
    const base = `${interClassName} ${interVariable} ${cairoVariable}`;
    body.className =
      currentLanguage === "ar" ? `${base} cairo-font` : `${base} font-inter`;
  }, [currentLanguage, interClassName, interVariable, cairoVariable]);

  return <>{children}</>;
}
