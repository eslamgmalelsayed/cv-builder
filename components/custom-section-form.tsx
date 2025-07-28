"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, Save } from "lucide-react";
import type { CustomSection } from "./cv-builder";

interface CustomSectionFormProps {
  data: CustomSection[];
  onChange: (data: CustomSection[]) => void;
  onAddSection: (section: CustomSection) => void;
  onRemoveSection: (sectionId: string) => void;
  language?: "en" | "ar";
  editingId?: string | null;
  onEditingChange?: (id: string | null) => void;
}

const translations = {
  en: {
    customSections: "Custom Sections",
    addSection: "Add Custom Section",
    noSections:
      'No custom sections added yet. Click "Add Custom Section" to get started.',
    sectionTitle: "Section Title *",
    sectionTitlePlaceholder: "e.g., Projects, Volunteer Work, Awards",
    content: "Content",
    contentPlaceholder: "Enter your content here...",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    createSection: "Create Section",
    editSection: "Edit Section",
    tips: "Tips:",
    tipText:
      "Custom sections are great for showcasing projects, volunteer work, awards, publications, or any other relevant information.",
  },
  ar: {
    customSections: "الأقسام المخصصة",
    addSection: "إضافة قسم مخصص",
    noSections:
      'لم يتم إضافة أي أقسام مخصصة بعد. انقر على "إضافة قسم مخصص" للبدء.',
    sectionTitle: "عنوان القسم *",
    sectionTitlePlaceholder: "مثل: المشاريع، العمل التطوعي، الجوائز",
    content: "المحتوى",
    contentPlaceholder: "أدخل محتواك هنا...",
    edit: "تعديل",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    createSection: "إنشاء قسم",
    editSection: "تعديل القسم",
    tips: "نصائح:",
    tipText:
      "الأقسام المخصصة رائعة لعرض المشاريع والعمل التطوعي والجوائز والمنشورات أو أي معلومات أخرى ذات صلة.",
  },
};

export function CustomSectionForm({
  data,
  onChange,
  onAddSection,
  onRemoveSection,
  language = "en",
  editingId: externalEditingId,
  onEditingChange,
}: CustomSectionFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(
    externalEditingId || null
  );
  const [newSection, setNewSection] = useState<Partial<CustomSection>>({
    title: "",
    type: "text",
    content: "",
    items: [],
  });

  // Update local editingId when external one changes
  useEffect(() => {
    if (externalEditingId !== undefined) {
      setEditingId(externalEditingId);
    }
  }, [externalEditingId]);

  // Notify parent when editingId changes
  const handleEditingChange = (id: string | null) => {
    setEditingId(id);
    onEditingChange?.(id);
  };

  const t = translations[language];

  const handleCreateSection = () => {
    if (!newSection.title?.trim()) return;

    const section: CustomSection = {
      id: Date.now().toString(),
      title: newSection.title,
      type: newSection.type as "text" | "list" | "timeline",
      content: newSection.content || "",
      items: newSection.items || [],
    };

    onAddSection(section);
    setNewSection({ title: "", type: "text", content: "", items: [] });
    setIsCreating(false);
  };

  const handleUpdateSection = (id: string, updates: Partial<CustomSection>) => {
    onChange(
      data.map((section) =>
        section.id === id ? { ...section, ...updates } : section
      )
    );
  };

  const handleDeleteSection = (id: string) => {
    onRemoveSection(id);
    onChange(data.filter((section) => section.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t.customSections}</h3>
        <Button
          onClick={() => setIsCreating(true)}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t.addSection}
        </Button>
      </div>

      {/* Create New Section Form */}
      {isCreating && (
        <Card className="border-2 border-dashed border-blue-300 h-fit">
          <CardHeader>
            <CardTitle className="text-base">{t.createSection}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{t.sectionTitle}</Label>
              <Input
                value={newSection.title || ""}
                onChange={(e) =>
                  setNewSection({ ...newSection, title: e.target.value })
                }
                placeholder={t.sectionTitlePlaceholder}
                className="input-clean"
              />
            </div>

            <div>
              <Label>{t.content}</Label>
              <Textarea
                value={newSection.content || ""}
                onChange={(e) =>
                  setNewSection({ ...newSection, content: e.target.value })
                }
                placeholder={t.contentPlaceholder}
                rows={4}
                className="textarea-clean font-mono text-sm"
              />
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-500">
                  <strong>{t.tips}</strong> {t.tipText}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateSection} size="sm">
                {t.createSection}
              </Button>
              <Button
                onClick={() => setIsCreating(false)}
                variant="outline"
                size="sm"
              >
                {t.cancel}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {data.length === 0 && !isCreating && (
        <p className="text-gray-500 text-center py-8">{t.noSections}</p>
      )}

      {/* Existing Sections */}
      {data.map((section) => (
        <Card key={section.id} className="h-fit">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">{section.title}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleEditingChange(
                      editingId === section.id ? null : section.id
                    )
                  }
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteSection(section.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {editingId === section.id ? (
              <div className="space-y-4">
                <div>
                  <Label>{t.sectionTitle}</Label>
                  <Input
                    value={section.title}
                    onChange={(e) =>
                      handleUpdateSection(section.id, { title: e.target.value })
                    }
                    className="input-clean"
                  />
                </div>

                <div>
                  <Label>{t.content}</Label>
                  <Textarea
                    value={section.content}
                    onChange={(e) =>
                      handleUpdateSection(section.id, {
                        content: e.target.value,
                      })
                    }
                    rows={4}
                    className="textarea-clean font-mono text-sm"
                  />
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-500">
                      <strong>{t.tips}</strong> {t.tipText}
                    </p>
                  </div>
                </div>

                <Button onClick={() => handleEditingChange(null)} size="sm">
                  <Save className="w-3 h-3 mr-1" />
                  {t.save}
                </Button>
              </div>
            ) : (
              <div>
                {section.content ? (
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {section.content}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic">
                    {language === "ar"
                      ? "لا يوجد محتوى بعد. انقر على تعديل لإضافة المحتوى."
                      : "No content yet. Click edit to add content."}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">{t.tips}</h4>
        <p className="text-sm text-blue-800">{t.tipText}</p>
      </div>
    </div>
  );
}
