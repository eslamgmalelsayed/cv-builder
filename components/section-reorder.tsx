"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, Eye, EyeOff, Edit2, Check, X } from "lucide-react";
import type { CustomSection } from "./cv-builder";

interface SectionReorderProps {
  sectionOrder: string[];
  onReorder: (newOrder: string[]) => void;
  visibleSections: Record<string, boolean>;
  onToggleVisibility: (section: string) => void;
  sectionNames: Record<string, string>;
  onUpdateSectionName: (section: string, name: string) => void;
  customSections: CustomSection[];
  language?: "en" | "ar";
}

const translations = {
  en: {
    sectionOrderVisibility: "Section Order & Visibility",
    tip: "Tip:",
    tipText:
      "Drag sections to reorder them, click the edit icon to rename sections, and use the eye icon to show/hide sections.",
  },
  ar: {
    sectionOrderVisibility: "ترتيب الأقسام والرؤية",
    tip: "نصيحة:",
    tipText:
      "اسحب الأقسام لإعادة ترتيبها، انقر على أيقونة التعديل لإعادة تسمية الأقسام، واستخدم أيقونة العين لإظهار/إخفاء الأقسام.",
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

export function SectionReorder({
  sectionOrder,
  onReorder,
  visibleSections,
  onToggleVisibility,
  sectionNames,
  onUpdateSectionName,
  customSections,
  language = "en",
}: SectionReorderProps) {
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");

  const t = translations[language];
  const labels = defaultSectionLabels[language];

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sectionOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onReorder(items);
  };

  const startEditing = (section: string) => {
    setEditingSection(section);
    setTempName(sectionNames[section] || getSectionLabel(section));
  };

  const saveEdit = () => {
    if (editingSection && tempName.trim()) {
      onUpdateSectionName(editingSection, tempName.trim());
    }
    setEditingSection(null);
    setTempName("");
  };

  const cancelEdit = () => {
    setEditingSection(null);
    setTempName("");
  };

  const getSectionLabel = (section: string) => {
    // Handle custom sections
    if (section.startsWith("custom-")) {
      const customId = section.replace("custom-", "");
      const customSection = customSections.find((s) => s.id === customId);
      return customSection?.title || section;
    }

    // Handle default sections
    return (
      sectionNames[section] || labels[section as keyof typeof labels] || section
    );
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{t.sectionOrderVisibility}</CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="section-reorder">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-1"
              >
                {sectionOrder.map((section, index) => (
                  <Draggable key={section} draggableId={section} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`flex items-center justify-between p-2 bg-white border rounded-lg ${
                          snapshot.isDragging ? "shadow-lg" : "shadow-sm"
                        } ${!visibleSections[section] ? "opacity-50" : ""} ${
                          section.startsWith("custom-")
                            ? "border-l-4 border-l-blue-500"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="w-4 h-4 text-gray-400" />
                          </div>

                          {editingSection === section ? (
                            <div className="flex items-center gap-2 flex-1">
                              <Input
                                value={tempName}
                                onChange={(e) => setTempName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    saveEdit();
                                  } else if (e.key === "Escape") {
                                    cancelEdit();
                                  }
                                }}
                                className="input-clean text-sm"
                                autoFocus
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={saveEdit}
                                className="p-1"
                              >
                                <Check className="w-3 h-3 text-green-600" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={cancelEdit}
                                className="p-1"
                              >
                                <X className="w-3 h-3 text-red-600" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 flex-1 group">
                              <span className="text-sm font-medium flex items-center gap-2">
                                {getSectionLabel(section)}
                                {section.startsWith("custom-") && (
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                    {language === "ar" ? "مخصص" : "Custom"}
                                  </span>
                                )}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEditing(section)}
                                className="p-1 opacity-0 group-hover:opacity-100 hover:opacity-100"
                              >
                                <Edit2 className="w-3 h-3 text-gray-500" />
                              </Button>
                            </div>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onToggleVisibility(section)}
                          className="p-1"
                        >
                          {visibleSections[section] ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>{t.tip}</strong> {t.tipText}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
