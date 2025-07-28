"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { CVData } from "./cv-builder";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Edit2,
  Trash2,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CVPreviewProps {
  data: CVData;
  sectionOrder?: string[];
  visibleSections?: Record<string, boolean>;
  sectionNames?: Record<string, string>;
  direction?: "ltr" | "rtl";
  language?: "en" | "ar";
  onEditCustomSection?: (sectionId: string) => void;
  onDeleteCustomSection?: (sectionId: string) => void;
  isPreviewMode?: boolean;
}

const defaultSectionLabels = {
  en: {
    personalInfo: "Personal Information",
    experience: "Work Experience",
    education: "Education",
    skills: "Skills & Qualifications",
    professionalSummary: "PROFESSIONAL SUMMARY",
    technicalSkills: "TECHNICAL SKILLS",
    coreCompetencies: "CORE COMPETENCIES",
    languages: "LANGUAGES",
    certifications: "CERTIFICATIONS",
  },
  ar: {
    personalInfo: "المعلومات الشخصية",
    experience: "الخبرة العملية",
    education: "التعليم",
    skills: "المهارات والمؤهلات",
    professionalSummary: "الملخص المهني",
    technicalSkills: "المهارات التقنية",
    coreCompetencies: "الكفاءات الأساسية",
    languages: "اللغات",
    certifications: "الشهادات",
  },
};

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
  onEditCustomSection,
  onDeleteCustomSection,
  isPreviewMode = false,
}: CVPreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    // Handle both YYYY-MM-DD and YYYY-MM formats
    let date: Date;
    if (dateString.includes("-") && dateString.split("-").length === 3) {
      // Full date format YYYY-MM-DD
      date = new Date(dateString);
    } else if (dateString.includes("-") && dateString.split("-").length === 2) {
      // Month format YYYY-MM
      date = new Date(dateString + "-01");
    } else {
      return dateString; // Return as-is if format is unexpected
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString;
    }

    // Format based on language
    if (language === "ar") {
      return date.toLocaleDateString("ar-SA", {
        month: "long",
        year: "numeric",
      });
    }
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getSectionLabel = (section: string) => {
    // Handle custom sections
    if (section.startsWith("custom-")) {
      const customId = section.replace("custom-", "");
      const customSection = data.customSections.find((s) => s.id === customId);
      return customSection?.title || section;
    }

    // Handle default sections
    return (
      sectionNames[section] ||
      defaultSectionLabels[language][
        section as keyof typeof defaultSectionLabels.en
      ] ||
      section
    );
  };

  const labels = defaultSectionLabels[language];

  return (
    <Card className="w-full max-w-4xl">
      <CardContent className="p-8 bg-white cv-preview" dir={direction}>
        {/* Header */}
        <div className="border-b-2 border-primary pb-6 mb-6">
          <h1 className="text-3xl font-bold text-primary mb-1">
            {data.personalInfo.fullName ||
              (language === "ar" ? "اسمك" : "Your Name")}
          </h1>
          {data.personalInfo.title && data.personalInfo.title.trim() && (
            <h2 className="text-xl font-medium text-gray-700 mb-3">
              {data.personalInfo.title}
            </h2>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 justify-start">
            {data.personalInfo.email && (
              <a
                href={`mailto:${data.personalInfo.email}`}
                className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4 text-primary" />
                <span className="ltr-content">{data.personalInfo.email}</span>
              </a>
            )}
            {data.personalInfo.phone && (
              <a
                href={`tel:${data.personalInfo.phone}`}
                className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4 text-primary" />
                <span className="ltr-content">{data.personalInfo.phone}</span>
              </a>
            )}
            {data.personalInfo.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-primary" />
                {data.personalInfo.location}
              </div>
            )}
            {data.personalInfo.linkedIn && (
              <a
                href={
                  data.personalInfo.linkedIn.startsWith("http")
                    ? data.personalInfo.linkedIn
                    : `https://linkedin.com/in/${data.personalInfo.linkedIn}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
              >
                <Linkedin className="w-4 h-4 text-primary" />
                <span className="ltr-content">
                  {data.personalInfo.linkedIn}
                </span>
              </a>
            )}
            {data.personalInfo.website && (
              <a
                href={
                  data.personalInfo.website.startsWith("http")
                    ? data.personalInfo.website
                    : `https://${data.personalInfo.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
              >
                <Globe className="w-4 h-4 text-primary" />
                <span className="ltr-content">{data.personalInfo.website}</span>
              </a>
            )}
            {data.personalInfo.github && (
              <a
                href={
                  data.personalInfo.github.startsWith("http")
                    ? data.personalInfo.github
                    : `https://${data.personalInfo.github}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
              >
                <Github className="w-4 h-4 text-primary" />
                <span className="ltr-content">{data.personalInfo.github}</span>
              </a>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {data.personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-primary mb-3 border-b border-primary/30 pb-1">
              {labels.professionalSummary}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {data.personalInfo.summary}
            </p>
          </div>
        )}

        {/* Dynamic Sections Based on Order */}
        {sectionOrder
          .filter((sectionKey) => visibleSections[sectionKey])
          .map((sectionKey) => {
            // Handle custom sections
            if (sectionKey.startsWith("custom-")) {
              const customId = sectionKey.replace("custom-", "");
              const customSection = data.customSections.find(
                (s) => s.id === customId
              );

              if (!customSection) return null;

              return (
                <div key={sectionKey} className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-primary border-b border-primary/30 pb-1 flex-1">
                      {customSection.title.toUpperCase()}
                    </h2>
                    {!isPreviewMode &&
                      (onEditCustomSection || onDeleteCustomSection) && (
                        <div className="flex gap-2 ml-4">
                          {onEditCustomSection && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                onEditCustomSection(customSection.id)
                              }
                              className="h-8 w-8 p-0 hover:bg-primary/10"
                            >
                              <Edit2 className="h-4 w-4 text-primary" />
                            </Button>
                          )}
                          {onDeleteCustomSection && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                onDeleteCustomSection(customSection.id)
                              }
                              className="h-8 w-8 p-0 hover:bg-red-100"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      )}
                  </div>

                  {customSection.type === "text" && (
                    <div className="text-gray-700 text-sm leading-relaxed">
                      <ul className="list-disc list-outside space-y-1 hanging-indent-bullet">
                        {customSection.content
                          .split("\n")
                          .filter((line) => line.trim())
                          .map((line, index) => (
                            <li key={index}>{line.trim()}</li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {(customSection.type === "list" ||
                    customSection.type === "timeline") && (
                    <div className="space-y-4">
                      {customSection.items?.map((item) => (
                        <div key={item.id}>
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h3 className="font-bold text-primary">
                                {item.title}
                              </h3>
                              {item.subtitle && (
                                <p className="text-gray-700 font-medium">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                            {item.date && (
                              <div className="text-sm text-gray-600">
                                <p className="font-medium">{item.date}</p>
                              </div>
                            )}
                          </div>
                          {item.description && (
                            <div className="text-gray-700 text-sm leading-relaxed">
                              <ul className="list-disc list-outside space-y-1 hanging-indent-bullet">
                                {item.description
                                  .split("\n")
                                  .filter((line) => line.trim())
                                  .map((line, index) => (
                                    <li key={index}>{line.trim()}</li>
                                  ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // Handle default sections
            switch (sectionKey) {
              case "experience":
                return data.experience.length > 0 ? (
                  <div key="experience" className="mb-6">
                    <h2 className="text-xl font-bold text-primary mb-3 border-b border-primary/30 pb-1">
                      {getSectionLabel("experience").toUpperCase()}
                    </h2>
                    <div className="space-y-4">
                      {data.experience.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h3 className="font-bold text-primary">
                                {exp.jobTitle}
                              </h3>
                              <p className="text-gray-700 font-medium">
                                {exp.company}
                              </p>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p className="font-medium">
                                {formatDate(exp.startDate)} -{" "}
                                {exp.current
                                  ? language === "ar"
                                    ? "حتى الآن"
                                    : "Present"
                                  : formatDate(exp.endDate)}
                              </p>
                              {exp.location && <p>{exp.location}</p>}
                            </div>
                          </div>
                          {exp.description && (
                            <div className="text-gray-700 text-sm leading-relaxed">
                              <ul className="list-disc list-outside space-y-1 hanging-indent-bullet">
                                {exp.description
                                  .split("\n")
                                  .filter((line) => line.trim())
                                  .map((line, index) => (
                                    <li key={index}>{line.trim()}</li>
                                  ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;

              case "education":
                return data.education.length > 0 ? (
                  <div key="education" className="mb-6">
                    <h2 className="text-xl font-bold text-primary mb-3 border-b border-primary/30 pb-1">
                      {getSectionLabel("education").toUpperCase()}
                    </h2>
                    <div className="space-y-3">
                      {data.education.map((edu) => (
                        <div
                          key={edu.id}
                          className="flex justify-between items-start"
                        >
                          <div>
                            <h3 className="font-bold text-primary">
                              {edu.degree}
                            </h3>
                            <p className="text-gray-700 font-medium">
                              {edu.institution}
                            </p>
                            {edu.location && (
                              <p className="text-sm text-gray-600">
                                {edu.location}
                              </p>
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            {edu.graduationDate && (
                              <p className="font-medium">
                                {formatDate(edu.graduationDate)}
                              </p>
                            )}
                            {edu.gpa && (
                              <p>
                                {language === "ar" ? "المعدل: " : "GPA: "}
                                {edu.gpa}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;

              case "skills":
                return (
                  <div key="skills" className="space-y-4">
                    {data.skills.technical.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-primary mb-2 border-b border-primary/30 pb-1">
                          {labels.technicalSkills}
                        </h2>
                        <p className="text-gray-700">
                          {data.skills.technical.join(", ")}
                        </p>
                      </div>
                    )}

                    {data.skills.soft.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-primary mb-2 border-b border-primary/30 pb-1">
                          {labels.coreCompetencies}
                        </h2>
                        <div className="text-gray-700">
                          <ul className="list-disc list-outside space-y-1 hanging-indent-bullet">
                            {data.skills.soft.map((skill, index) => (
                              <li key={index}>{skill}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {data.skills.languages.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-primary mb-2 border-b border-primary/30 pb-1">
                          {labels.languages}
                        </h2>
                        <p className="text-gray-700">
                          {data.skills.languages.join(", ")}
                        </p>
                      </div>
                    )}

                    {data.skills.certifications.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-primary mb-2 border-b border-primary/30 pb-1">
                          {labels.certifications}
                        </h2>
                        <p className="text-gray-700">
                          {data.skills.certifications.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                );

              default:
                return null;
            }
          })}
      </CardContent>
    </Card>
  );
}
