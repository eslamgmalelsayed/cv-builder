"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useAlertModal } from "@/components/ui/alert-modal";

// Translations for PDF export button
const translations = {
  en: {
    downloadPdf: "Download PDF",
    generatingPdf: "Generating PDF...",
  },
  ar: {
    downloadPdf: "تحميل PDF",
    generatingPdf: "جاري إنشاء PDF...",
  },
};

interface PDFExportButtonProps {
  cvData: any;
  language?: "en" | "ar";
  direction?: "ltr" | "rtl";
  themeColor?: string;
  sectionOrder?: string[];
  visibleSections?: Record<string, boolean>;
  sectionNames?: Record<string, string>;
}

export function PDFExportButton({
  cvData,
  language = "en",
  direction = "ltr",
  themeColor = "theme-black",
  sectionOrder,
  visibleSections,
  sectionNames,
}: PDFExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { showAlert } = useAlertModal();
  const t = translations[language];

  const generatePDF = async () => {
    try {
      setIsGenerating(true);

      // Build the download filename as "FullName_JobTitle". The job title comes
      // from the headline title, falling back to the most recent experience
      // entry, and finally a localized "Resume" label so a title is always part
      // of the name.
      const clean = (value: string) =>
        value
          .trim()
          .replace(/[\\/:*?"<>|]+/g, "") // strip filesystem-unsafe chars
          .replace(/\s+/g, "_")
          .replace(/_+/g, "_")
          .replace(/^_|_$/g, "");

      const fullName = clean(cvData?.personalInfo?.fullName || "") || "Unknown";

      const experienceTitle = Array.isArray(cvData?.experience)
        ? cvData.experience.find((e: any) => e?.jobTitle?.trim())?.jobTitle
        : "";
      const rawJobTitle =
        cvData?.personalInfo?.title?.trim() ||
        experienceTitle?.trim() ||
        (language === "ar" ? "السيرة الذاتية" : "Resume");
      const jobTitle = clean(rawJobTitle);

      const dynamicFileName = `${fullName}_${jobTitle}`;

      // Send the CV data as JSON. The server builds a clean, self-contained
      // document from the shared template — deterministic, faithful to the
      // preview, and far lighter than scraping the live DOM + all stylesheets.
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvData,
          fileName: `${dynamicFileName}.pdf`,
          sectionOrder,
          visibleSections,
          sectionNames,
          language,
          direction,
          themeColor,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${dynamicFileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      showAlert(
        "Success",
        "PDF has been generated and downloaded successfully!"
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      showAlert("Error", "Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={generatePDF}
      disabled={isGenerating}
      className="flex w-full items-center justify-center gap-2 sm:w-auto"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {t.generatingPdf}
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          {t.downloadPdf}
        </>
      )}
    </Button>
  );
}
