"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalInfoForm } from "./personal-info-form";
import { ExperienceForm } from "./experience-form";
import { EducationForm } from "./education-form";
import { SkillsForm } from "./skills-form";
import { CustomSectionForm } from "./custom-section-form";
import { CVPreview } from "./cv-preview";
import { ATSScore } from "./ats-score";
import { ThemeCustomizer } from "./theme-customizer";
import { SaveStatus } from "./save-status";
import { Eye, Sparkles } from "lucide-react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { SectionReorder } from "./section-reorder";
import { PDFExportButton } from "./pdf-export-button";
import { useCVData } from "@/hooks/use-cv-data";
import { useAlertModal } from "@/components/ui/alert-modal";

export interface CustomSection {
  id: string;
  title: string;
  type: "text" | "list" | "timeline";
  content: string;
  items?: Array<{
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    date?: string;
  }>;
}

export interface CVData {
  personalInfo: {
    fullName: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
    website: string;
    github: string;
    summary: string;
  };
  experience: Array<{
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
    certifications: string[];
  };
  customSections: CustomSection[];
}

// Arabic translations
const translations = {
  en: {
    title: "ATS-Compliant CV Builder",
    subtitle:
      "Create a professional resume optimized for Applicant Tracking Systems",
    buildCV: "Build Your CV",
    hidePreview: "Hide Preview",
    showPreview: "Show Preview",
    atsScore: "ATS Score",
    personal: "Personal",
    experience: "Experience",
    education: "Education",
    skills: "Skills",
    customSections: "Custom",
    loading: "Loading your CV data...",
  },
  ar: {
    title: "منشئ السيرة الذاتية المتوافق مع ATS",
    subtitle: "إنشاء سيرة ذاتية احترافية محسنة لأنظمة تتبع المتقدمين",
    buildCV: "إنشاء سيرتك الذاتية",
    hidePreview: "إخفاء المعاينة",
    showPreview: "عرض المعاينة",
    atsScore: "نقاط ATS",
    personal: "شخصي",
    experience: "الخبرة",
    education: "التعليم",
    skills: "المهارات",
    customSections: "مخصص",
    loading: "جاري تحميل بيانات سيرتك الذاتية...",
  },
};

