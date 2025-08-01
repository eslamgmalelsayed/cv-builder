"use client";

import { AIInput, AITextarea } from "@/components/ui/ai-input";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CVData } from "./cv-builder";

interface PersonalInfoFormProps {
  data: CVData["personalInfo"];
  onChange: (data: CVData["personalInfo"]) => void;
  language?: "en" | "ar";
  cvData?: CVData;
}

const translations = {
  en: {
    fullName: "Full Name *",
    fullNamePlaceholder: "John Doe",
    title: "Job Title/Position *",
    titlePlaceholder: "Software Engineer",
    email: "Email *",
    emailPlaceholder: "john.doe@email.com",
    phone: "Phone Number",
    phonePlaceholder: "+1 (555) 123-4567",
    location: "Location",
    locationPlaceholder: "New York, NY",
    linkedIn: "LinkedIn Profile",
    linkedInPlaceholder: "linkedin.com/in/johndoe",
    website: "Website/Portfolio",
    websitePlaceholder: "johndoe.com",
    github: "GitHub Profile",
    githubPlaceholder: "github.com/johndoe",
    summary: "Professional Summary",
    summaryPlaceholder:
      "Brief professional summary highlighting your key qualifications and career objectives...",
    summaryTip:
      "Keep it concise (2-3 sentences) and include relevant keywords for ATS optimization.",
  },
  ar: {
    fullName: "الاسم الكامل *",
    fullNamePlaceholder: "أحمد محمد",
    title: "المسمى الوظيفي *",
    titlePlaceholder: "مهندس برمجيات",
    email: "البريد الإلكتروني *",
    emailPlaceholder: "ahmed.mohamed@email.com",
    phone: "رقم الهاتف",
    phonePlaceholder: "+966 50 123 4567",
    location: "الموقع",
    locationPlaceholder: "الرياض، المملكة العربية السعودية",
    linkedIn: "ملف LinkedIn",
    linkedInPlaceholder: "linkedin.com/in/ahmedmohamed",
    website: "الموقع الإلكتروني/المعرض",
    websitePlaceholder: "ahmedmohamed.com",
    github: "ملف GitHub",
    githubPlaceholder: "github.com/ahmedmohamed",
    summary: "الملخص المهني",
    summaryPlaceholder:
      "ملخص مهني موجز يسلط الضوء على مؤهلاتك الرئيسية وأهدافك المهنية...",
    summaryTip:
      "اجعله موجزاً (2-3 جمل) وأدرج الكلمات المفتاحية ذات الصلة لتحسين ATS.",
  },
};

export function PersonalInfoForm({
  data,
  onChange,
  language = "en",
  cvData,
}: PersonalInfoFormProps) {
  const handleChange = (field: keyof CVData["personalInfo"], value: string) => {
    const updatedData = { ...data, [field]: value };
    onChange(updatedData);
  };

  const t = translations[language];
  const isRTL = language === "ar";

  return (
    <div className={`space-y-4 ${isRTL ? "text-start" : ""}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={isRTL ? "text-start" : ""}>
          <Label htmlFor="fullName" className={isRTL ? "text-start block" : ""}>
            {t.fullName}
          </Label>
          <AIInput
            id="fullName"
            value={data.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder={t.fullNamePlaceholder}
            className={`input-clean ${isRTL ? "text-start" : ""}`}
            style={isRTL ? { textAlign: "right" } : {}}
          />
        </div>
        <div className={isRTL ? "text-start" : ""}>
          <Label htmlFor="title" className={isRTL ? "text-start block" : ""}>
            {t.title}
          </Label>
          <AIInput
            id="title"
            value={data.title || ""}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder={t.titlePlaceholder}
            className={`input-clean ${isRTL ? "text-start" : ""}`}
            style={isRTL ? { textAlign: "right" } : {}}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={isRTL ? "text-start" : ""}>
          <Label htmlFor="email" className={isRTL ? "text-start block" : ""}>
            {t.email}
          </Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder={t.emailPlaceholder}
            className="input-clean ltr-content"
            style={{ textAlign: "left" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={isRTL ? "text-start" : ""}>
          <Label htmlFor="phone" className={isRTL ? "text-start block" : ""}>
            {t.phone}
          </Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder={t.phonePlaceholder}
            className="input-clean ltr-content"
            style={{ textAlign: "left" }}
          />
        </div>
        <div className={isRTL ? "text-start" : ""}>
          <Label htmlFor="location" className={isRTL ? "text-start block" : ""}>
            {t.location}
          </Label>
          <Input
            id="location"
            value={data.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder={t.locationPlaceholder}
            className={`input-clean ${isRTL ? "text-start" : ""}`}
            style={isRTL ? { textAlign: "right" } : {}}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={isRTL ? "text-start" : ""}>
          <Label htmlFor="linkedIn" className={isRTL ? "text-start block" : ""}>
            {t.linkedIn}
          </Label>
          <Input
            id="linkedIn"
            value={data.linkedIn}
            onChange={(e) => handleChange("linkedIn", e.target.value)}
            placeholder={t.linkedInPlaceholder}
            className="input-clean ltr-content"
            style={{ textAlign: "left" }}
          />
        </div>
        <div className={isRTL ? "text-start" : ""}>
          <Label htmlFor="website" className={isRTL ? "text-start block" : ""}>
            {t.website}
          </Label>
          <Input
            id="website"
            value={data.website}
            onChange={(e) => handleChange("website", e.target.value)}
            placeholder={t.websitePlaceholder}
            className="input-clean ltr-content"
            style={{ textAlign: "left" }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div className={isRTL ? "text-start" : ""}>
          <Label htmlFor="github" className={isRTL ? "text-start block" : ""}>
            {t.github}
          </Label>
          <Input
            id="github"
            value={data.github}
            onChange={(e) => handleChange("github", e.target.value)}
            placeholder={t.githubPlaceholder}
            className="input-clean ltr-content"
            style={{ textAlign: "left" }}
          />
        </div>
      </div>

      <div className={isRTL ? "text-start" : ""}>
        <Label htmlFor="summary" className={isRTL ? "text-start block" : ""}>
          {t.summary}
        </Label>
        <AITextarea
          id="summary"
          value={data.summary}
          onChange={(e) => handleChange("summary", e.target.value)}
          placeholder={t.summaryPlaceholder}
          rows={4}
          className={`textarea-clean ${isRTL ? "text-start" : ""}`}
          style={isRTL ? { textAlign: "right" } : {}}
          field="professional-summary"
          context={cvData}
          language={language}
        />
        <p
          className={`text-sm text-gray-500 mt-1 ${isRTL ? "text-start" : ""}`}
        >
          {t.summaryTip}
        </p>
      </div>
    </div>
  );
}
