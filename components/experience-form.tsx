"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AIInput, AITextarea } from "@/components/ui/ai-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save } from "lucide-react";
import type { CVData } from "./cv-builder";

interface ExperienceFormProps {
  data: CVData["experience"];
  onChange: (data: CVData["experience"]) => void;
  language?: "en" | "ar";
  cvData?: CVData;
}

const translations = {
  en: {
    workExperience: "Work Experience",
    addExperience: "Add Experience",
    noExperience:
      'No work experience added yet. Click "Add Experience" to get started.',
    newPosition: "New Position",
    jobTitle: "Job Title *",
    jobTitlePlaceholder: "Software Engineer",
    company: "Company *",
    companyPlaceholder: "Tech Corp",
    location: "Location",
    locationPlaceholder: "San Francisco, CA",
    startDate: "Start Date *",
    endDate: "End Date",
    currentlyWorking: "Currently working here",
    jobDescription: "Job Description",
    edit: "Edit",
    saveDescription: "Save Description",
    cancel: "Cancel",
    editPlaceholder: 'Click "Edit" to add job description...',
    descriptionPlaceholder:
      "• Developed and maintained web applications using React and Node.js\n• Collaborated with cross-functional teams to deliver high-quality software\n• Improved application performance by 30% through code optimization",
    tips: "Tips:",
    tipEnter: "Press Enter to create new bullet points automatically.",
    tipActionVerbs:
      "Use action verbs and include quantifiable achievements when possible.",
  },
  ar: {
    workExperience: "الخبرة العملية",
    addExperience: "إضافة خبرة",
    noExperience:
      'لم تتم إضافة أي خبرة عملية بعد. انقر على "إضافة خبرة" للبدء.',
    newPosition: "منصب جديد",
    jobTitle: "المسمى الوظيفي *",
    jobTitlePlaceholder: "مهندس برمجيات",
    company: "الشركة *",
    companyPlaceholder: "شركة التقنية",
    location: "الموقع",
    locationPlaceholder: "الرياض، المملكة العربية السعودية",
    startDate: "تاريخ البداية *",
    endDate: "تاريخ النهاية",
    currentlyWorking: "أعمل هنا حالياً",
    jobDescription: "وصف الوظيفة",
    edit: "تعديل",
    saveDescription: "حفظ الوصف",
    cancel: "إلغاء",
    editPlaceholder: 'انقر على "تعديل" لإضافة وصف الوظيفة...',
    descriptionPlaceholder:
      "• طورت وصنت تطبيقات الويب باستخدام React و Node.js\n• تعاونت مع فرق متعددة التخصصات لتقديم برمجيات عالية الجودة\n• حسنت أداء التطبيق بنسبة 30% من خلال تحسين الكود",
    tips: "نصائح:",
    tipEnter: "اضغط Enter لإنشاء نقاط جديدة تلقائياً.",
    tipActionVerbs:
      "استخدم أفعال العمل وأدرج الإنجازات القابلة للقياس عند الإمكان.",
  },
};