export function CVBuilder() {
  const {
    // State
    isLoaded,
    cvData,
    sectionOrder,
    sectionNames,
    visibleSections,
    direction,
    language,
    themeColor,
    clearTrigger, // Use clear trigger to force re-renders

    // Update functions
    updatePersonalInfo,
    updateExperience,
    updateEducation,
    updateSkills,
    updateCustomSections,
    addCustomSection,
    removeCustomSection,
    updateSectionOrder,
    toggleSectionVisibility,
    updateSectionName,
    updateDirection,
    updateLanguage,
    updateThemeColor,

    // Utility functions
    getSaveStatus,
  } = useCVData();

  const [showPreview, setShowPreview] = useState(true);
  const [showAI, setShowAI] = useState(false);
  const [editingCustomSection, setEditingCustomSection] = useState<
    string | null
  >(null);
  const [activeTab, setActiveTab] = useState("personalInfo");
  const { showConfirm, AlertModalComponent } = useAlertModal();

  // Apply theme and language settings on load and when clearTrigger changes
  useEffect(() => {
    if (!isLoaded) return;

    // Apply theme color
    document.documentElement.className = document.documentElement.className
      .replace(/theme-\w+/g, "")
      .concat(` ${themeColor}`);

    // Apply language and direction
    document.documentElement.setAttribute("dir", direction);
    document.documentElement.setAttribute("lang", language);

    // Add Cairo font class if Arabic is selected
    if (language === "ar") {
      document.documentElement.classList.add("cairo-font");
      document.body.classList.add("cairo-font");
    } else {
      document.documentElement.classList.remove("cairo-font");
      document.body.classList.remove("cairo-font");
    }
  }, [isLoaded, themeColor, direction, language, clearTrigger]); // Include clearTrigger

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sectionOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateSectionOrder(items);
  };

  const handleDirectionChange = (newDirection: "ltr" | "rtl") => {
    updateDirection(newDirection);
  };

  const handleLanguageChange = (newLanguage: "en" | "ar") => {
    updateLanguage(newLanguage);
  };

  const handleThemeColorChange = (newThemeColor: string) => {
    updateThemeColor(newThemeColor);
  };

  const t = translations[language];

  // Show loading state while data is being loaded
  if (!isLoaded) {
    return (
      <div className="container mx-auto p-4 max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px]">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">{t.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`container mx-auto p-4 max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] ${
        direction === "rtl" ? "text-right" : ""
      }`}
    >
      <div className="mb-6">
        <div
          className={`flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 ${
            direction === "rtl" ? "sm:flex-row-reverse" : ""
          }`}
        >
          <div className={`${direction === "rtl" ? "text-right" : ""} flex-1`}>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {t.title}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">{t.subtitle}</p>
          </div>
          <div
            className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto ${
              direction === "rtl" ? "sm:flex-row-reverse" : ""
            }`}
          >
            <SaveStatus status={getSaveStatus()} language={language} />
            <ThemeCustomizer
              onDirectionChange={handleDirectionChange}
              onLanguageChange={handleLanguageChange}
              onThemeColorChange={handleThemeColorChange}
              currentThemeColor={themeColor}
              currentLanguage={language}
              currentDirection={direction}
            />
          </div>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 sm:flex gap-2 sm:gap-4 mb-6 ${
          direction === "rtl" ? "sm:flex-row-reverse" : ""
        }`}
      >
        <Button
          variant={showPreview ? "default" : "outline"}
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Eye className="w-4 h-4" />
          {showPreview ? t.hidePreview : t.showPreview}
        </Button>
        <Button
          variant={showAI ? "default" : "outline"}
          onClick={() => setShowAI(!showAI)}
          className="flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Sparkles className="w-4 h-4" />
          {t.atsScore}
        </Button>
        <div className="w-full sm:w-auto">
          <PDFExportButton cvData={cvData} />
        </div>
      </div>

      <div
        className={`grid gap-4 md:gap-6 ${
          showPreview && showAI
            ? "md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-[1fr_1fr_300px] 2xl:grid-cols-[1fr_1fr_320px]" // Responsive: mobile=1col, md=1col, lg=2col, xl+=3col
            : showPreview || showAI
            ? "md:grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1"
        } ${direction === "rtl" ? "lg:grid-flow-col-dense" : ""}`}
      >
        <div className="flex flex-col h-fit">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className={direction === "rtl" ? "text-right" : ""}>
                {t.buildCV}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="cv-sections">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                        key={clearTrigger}
                      >
                        <TabsList
                          className={`grid w-full grid-cols-5 ${
                            direction === "rtl" ? "flex-row-reverse" : ""
                          }`}
                        >
                          <TabsTrigger value="personalInfo">
                            {t.personal}
                          </TabsTrigger>
                          <TabsTrigger value="experience">
                            {t.experience}
                          </TabsTrigger>
                          <TabsTrigger value="education">
                            {t.education}
                          </TabsTrigger>
                          <TabsTrigger value="skills">{t.skills}</TabsTrigger>
                          <TabsTrigger value="customSections">
                            {t.customSections}
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="personalInfo" className="mt-6">
                          <PersonalInfoForm
                            data={cvData.personalInfo}
                            onChange={updatePersonalInfo}
                            language={language}
                            cvData={cvData}
                          />
                          
                          {/* Debug: Show current data and fix button */}
                          {process.env.NODE_ENV === 'development' && (
                            <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
                              <p><strong>Debug Info:</strong></p>
                              <p>Title: "{cvData.personalInfo.title}"</p>
                              <p>Has title field: {cvData.personalInfo.hasOwnProperty('title') ? 'Yes' : 'No'}</p>
                              {!cvData.personalInfo.title && (
                                <button 
                                  onClick={() => {
                                    const newPersonalInfo = { ...cvData.personalInfo };
                                    if (!newPersonalInfo.hasOwnProperty('title')) {
                                      newPersonalInfo.title = '';
                                    }
                                    updatePersonalInfo(newPersonalInfo);
                                  }}
                                  className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
                                >
                                  Refresh Title Field
                                </button>
                              )}
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="experience" className="mt-6">
                          <ExperienceForm
                            data={cvData.experience}
                            onChange={updateExperience}
                            language={language}
                            cvData={cvData}
                            key={`experience-${clearTrigger}`}
                          />
                        </TabsContent>

                        <TabsContent value="education" className="mt-6">
                          <EducationForm
                            data={cvData.education}
                            onChange={updateEducation}
                            language={language}
                            key={`education-${clearTrigger}`}
                          />
                        </TabsContent>

                        <TabsContent value="skills" className="mt-6">
                          <SkillsForm
                            data={cvData.skills}
                            onChange={updateSkills}
                            language={language}
                            key={`skills-${clearTrigger}`}
                          />
                        </TabsContent>

                        <TabsContent value="customSections" className="mt-6">
                          <CustomSectionForm
                            data={cvData.customSections}
                            onChange={updateCustomSections}
                            onAddSection={addCustomSection}
                            onRemoveSection={removeCustomSection}
                            language={language}
                            editingId={editingCustomSection}
                            onEditingChange={setEditingCustomSection}
                            key={`custom-${clearTrigger}`}
                          />
                        </TabsContent>
                      </Tabs>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>

          <div className="mt-4">
            <SectionReorder
              sectionOrder={sectionOrder}
              onReorder={updateSectionOrder}
              visibleSections={visibleSections}
              onToggleVisibility={toggleSectionVisibility}
              sectionNames={sectionNames}
              onUpdateSectionName={updateSectionName}
              customSections={cvData.customSections}
              language={language}
            />
          </div>
        </div>

        {showPreview && (
          <div className="lg:sticky lg:top-4">
            <CVPreview
              data={cvData}
              sectionOrder={sectionOrder}
              visibleSections={visibleSections}
              sectionNames={sectionNames}
              direction={direction}
              language={language}
              isPreviewMode={false}
            />
          </div>
        )}

        {showAI && (
          <div className="lg:sticky lg:top-4">
            <ATSScore cvData={cvData} language={language} />
          </div>
        )}
      </div>
      <AlertModalComponent />
    </div>
  );
}
