"use client";

import type React from "react";
import { useState, useCallback } from "react";
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

  const t = translations[language];
  const skillNames = skillTypeNames[language];

  const addSkill = useCallback(
    (category: keyof CVData["skills"], skill: string) => {
      if (skill.trim()) {
        onChange({
          ...data,
          [category]: [...data[category], skill.trim()],
        });
        setNewSkill((prev) => ({ ...prev, [category]: "" }));
      }
    },
    [data, onChange]
  );

  const removeSkill = useCallback(
    (category: keyof CVData["skills"], index: number) => {
      onChange({
        ...data,
        [category]: data[category].filter((_, i) => i !== index),
      });
    },
    [data, onChange]
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

  const SkillSection = ({
    title,
    category,
    placeholder,
  }: {
    title: string;
    category: keyof CVData["skills"];
    placeholder: string;
  }) => (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input
            value={newSkill[category]}
            onChange={(e) => handleInputChange(category, e.target.value)}
            onBlur={saveOnBlur}
            onKeyDown={(e) => handleKeyPress(e, category)}
            placeholder={placeholder}
            className="input-clean"
          />
          <Button
            onClick={() => addSkill(category, newSkill[category])}
            size="sm"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {data[category].map((skill, index) => (
            <Badge
              key={`${skill}-${index}`}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {skill}
              <button
                onClick={() => removeSkill(category, index)}
                className="ml-1 hover:text-red-500"
                type="button"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>

        {data[category].length === 0 && (
          <p className="text-sm text-gray-500">
            {t.noSkillsAdded.replace("{type}", skillNames[category])}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t.skillsQualifications}</h3>

      <div className="space-y-4">
        <SkillSection
          title={t.technicalSkills}
          category="technical"
          placeholder={t.technicalPlaceholder}
        />

        <SkillSection
          title={t.softSkills}
          category="soft"
          placeholder={t.softPlaceholder}
        />

        <SkillSection
          title={t.languages}
          category="languages"
          placeholder={t.languagesPlaceholder}
        />

        <SkillSection
          title={t.certifications}
          category="certifications"
          placeholder={t.certificationsPlaceholder}
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
