"use client";

import type React from "react";
import { useState, useCallback, useMemo, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import type { CVData } from "./cv-builder";
import { useCVData } from "@/hooks/use-cv-data";

interface SkillsFormProps {
  data: CVData["skills"];
  onChange: (data: CVData["skills"]) => void;
  language?: "en" | "ar";
}

const translations = {
  en: {
    skillsQualifications: "Skills & Qualifications",
    technicalSkills: "Technical Skills",
    technicalPlaceholder: "e.g., JavaScript, Python, React",
    softSkills: "Soft Skills",
    softPlaceholder: "e.g., Leadership, Communication, Problem Solving",
    languages: "Languages",
    languagesPlaceholder: "e.g., English (Native), Spanish (Fluent)",
    certifications: "Certifications",
    certificationsPlaceholder: "e.g., AWS Certified Developer, PMP",
    noSkillsAdded: "No {type} added yet.",
    atsOptimization: "ATS Optimization Tips:",
    tip1: "• Include keywords from the job description",
    tip2: '• Use standard skill names (e.g., "JavaScript" not "JS")',
    tip3: "• List skills in order of proficiency/relevance",
    tip4: "• Include both hard and soft skills",
  },
  ar: {
    skillsQualifications: "المهارات والمؤهلات",
    technicalSkills: "المهارات التقنية",
    technicalPlaceholder: "مثل: JavaScript، Python، React",
    softSkills: "المهارات الشخصية",
    softPlaceholder: "مثل: القيادة، التواصل، حل المشكلات",
    languages: "اللغات",
    languagesPlaceholder: "مثل: العربية (الأم)، الإنجليزية (طلاقة)",
    certifications: "الشهادات",
    certificationsPlaceholder: "مثل: AWS Certified Developer، PMP",
    noSkillsAdded: "لم يتم إضافة أي {type} بعد.",
    atsOptimization: "نصائح تحسين ATS:",
    tip1: "• أدرج الكلمات المفتاحية من وصف الوظيفة",
    tip2: '• استخدم أسماء المهارات المعيارية (مثل "JavaScript" وليس "JS")',
    tip3: "• رتب المهارات حسب الكفاءة/الصلة",
    tip4: "• أدرج المهارات التقنية والشخصية",
  },
};

const skillTypeNames = {
  en: {
    technical: "technical skills",
    soft: "soft skills",
    languages: "languages",
    certifications: "certifications",
  },
  ar: {
    technical: "مهارات تقنية",
    soft: "مهارات شخصية",
    languages: "لغات",
    certifications: "شهادات",
  },
};

// Memoized skill input component to prevent re-renders
const SkillInput = memo(
  ({
    value,
    onChange,
    onBlur,
    onKeyDown,
    placeholder,
  }: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder: string;
  }) => (
    <Input
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className="input-clean"
    />
  )
);

SkillInput.displayName = "SkillInput";

