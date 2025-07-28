"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useAlertModal } from "@/components/ui/alert-modal";
import type { CVData } from "./cv-builder";

interface PDFExportButtonProps {
  cvData: CVData;
  sectionOrder: string[];
  visibleSections: Record<string, boolean>;
  sectionNames?: Record<string, string>;
  language?: "en" | "ar";
}

const translations = {
  en: {
    exportPDF: "Export PDF",
    generating: "Generating...",
  },
  ar: {
    exportPDF: "تصدير PDF",
    generating: "جاري الإنشاء...",
  },
};

const defaultSectionLabels = {
  en: {
    personalInfo: "Personal Information",
    experience: "Work Experience",
    education: "Education",
    skills: "Skills & Qualifications",
  },
  ar: {
    personalInfo: "المعلومات الشخصية",
    experience: "الخبرة العملية",
    education: "التعليم",
    skills: "المهارات والمؤهلات",
  },
};

export function PDFExportButton({
  cvData,
  sectionOrder,
  visibleSections,
  sectionNames = {},
  language = "en",
}: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [currentThemeColor, setCurrentThemeColor] = useState("#000000");
  const { showAlert, AlertModalComponent } = useAlertModal();

  const t = translations[language];
  const labels = defaultSectionLabels[language];

  useEffect(() => {
    // Get the current theme color from CSS variables
    const getThemeColor = () => {
      const root = document.documentElement;
      const primaryColor = getComputedStyle(root)
        .getPropertyValue("--primary")
        .trim();

      // Convert HSL to RGB for jsPDF
      if (primaryColor) {
        const hslMatch = primaryColor.match(
          /(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/
        );
        if (hslMatch) {
          const h = Number.parseFloat(hslMatch[1]) / 360;
          const s = Number.parseFloat(hslMatch[2]) / 100;
          const l = Number.parseFloat(hslMatch[3]) / 100;

          const hslToRgb = (h: number, s: number, l: number) => {
            let r, g, b;
            if (s === 0) {
              r = g = b = l;
            } else {
              const hue2rgb = (p: number, q: number, t: number) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
              };
              const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
              const p = 2 * l - q;
              r = hue2rgb(p, q, h + 1 / 3);
              g = hue2rgb(p, q, h);
              b = hue2rgb(p, q, h - 1 / 3);
            }
            return [
              Math.round(r * 255),
              Math.round(g * 255),
              Math.round(b * 255),
            ];
          };

          const [r, g, b] = hslToRgb(h, s, l);
          return `rgb(${r}, ${g}, ${b})`;
        }
      }
      return "#000000"; // fallback
    };

    setCurrentThemeColor(getThemeColor());
  }, []);

  const getSectionLabel = (section: string) => {
    return (
      sectionNames[section] || labels[section as keyof typeof labels] || section
    );
  };

  const handleExportPDF = async () => {
    setIsExporting(true);

    try {
      const { jsPDF } = await import("jspdf");

      // Use A4 size for better professional look
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Page dimensions
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let yPosition = margin;

      // Get current theme color
      const themeColorRgb = currentThemeColor.match(
        /rgb\((\d+),\s*(\d+),\s*(\d+)\)/
      );
      let themeR = 33,
        themeG = 150,
        themeB = 243; // Default blue
      if (themeColorRgb) {
        themeR = Number.parseInt(themeColorRgb[1]);
        themeG = Number.parseInt(themeColorRgb[2]);
        themeB = Number.parseInt(themeColorRgb[3]);
      }

      // Helper function to check if we need a new page
      const checkNewPage = (additionalHeight = 10) => {
        if (yPosition + additionalHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Helper function to add text with better formatting
      const addText = (
        text: string,
        x = margin,
        fontSize = 10,
        style = "normal",
        color: "theme" | "black" | "gray" = "black",
        maxWidth = contentWidth
      ) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", style as any);

        // Set color
        switch (color) {
          case "theme":
            doc.setTextColor(themeR, themeG, themeB);
            break;
          case "gray":
            doc.setTextColor(100, 100, 100);
            break;
          default:
            doc.setTextColor(0, 0, 0);
        }

        const lines = doc.splitTextToSize(text, maxWidth);
        const lineHeight = fontSize * 0.35; // Better line spacing

        // Check if we need a new page for all lines
        checkNewPage(lines.length * lineHeight + 2);

        lines.forEach((line: string) => {
          doc.text(line, x, yPosition);
          yPosition += lineHeight;
        });

        return lines.length * lineHeight;
      };

      // Helper function to add section header with professional styling
      const addSectionHeader = (title: string) => {
        checkNewPage(15);
        yPosition += 8;

        // Add horizontal line above section
        doc.setDrawColor(themeR, themeG, themeB);
        doc.setLineWidth(0.8);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 6;

        // Section title
        addText(title.toUpperCase(), margin, 12, "bold", "theme");
        yPosition += 4;
      };

      // Header Section
      const nameText =
        cvData.personalInfo.fullName ||
        (language === "ar" ? "اسمك" : "Your Name");

      // Name with larger font
      addText(nameText, margin, 24, "bold", "theme");
      yPosition += 2;

      // Contact information in a more organized way
      const contactInfo = [];
      if (cvData.personalInfo.email)
        contactInfo.push(cvData.personalInfo.email);
      if (cvData.personalInfo.phone)
        contactInfo.push(cvData.personalInfo.phone);
      if (cvData.personalInfo.location)
        contactInfo.push(cvData.personalInfo.location);
      if (cvData.personalInfo.linkedIn)
        contactInfo.push(cvData.personalInfo.linkedIn);
      if (cvData.personalInfo.website)
        contactInfo.push(cvData.personalInfo.website);
      if (cvData.personalInfo.github)
        contactInfo.push(cvData.personalInfo.github);

      if (contactInfo.length > 0) {
        // Split contact info into multiple lines if too long
        const contactLine1 = contactInfo
          .slice(0, Math.ceil(contactInfo.length / 2))
          .join(" | ");
        const contactLine2 = contactInfo
          .slice(Math.ceil(contactInfo.length / 2))
          .join(" | ");

        addText(contactLine1, margin, 10, "normal", "gray");
        if (contactLine2) {
          addText(contactLine2, margin, 10, "normal", "gray");
        }
      }

      // Main separator line
      yPosition += 6;
      doc.setDrawColor(themeR, themeG, themeB);
      doc.setLineWidth(1.5);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;

      // Professional Summary
      if (cvData.personalInfo.summary && visibleSections.personalInfo) {
        const summaryTitle =
          language === "ar" ? "الملخص المهني" : "PROFESSIONAL SUMMARY";
        addSectionHeader(summaryTitle);
        addText(cvData.personalInfo.summary, margin, 10, "normal", "black");
        yPosition += 6;
      }

      // Format date helper
      const formatDate = (dateString: string) => {
        if (!dateString) return "";

        let date: Date;
        if (dateString.includes("-") && dateString.split("-").length === 3) {
          date = new Date(dateString);
        } else if (
          dateString.includes("-") &&
          dateString.split("-").length === 2
        ) {
          date = new Date(dateString + "-01");
        } else {
          return dateString;
        }

        if (isNaN(date.getTime())) {
          return dateString;
        }

        if (language === "ar") {
          return date.toLocaleDateString("ar-SA", {
            month: "long",
            year: "numeric",
          });
        }
        return date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
      };

      // Render sections based on order
      sectionOrder
        .filter((section) => visibleSections[section])
        .forEach((sectionKey) => {
          switch (sectionKey) {
            case "experience":
              if (cvData.experience.length > 0) {
                addSectionHeader(getSectionLabel("experience"));

                cvData.experience.forEach((exp, index) => {
                  if (index > 0) yPosition += 6;

                  // Job title in theme color
                  addText(exp.jobTitle || "", margin, 12, "bold", "theme");

                  // Company name
                  if (exp.company) {
                    addText(exp.company, margin, 11, "bold", "black");
                  }

                  // Date range and location on same line
                  const presentText =
                    language === "ar" ? "حتى الآن" : "Present";
                  const dateRange = `${formatDate(exp.startDate)} - ${
                    exp.current ? presentText : formatDate(exp.endDate)
                  }`;

                  let locationAndDate = dateRange;
                  if (exp.location) {
                    locationAndDate += ` | ${exp.location}`;
                  }

                  addText(locationAndDate, margin, 9, "normal", "gray");
                  yPosition += 2;

                  // Description with bullet point formatting
                  if (exp.description) {
                    const lines = exp.description
                      .split("\n")
                      .filter((line) => line.trim());
                    lines.forEach((line) => {
                      const trimmedLine = line.trim();
                      if (
                        trimmedLine.startsWith("•") ||
                        trimmedLine.startsWith("-")
                      ) {
                        // Bullet point with hanging indent
                        addText("•", margin, 10, "normal", "black", 5);
                        const bulletY = yPosition - 3.5; // Adjust for bullet position
                        yPosition -= 3.5; // Reset position for content
                        addText(
                          trimmedLine.replace(/^[•-]\s*/, ""),
                          margin + 5,
                          10,
                          "normal",
                          "black",
                          contentWidth - 5
                        );
                      } else if (trimmedLine) {
                        addText(trimmedLine, margin, 10, "normal", "black");
                      }
                    });
                  }
                  yPosition += 4;
                });
              }
              break;

            case "education":
              if (cvData.education.length > 0) {
                addSectionHeader(getSectionLabel("education"));

                cvData.education.forEach((edu, index) => {
                  if (index > 0) yPosition += 6;

                  // Degree in theme color
                  addText(edu.degree || "", margin, 12, "bold", "theme");

                  // Institution
                  if (edu.institution) {
                    addText(edu.institution, margin, 11, "bold", "black");
                  }

                  // Date, location, and GPA
                  const details = [];
                  if (edu.graduationDate)
                    details.push(formatDate(edu.graduationDate));
                  if (edu.location) details.push(edu.location);
                  if (edu.gpa) {
                    const gpaLabel = language === "ar" ? "المعدل: " : "GPA: ";
                    details.push(`${gpaLabel}${edu.gpa}`);
                  }

                  if (details.length > 0) {
                    addText(details.join(" | "), margin, 9, "normal", "gray");
                  }
                  yPosition += 4;
                });
              }
              break;

            case "skills":
              let hasSkills = false;

              if (cvData.skills.technical.length > 0) {
                if (!hasSkills) addSectionHeader(getSectionLabel("skills"));
                hasSkills = true;

                const techLabel =
                  language === "ar" ? "المهارات التقنية" : "TECHNICAL SKILLS";
                addText(techLabel, margin, 11, "bold", "theme");

                // Format technical skills in a clean way
                const techSkillsText = cvData.skills.technical
                  .map((skill) => `• ${skill}`)
                  .join("  ");
                addText(techSkillsText, margin, 10, "normal", "black");
                yPosition += 4;
              }

              if (cvData.skills.soft.length > 0) {
                if (!hasSkills) addSectionHeader(getSectionLabel("skills"));
                hasSkills = true;

                const softLabel =
                  language === "ar" ? "الكفاءات الأساسية" : "CORE COMPETENCIES";
                addText(softLabel, margin, 11, "bold", "theme");

                const softSkillsText = cvData.skills.soft
                  .map((skill) => `• ${skill}`)
                  .join("  ");
                addText(softSkillsText, margin, 10, "normal", "black");
                yPosition += 4;
              }

              if (cvData.skills.languages.length > 0) {
                if (!hasSkills) addSectionHeader(getSectionLabel("skills"));
                hasSkills = true;

                const langLabel = language === "ar" ? "اللغات" : "LANGUAGES";
                addText(langLabel, margin, 11, "bold", "theme");

                const languageText = cvData.skills.languages
                  .map((lang) => `• ${lang}`)
                  .join("  ");
                addText(languageText, margin, 10, "normal", "black");
                yPosition += 4;
              }

              if (cvData.skills.certifications.length > 0) {
                if (!hasSkills) addSectionHeader(getSectionLabel("skills"));
                hasSkills = true;

                const certLabel =
                  language === "ar" ? "الشهادات" : "CERTIFICATIONS";
                addText(certLabel, margin, 11, "bold", "theme");

                cvData.skills.certifications.forEach((cert) => {
                  const certText = `• ${cert}`;
                  addText(certText, margin, 10, "normal", "black");
                });
                yPosition += 4;
              }
              break;

            default:
              // Handle custom sections
              if (sectionKey.startsWith("custom-")) {
                const customId = sectionKey.replace("custom-", "");
                const customSection = cvData.customSections.find(
                  (s) => s.id === customId
                );
                if (customSection) {
                  addSectionHeader(customSection.title);

                  // Process custom section content with bullet points
                  const lines = customSection.content
                    .split("\n")
                    .filter((line) => line.trim());
                  lines.forEach((line) => {
                    const trimmedLine = line.trim();
                    if (
                      trimmedLine.startsWith("•") ||
                      trimmedLine.startsWith("-")
                    ) {
                      // Bullet point with hanging indent
                      addText("•", margin, 10, "normal", "black", 5);
                      const bulletY = yPosition - 3.5;
                      yPosition -= 3.5;
                      addText(
                        trimmedLine.replace(/^[•-]\s*/, ""),
                        margin + 5,
                        10,
                        "normal",
                        "black",
                        contentWidth - 5
                      );
                    } else if (trimmedLine) {
                      addText(trimmedLine, margin, 10, "normal", "black");
                    }
                  });
                  yPosition += 4;
                }
              }
              break;
          }
        });

      // Generate filename
      const name = cvData.personalInfo.fullName || "CV";
      const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, "_");
      const filename = `${sanitizedName}_CV.pdf`;

      // Save the PDF
      doc.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      showAlert(
        "Error",
        language === "ar"
          ? "حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى."
          : "An error occurred while generating the PDF. Please try again."
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="flex items-center justify-center gap-2 bg-transparent w-full sm:w-auto"
        onClick={handleExportPDF}
        disabled={isExporting}
      >
        {isExporting ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {t.generating}
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            {t.exportPDF}
          </>
        )}
      </Button>
      <AlertModalComponent />
    </>
  );
}
