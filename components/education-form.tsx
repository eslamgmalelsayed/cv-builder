"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import type { CVData } from "./cv-builder";

interface EducationFormProps {
  data: CVData["education"];
  onChange: (data: CVData["education"]) => void;
  language?: "en" | "ar";
}

const translations = {
  en: {
    education: "Education",
    addEducation: "Add Education",
    noEducation:
      'No education added yet. Click "Add Education" to get started.',
    newDegree: "New Degree",
    degree: "Degree *",
    degreePlaceholder: "Bachelor of Science in Computer Science",
    institution: "Institution *",
    institutionPlaceholder: "University of California, Berkeley",
    location: "Location",
    locationPlaceholder: "Berkeley, CA",
    graduationDate: "Graduation Date",
    gpa: "GPA (Optional)",
    gpaPlaceholder: "3.8/4.0",
    from: "from",
  },
  ar: {
    education: "التعليم",
    addEducation: "إضافة تعليم",
    noEducation: 'لم يتم إضافة أي تعليم بعد. انقر على "إضافة تعليم" للبدء.',
    newDegree: "درجة جديدة",
    degree: "الدرجة العلمية *",
    degreePlaceholder: "بكالوريوس علوم الحاسوب",
    institution: "المؤسسة التعليمية *",
    institutionPlaceholder: "جامعة الملك سعود",
    location: "الموقع",
    locationPlaceholder: "الرياض، المملكة العربية السعودية",
    graduationDate: "تاريخ التخرج",
    gpa: "المعدل التراكمي (اختياري)",
    gpaPlaceholder: "4.5/5.0",
    from: "من",
  },
};

export function EducationForm({
  data,
  onChange,
  language = "en",
}: EducationFormProps) {
  const t = translations[language];

  const addEducation = () => {
    const newEdu = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      location: "",
      graduationDate: "",
      gpa: "",
    };
    onChange([...data, newEdu]);
  };

  const updateEducation = (id: string, field: string, value: string) => {
    onChange(
      data.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  const removeEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{t.education}</h3>
        <Button
          onClick={addEducation}
          size="sm"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {t.addEducation}
        </Button>
      </div>

      {data.length === 0 && (
        <p className="text-gray-500 text-center py-8">{t.noEducation}</p>
      )}

      {data.map((edu) => (
        <Card key={edu.id} className="h-fit">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">
                {edu.degree || t.newDegree}{" "}
                {edu.institution && `${t.from} ${edu.institution}`}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(edu.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{t.degree}</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) =>
                    updateEducation(edu.id, "degree", e.target.value)
                  }
                  placeholder={t.degreePlaceholder}
                  className="input-clean"
                />
              </div>
              <div>
                <Label>{t.institution}</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) =>
                    updateEducation(edu.id, "institution", e.target.value)
                  }
                  placeholder={t.institutionPlaceholder}
                  className="input-clean"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>{t.location}</Label>
                <Input
                  value={edu.location}
                  onChange={(e) =>
                    updateEducation(edu.id, "location", e.target.value)
                  }
                  placeholder={t.locationPlaceholder}
                  className="input-clean"
                />
              </div>
              <div>
                <Label>{t.graduationDate}</Label>
                <Input
                  type="date"
                  value={edu.graduationDate}
                  onChange={(e) =>
                    updateEducation(edu.id, "graduationDate", e.target.value)
                  }
                  className="input-clean w-full"
                />
              </div>
              <div>
                <Label>{t.gpa}</Label>
                <Input
                  value={edu.gpa || ""}
                  onChange={(e) =>
                    updateEducation(edu.id, "gpa", e.target.value)
                  }
                  placeholder={t.gpaPlaceholder}
                  className="input-clean"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
