"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useAlertModal } from "@/components/ui/alert-modal";

interface PDFExportButtonProps {
  cvData: any;
}

export function PDFExportButton({ cvData }: PDFExportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { showAlert } = useAlertModal();

  const generatePDF = async () => {
    try {
      setIsGenerating(true);

      // Create dynamic filename from CV data
      const fullName = cvData?.personalInfo?.fullName || "Unknown";
      const title = cvData?.personalInfo?.title || "";

      // Use personal title first, then fall back to most recent job title
      let jobTitle = title;
      if (!jobTitle && cvData?.experience && cvData.experience.length > 0) {
        // Use the first experience entry as the most recent job title
        jobTitle = cvData.experience[0]?.jobTitle || "";
      }

      // Default to "CV" if no title is available
      if (!jobTitle) {
        jobTitle = "CV";
      }

      const dynamicFileName = `${fullName.replace(
        /\s+/g,
        "_"
      )}_${jobTitle.replace(/\s+/g, "_")}`;

      // Get the CV preview element
      const cvPreviewElement = document.querySelector(
        ".cv-preview"
      ) as HTMLElement;
      if (!cvPreviewElement) {
        throw new Error("CV preview element not found");
      }

      // Get all stylesheets
      const styleSheets = Array.from(document.styleSheets);
      let allStyles = "";

      styleSheets.forEach((styleSheet) => {
        try {
          if (styleSheet.cssRules) {
            Array.from(styleSheet.cssRules).forEach((rule) => {
              allStyles += rule.cssText + "\n";
            });
          }
        } catch (e) {
          // Handle CORS issues with external stylesheets
          console.warn("Could not access stylesheet:", e);
        }
      });

      // Create complete HTML with embedded styles
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              ${allStyles}
              body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
              .cv-preview { max-width: none; margin: 0; padding: 0 !important; }
              
              /* Reduce internal padding for PDF */
              .cv-preview .p-8 { padding: 1rem !important; }
              .cv-preview .px-8 { padding-left: 1rem !important; padding-right: 1rem !important; }
              .cv-preview .py-8 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
              
              /* PDF-specific page break styles */
              .cv-section { 
                page-break-inside: avoid; 
                break-inside: avoid;
                margin-bottom: 1rem;
              }
              
              .cv-section-header {
                page-break-after: avoid;
                break-after: avoid;
              }
              
              .cv-item {
                page-break-inside: avoid;
                break-inside: avoid;
                margin-bottom: 0.75rem;
              }
              
              /* Ensure sections start fresh if needed */
              .cv-section:not(:first-child) {
                page-break-before: auto;
                break-before: auto;
              }
              
              /* Prevent orphaned headers */
              h1, h2, h3 {
                page-break-after: avoid;
                break-after: avoid;
              }
              
              /* Keep list items together when possible */
              li {
                page-break-inside: avoid;
                break-inside: avoid;
              }
              
              @media print {
                body { margin: 0; padding: 0; }
                .cv-preview { box-shadow: none; }
                
                /* Additional print-specific rules */
                .cv-section { 
                  page-break-inside: avoid; 
                  margin-bottom: 1.5rem;
                }
                
                .cv-section-header {
                  page-break-after: avoid;
                }
                
                .cv-item {
                  page-break-inside: avoid;
                  margin-bottom: 1rem;
                }
              }
            </style>
          </head>
          <body>
            ${cvPreviewElement.outerHTML}
          </body>
        </html>
      `;

      // Send to server-side PDF generation
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          html,
          fileName: `${dynamicFileName}.pdf`,
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
      variant="outline"
      className="w-full sm:w-auto bg-white hover:bg-gray-50 active:bg-gray-100 focus:bg-gray-50 border-gray-300"
    >
      {isGenerating ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </>
      )}
    </Button>
  );
}