export function ExperienceForm({
  data,
  onChange,
  language = "en",
  cvData,
}: ExperienceFormProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempDescriptions, setTempDescriptions] = useState<
    Record<string, string>
  >({});

  const t = translations[language];

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    };
    onChange([...data, newExp]);
    setEditingId(newExp.id);
    setTempDescriptions((prev) => ({ ...prev, [newExp.id]: "" }));
  };

  const updateExperienceField = (
    id: string,
    field: string,
    value: string | boolean
  ) => {
    const updatedData = data.map((exp) => {
      if (exp.id === id) {
        const updated = { ...exp, [field]: value };
        return updated;
      }
      return exp;
    });
    onChange(updatedData);
  };

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id));
    setTempDescriptions((prev) => {
      const newTemp = { ...prev };
      delete newTemp[id];
      return newTemp;
    });
  };

  const handleDescriptionChange = (id: string, value: string) => {
    setTempDescriptions((prev) => ({ ...prev, [id]: value }));
  };

  const handleDescriptionKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    id: string
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const textarea = e.currentTarget;
      const cursorPosition = textarea.selectionStart;
      const textBeforeCursor = textarea.value.substring(0, cursorPosition);
      const textAfterCursor = textarea.value.substring(cursorPosition);

      // Check if we're at the beginning of a line or after a bullet point
      const lines = textBeforeCursor.split("\n");
      const currentLine = lines[lines.length - 1];

      let newText = "";
      if (currentLine.trim() === "" || currentLine.trim() === "•") {
        // If current line is empty or just a bullet, add bullet point
        newText = textBeforeCursor + "\n• " + textAfterCursor;
      } else if (currentLine.startsWith("• ")) {
        // If current line starts with bullet, add new bullet point
        newText = textBeforeCursor + "\n• " + textAfterCursor;
      } else {
        // If current line doesn't start with bullet, add bullet to new line
        newText = textBeforeCursor + "\n• " + textAfterCursor;
      }

      setTempDescriptions((prev) => ({ ...prev, [id]: newText }));

      // Set cursor position after the bullet point
      setTimeout(() => {
        const newCursorPosition = cursorPosition + 3; // +3 for '\n• '
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
  };

  const saveDescription = (id: string) => {
    const description = tempDescriptions[id] || "";
    updateExperienceField(id, "description", description);
    setEditingId(null);
  };

  const startEditingDescription = (id: string, currentDescription: string) => {
    setEditingId(id);
    setTempDescriptions((prev) => ({ ...prev, [id]: currentDescription }));
  };

  const cancelEditingDescription = (id: string) => {
    setEditingId(null);
    setTempDescriptions((prev) => {
      const newTemp = { ...prev };
      delete newTemp[id];
      return newTemp;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t.workExperience}</h3>
        <Button
          onClick={addExperience}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t.addExperience}
        </Button>
      </div>

      {data.length === 0 && (
        <p className="text-gray-500 text-center py-8">{t.noExperience}</p>
      )}

      {data.map((exp) => (
        <Card key={exp.id} className="h-fit">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">
                {exp.jobTitle || t.newPosition}{" "}
                {exp.company &&
                  `${language === "ar" ? "في" : "at"} ${exp.company}`}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(exp.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t.jobTitle}</Label>
                <AIInput
                  value={exp.jobTitle}
                  onChange={(e) =>
                    updateExperienceField(exp.id, "jobTitle", e.target.value)
                  }
                  placeholder={t.jobTitlePlaceholder}
                  className="input-clean"
                  field="job-title"
                  context={{ ...cvData, currentExperience: exp }}
                  language={language}
                />
              </div>
              <div>
                <Label>{t.company}</Label>
                <Input
                  value={exp.company}
                  onChange={(e) =>
                    updateExperienceField(exp.id, "company", e.target.value)
                  }
                  placeholder={t.companyPlaceholder}
                  className="input-clean"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>{t.location}</Label>
                <Input
                  value={exp.location}
                  onChange={(e) =>
                    updateExperienceField(exp.id, "location", e.target.value)
                  }
                  placeholder={t.locationPlaceholder}
                  className="input-clean"
                />
              </div>
              <div>
                <Label>{t.startDate}</Label>
                <Input
                  type="date"
                  value={exp.startDate}
                  onChange={(e) =>
                    updateExperienceField(exp.id, "startDate", e.target.value)
                  }
                  className="input-clean w-full"
                />
              </div>
              <div>
                <Label>{t.endDate}</Label>
                <Input
                  type="date"
                  value={exp.endDate}
                  onChange={(e) =>
                    updateExperienceField(exp.id, "endDate", e.target.value)
                  }
                  disabled={exp.current}
                  className="input-clean w-full"
                />
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    id={`current-${exp.id}`}
                    checked={exp.current === true}
                    onChange={(e) => {
                      const updatedData = data.map((experience) => {
                        if (experience.id === exp.id) {
                          return {
                            ...experience,
                            current: e.target.checked,
                            endDate: e.target.checked ? "" : experience.endDate,
                          };
                        }
                        return experience;
                      });

                      onChange(updatedData);
                    }}
                    className="rounded border-gray-300"
                  />
                  <Label
                    htmlFor={`current-${exp.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {t.currentlyWorking}
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>{t.jobDescription}</Label>
                {editingId !== exp.id && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      startEditingDescription(exp.id, exp.description)
                    }
                  >
                    {t.edit}
                  </Button>
                )}
              </div>

              {editingId === exp.id ? (
                <div className="space-y-3">
                  <AITextarea
                    value={tempDescriptions[exp.id] || ""}
                    onChange={(e) =>
                      handleDescriptionChange(exp.id, e.target.value)
                    }
                    onKeyDown={(e) => handleDescriptionKeyDown(e, exp.id)}
                    placeholder={t.descriptionPlaceholder}
                    rows={6}
                    className="textarea-clean font-mono text-sm"
                    field="job-description"
                    context={{ ...cvData, currentExperience: exp }}
                    language={language}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => saveDescription(exp.id)}
                      className="flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" />
                      {t.saveDescription}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => cancelEditingDescription(exp.id)}
                    >
                      {t.cancel}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="min-h-[100px] p-3 border rounded-md bg-gray-50">
                  {exp.description ? (
                    <div className="text-sm whitespace-pre-line text-gray-700">
                      {exp.description}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm italic">
                      {t.editPlaceholder}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-500">
                  <strong>{t.tips}</strong> {t.tipEnter}
                </p>
                <p className="text-sm text-gray-500">{t.tipActionVerbs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