// Individual memoized skill section components
const SkillSectionComponent = memo(
  ({
    title,
    skills,
    newSkill,
    placeholder,
    onInputChange,
    onKeyPress,
    onAddSkill,
    onRemoveSkill,
    onBlur,
    noSkillsMessage,
  }: {
    title: string;
    skills: string[];
    newSkill: string;
    placeholder: string;
    onInputChange: (value: string) => void;
    onKeyPress: (e: React.KeyboardEvent) => void;
    onAddSkill: () => void;
    onRemoveSkill: (index: number) => void;
    onBlur: () => void;
    noSkillsMessage: string;
  }) => (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <SkillInput
            value={newSkill}
            onChange={(e) => onInputChange(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyPress}
            placeholder={placeholder}
          />
          <Button onClick={onAddSkill} size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <Badge
              key={`${skill}-${index}`}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {skill}
              <button
                onClick={() => onRemoveSkill(index)}
                className="ms-1 hover:text-red-500"
                type="button"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>

        {skills.length === 0 && (
          <p className="text-sm text-gray-500">{noSkillsMessage}</p>
        )}
      </CardContent>
    </Card>
  )
);

SkillSectionComponent.displayName = "SkillSectionComponent";

export function SkillsForm({
  data,
  onChange,
  language = "en",
}: SkillsFormProps) {
  const { saveOnBlur } = useCVData();
  const [newSkill, setNewSkill] = useState({
    technical: "",
    soft: "",
    languages: "",
    certifications: "",
  });

  // Ensure skills data is properly formatted as arrays
  const safeData = useMemo(
    () => ({
      technical: Array.isArray(data?.technical) ? data.technical : [],
      soft: Array.isArray(data?.soft) ? data.soft : [],
      languages: Array.isArray(data?.languages) ? data.languages : [],
      certifications: Array.isArray(data?.certifications)
        ? data.certifications
        : [],
    }),
    [data]
  );

  const t = useMemo(() => translations[language], [language]);
  const skillNames = useMemo(() => skillTypeNames[language], [language]);

  const addSkill = useCallback(
    (category: keyof CVData["skills"], skill: string) => {
      if (skill.trim()) {
        onChange({
          ...safeData,
          [category]: [...safeData[category], skill.trim()],
        });
        setNewSkill((prev) => ({ ...prev, [category]: "" }));
      }
    },
    [safeData, onChange]
  );

  const removeSkill = useCallback(
    (category: keyof CVData["skills"], index: number) => {
      onChange({
        ...safeData,
        [category]: safeData[category].filter((_, i) => i !== index),
      });
    },
    [safeData, onChange]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent, category: keyof CVData["skills"]) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addSkill(category, newSkill[category]);
      }
    },
    [addSkill, newSkill]
  );

  const handleInputChange = useCallback(
    (category: keyof CVData["skills"], value: string) => {
      setNewSkill((prev) => ({ ...prev, [category]: value }));
    },
    []
  );

  // Individual handlers for each skill category
  const handleTechnicalInputChange = useCallback(
    (value: string) => handleInputChange("technical", value),
    [handleInputChange]
  );

  const handleSoftInputChange = useCallback(
    (value: string) => handleInputChange("soft", value),
    [handleInputChange]
  );

  const handleLanguagesInputChange = useCallback(
    (value: string) => handleInputChange("languages", value),
    [handleInputChange]
  );

  const handleCertificationsInputChange = useCallback(
    (value: string) => handleInputChange("certifications", value),
    [handleInputChange]
  );

  const handleTechnicalKeyPress = useCallback(
    (e: React.KeyboardEvent) => handleKeyPress(e, "technical"),
    [handleKeyPress]
  );

  const handleSoftKeyPress = useCallback(
    (e: React.KeyboardEvent) => handleKeyPress(e, "soft"),
    [handleKeyPress]
  );

  const handleLanguagesKeyPress = useCallback(
    (e: React.KeyboardEvent) => handleKeyPress(e, "languages"),
    [handleKeyPress]
  );

  const handleCertificationsKeyPress = useCallback(
    (e: React.KeyboardEvent) => handleKeyPress(e, "certifications"),
    [handleKeyPress]
  );

  const handleTechnicalAdd = useCallback(
    () => addSkill("technical", newSkill.technical),
    [addSkill, newSkill.technical]
  );

  const handleSoftAdd = useCallback(
    () => addSkill("soft", newSkill.soft),
    [addSkill, newSkill.soft]
  );

  const handleLanguagesAdd = useCallback(
    () => addSkill("languages", newSkill.languages),
    [addSkill, newSkill.languages]
  );

  const handleCertificationsAdd = useCallback(
    () => addSkill("certifications", newSkill.certifications),
    [addSkill, newSkill.certifications]
  );

  const handleTechnicalRemove = useCallback(
    (index: number) => removeSkill("technical", index),
    [removeSkill]
  );

  const handleSoftRemove = useCallback(
    (index: number) => removeSkill("soft", index),
    [removeSkill]
  );

  const handleLanguagesRemove = useCallback(
    (index: number) => removeSkill("languages", index),
    [removeSkill]
  );

  const handleCertificationsRemove = useCallback(
    (index: number) => removeSkill("certifications", index),
    [removeSkill]
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t.skillsQualifications}</h3>

      <div className="space-y-4">
        <SkillSectionComponent
          title={t.technicalSkills}
          skills={safeData.technical}
          newSkill={newSkill.technical}
          placeholder={t.technicalPlaceholder}
          onInputChange={handleTechnicalInputChange}
          onKeyPress={handleTechnicalKeyPress}
          onAddSkill={handleTechnicalAdd}
          onRemoveSkill={handleTechnicalRemove}
          onBlur={saveOnBlur}
          noSkillsMessage={t.noSkillsAdded.replace(
            "{type}",
            skillNames.technical
          )}
        />

        <SkillSectionComponent
          title={t.softSkills}
          skills={safeData.soft}
          newSkill={newSkill.soft}
          placeholder={t.softPlaceholder}
          onInputChange={handleSoftInputChange}
          onKeyPress={handleSoftKeyPress}
          onAddSkill={handleSoftAdd}
          onRemoveSkill={handleSoftRemove}
          onBlur={saveOnBlur}
          noSkillsMessage={t.noSkillsAdded.replace("{type}", skillNames.soft)}
        />

        <SkillSectionComponent
          title={t.languages}
          skills={safeData.languages}
          newSkill={newSkill.languages}
          placeholder={t.languagesPlaceholder}
          onInputChange={handleLanguagesInputChange}
          onKeyPress={handleLanguagesKeyPress}
          onAddSkill={handleLanguagesAdd}
          onRemoveSkill={handleLanguagesRemove}
          onBlur={saveOnBlur}
          noSkillsMessage={t.noSkillsAdded.replace(
            "{type}",
            skillNames.languages
          )}
        />

        <SkillSectionComponent
          title={t.certifications}
          skills={safeData.certifications}
          newSkill={newSkill.certifications}
          placeholder={t.certificationsPlaceholder}
          onInputChange={handleCertificationsInputChange}
          onKeyPress={handleCertificationsKeyPress}
          onAddSkill={handleCertificationsAdd}
          onRemoveSkill={handleCertificationsRemove}
          onBlur={saveOnBlur}
          noSkillsMessage={t.noSkillsAdded.replace(
            "{type}",
            skillNames.certifications
          )}
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">{t.atsOptimization}</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>{t.tip1}</li>
          <li>{t.tip2}</li>
          <li>{t.tip3}</li>
          <li>{t.tip4}</li>
        </ul>
      </div>
    </div>
  );
}
