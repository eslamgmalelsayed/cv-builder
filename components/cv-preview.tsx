"use client";

import { useMemo } from "react";
import type { CVData } from "./cv-builder";
import {
  buildCVBody,
  buildCVStyles,
  type CVTemplateData,
} from "@/lib/cv-template";

interface CVPreviewProps {
  data: CVData;
  sectionOrder?: string[];
  visibleSections?: Record<string, boolean>;
  sectionNames?: Record<string, string>;
  direction?: "ltr" | "rtl";
  language?: "en" | "ar";
  themeColor?: string;
  onEditCustomSection?: (sectionId: string) => void;
  onDeleteCustomSection?: (sectionId: string) => void;
  isPreviewMode?: boolean;
}

/**
 * The live preview renders from the exact same template used to generate the
 * PDF (lib/cv-template). This guarantees the on-screen preview and the exported
 * PDF are pixel-identical — there is a single source of truth for CV markup.
 */
export function CVPreview({
  data,
  sectionOrder = ["personalInfo", "experience", "education", "skills"],
  visibleSections = {
    personalInfo: true,
    experience: true,
    education: true,
    skills: true,
  },
  sectionNames = {},
  direction = "ltr",
  language = "en",
  themeColor = "theme-black",
}: CVPreviewProps) {
  const styles = useMemo(() => buildCVStyles(themeColor), [themeColor]);

  const body = useMemo(
    () =>
      buildCVBody(data as CVTemplateData, {
        sectionOrder,
        visibleSections,
        sectionNames,
        language,
        direction,
        themeColor,
      }),
    [data, sectionOrder, visibleSections, sectionNames, language, direction, themeColor]
  );

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div
        className="cv-preview-surface"
        dangerouslySetInnerHTML={{ __html: body }}
      />
    </div>
  );
}
