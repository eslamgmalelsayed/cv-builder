"use client";

import { useState, useEffect, useCallback } from "react";
import type { CVData, CustomSection } from "@/components/cv-builder";

export interface CVState {
  cvData: CVData;
  sectionOrder: string[];
  sectionNames: Record<string, string>;
  visibleSections: Record<string, boolean>;
  direction: "ltr" | "rtl";
  language: "en" | "ar";
  themeColor: string;
  lastSaved: string;
}

const defaultCVData: CVData = {
  personalInfo: {
    fullName: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    linkedIn: "",
    website: "",
    github: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    languages: [],
    certifications: [],
  },
  customSections: [],
};

const getDefaultState = (): CVState => ({
  cvData: {
    personalInfo: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      linkedIn: "",
      website: "",
      github: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: [],
      languages: [],
      certifications: [],
    },
    customSections: [],
  },
  sectionOrder: ["personalInfo", "experience", "education", "skills"],
  sectionNames: {},
  visibleSections: {
    personalInfo: true,
    experience: true,
    education: true,
    skills: true,
  },
  direction: "ltr",
  language: "en",
  themeColor: "theme-black",
  lastSaved: new Date().toISOString(),
});

const STORAGE_KEY = "cv-builder-state";
const AUTO_SAVE_DELAY = 100; // Reduced to 100ms for faster saving

export function useCVData() {
  const [state, setState] = useState<CVState>(getDefaultState());
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);
  const [clearTrigger, setClearTrigger] = useState(0); // Force re-render trigger

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState) as CVState;
        const defaultState = getDefaultState();

        // Merge with default state to handle new fields
        const mergedState: CVState = {
          ...defaultState,
          ...parsedState,
          cvData: {
            ...defaultState.cvData,
            ...parsedState.cvData,
            personalInfo: {
              ...defaultState.cvData.personalInfo,
              ...parsedState.cvData.personalInfo,
            },
            skills: {
              ...defaultState.cvData.skills,
              ...parsedState.cvData.skills,
              // Ensure all skill arrays are properly initialized
              technical: Array.isArray(parsedState.cvData.skills?.technical)
                ? parsedState.cvData.skills.technical
                : defaultState.cvData.skills.technical,
              soft: Array.isArray(parsedState.cvData.skills?.soft)
                ? parsedState.cvData.skills.soft
                : defaultState.cvData.skills.soft,
              languages: Array.isArray(parsedState.cvData.skills?.languages)
                ? parsedState.cvData.skills.languages
                : defaultState.cvData.skills.languages,
              certifications: Array.isArray(
                parsedState.cvData.skills?.certifications
              )
                ? parsedState.cvData.skills.certifications
                : defaultState.cvData.skills.certifications,
            },
          },
          visibleSections: {
            ...defaultState.visibleSections,
            ...parsedState.visibleSections,
          },
        };

        setState(mergedState);
        setLastSaveTime(new Date(mergedState.lastSaved));
      }
    } catch (error) {
      console.error("Error loading CV data from localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Helper function to update state and save immediately
  const updateStateAndSave = useCallback(
    (updater: (prev: CVState) => CVState) => {
      setState((prev) => {
        const newState = updater(prev);

        // Save immediately without setTimeout to avoid race conditions
        try {
          const stateToSave: CVState = {
            ...newState,
            lastSaved: new Date().toISOString(),
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
          setLastSaveTime(new Date());
        } catch (error) {
          console.error("Error saving CV data to localStorage:", error);
        }

        return newState;
      });
    },
    []
  );

  // Update functions
  const updatePersonalInfo = useCallback(
    (personalInfo: CVData["personalInfo"]) => {
      updateStateAndSave((prev) => {
        const newState = {
          ...prev,
          cvData: { ...prev.cvData, personalInfo },
        };
        return newState;
      });
    },
    [updateStateAndSave]
  );

  const updateExperience = useCallback(
    (experience: CVData["experience"]) => {
      updateStateAndSave((prev) => ({
        ...prev,
        cvData: { ...prev.cvData, experience },
      }));
    },
    [updateStateAndSave]
  );

  const updateEducation = useCallback(
    (education: CVData["education"]) => {
      updateStateAndSave((prev) => ({
        ...prev,
        cvData: { ...prev.cvData, education },
      }));
    },
    [updateStateAndSave]
  );

  const updateSkills = useCallback(
    (skills: CVData["skills"]) => {
      updateStateAndSave((prev) => ({
        ...prev,
        cvData: { ...prev.cvData, skills },
      }));
    },
    [updateStateAndSave]
  );

  const updateCustomSections = useCallback(
    (customSections: CVData["customSections"]) => {
      updateStateAndSave((prev) => ({
        ...prev,
        cvData: { ...prev.cvData, customSections },
      }));
    },
    [updateStateAndSave]
  );

  const addCustomSection = useCallback(
    (section: CustomSection) => {
      const newSectionId = `custom-${section.id}`;
      updateStateAndSave((prev) => ({
        ...prev,
        cvData: {
          ...prev.cvData,
          customSections: [...prev.cvData.customSections, section],
        },
        sectionOrder: [...prev.sectionOrder, newSectionId],
        visibleSections: { ...prev.visibleSections, [newSectionId]: true },
      }));
    },
    [updateStateAndSave]
  );

  const removeCustomSection = useCallback(
    (sectionId: string) => {
      const customSectionKey = `custom-${sectionId}`;
      updateStateAndSave((prev) => {
        const newSectionNames = { ...prev.sectionNames };
        const newVisibleSections = { ...prev.visibleSections };
        delete newSectionNames[customSectionKey];
        delete newVisibleSections[customSectionKey];

        return {
          ...prev,
          cvData: {
            ...prev.cvData,
            customSections: prev.cvData.customSections.filter(
              (section) => section.id !== sectionId
            ),
          },
          sectionOrder: prev.sectionOrder.filter(
            (id) => id !== customSectionKey
          ),
          sectionNames: newSectionNames,
          visibleSections: newVisibleSections,
        };
      });
    },
    [updateStateAndSave]
  );

  const updateSectionOrder = useCallback(
    (sectionOrder: string[]) => {
      updateStateAndSave((prev) => ({ ...prev, sectionOrder }));
    },
    [updateStateAndSave]
  );

  const toggleSectionVisibility = useCallback(
    (section: string) => {
      updateStateAndSave((prev) => ({
        ...prev,
        visibleSections: {
          ...prev.visibleSections,
          [section]: !prev.visibleSections[section],
        },
      }));
    },
    [updateStateAndSave]
  );

  const updateSectionName = useCallback(
    (section: string, name: string) => {
      updateStateAndSave((prev) => ({
        ...prev,
        sectionNames: { ...prev.sectionNames, [section]: name },
      }));
    },
    [updateStateAndSave]
  );

  const updateDirection = useCallback(
    (direction: "ltr" | "rtl") => {
      updateStateAndSave((prev) => ({ ...prev, direction }));
    },
    [updateStateAndSave]
  );

  const updateLanguage = useCallback(
    (language: "en" | "ar") => {
      updateStateAndSave((prev) => ({ ...prev, language }));
    },
    [updateStateAndSave]
  );

  const updateThemeColor = useCallback(
    (themeColor: string) => {
      updateStateAndSave((prev) => ({ ...prev, themeColor }));
    },
    [updateStateAndSave]
  );

  const updateCVData = useCallback(
    (cvData: CVData) => {
      updateStateAndSave((prev) => ({ ...prev, cvData }));
    },
    [updateStateAndSave]
  );

  // Clear all data and reset to defaults - COMPLETE RESET
  const clearAllData = useCallback(() => {
    // 1. Clear localStorage completely
    try {
      localStorage.removeItem(STORAGE_KEY);
      // Also clear any other related storage keys
      Object.keys(localStorage).forEach((key) => {
        if (
          key.startsWith("cv-") ||
          key.includes("resume") ||
          key.includes("builder")
        ) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }

    // 2. Reset all state to fresh defaults
    const freshDefaultState = getDefaultState();
    setState(freshDefaultState);

    // 3. Reset save tracking
    setLastSaveTime(null);
    setIsSaving(false);

    // 4. Force complete UI re-render
    setClearTrigger((prev) => prev + 1);

    // 5. Clear all form inputs in the DOM
    setTimeout(() => {
      // Clear all input fields
      const inputs = document.querySelectorAll("input, textarea, select");
      inputs.forEach((input) => {
        if (input instanceof HTMLInputElement) {
          input.value = "";
          input.checked = false;
          // Trigger React events
          const event = new Event("input", { bubbles: true });
          input.dispatchEvent(event);
        } else if (input instanceof HTMLTextAreaElement) {
          input.value = "";
          const event = new Event("input", { bubbles: true });
          input.dispatchEvent(event);
        } else if (input instanceof HTMLSelectElement) {
          input.selectedIndex = 0;
          const event = new Event("change", { bubbles: true });
          input.dispatchEvent(event);
        }
      });

      // 6. Force another state reset to ensure everything is cleared
      setState(getDefaultState());

      // 7. Reset document attributes to defaults
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.setAttribute("lang", "en");
      document.documentElement.className = document.documentElement.className
        .replace(/theme-\w+/g, "")
        .concat(" theme-black");

      // 8. Remove Arabic font classes
      document.documentElement.classList.remove("cairo-font");
      document.body.classList.remove("cairo-font");
    }, 100);

    // 9. Additional cleanup after a longer delay
    setTimeout(() => {
      // Final state reset
      setState(getDefaultState());
      setClearTrigger((prev) => prev + 1);
    }, 500);
  }, []);

  const getSaveStatus = useCallback(() => {
    if (isSaving) return "saving";
    if (lastSaveTime) return "saved";
    return "unsaved";
  }, [isSaving, lastSaveTime]);

  // Blur save function for immediate localStorage updates
  const saveOnBlur = useCallback(() => {
    if (!isLoaded) return;

    try {
      const stateToSave: CVState = {
        ...state,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      setLastSaveTime(new Date());
    } catch (error) {
      console.error("Error saving CV data to localStorage on blur:", error);
    }
  }, [state, isLoaded]);

  return {
    // State
    state,
    isLoaded,
    isSaving,
    lastSaveTime,
    clearTrigger, // Expose clear trigger for components that need to react to clearing

    // CV Data
    cvData: state.cvData,
    sectionOrder: state.sectionOrder,
    sectionNames: state.sectionNames,
    visibleSections: state.visibleSections,
    direction: state.direction,
    language: state.language,
    themeColor: state.themeColor,

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
    updateCVData,

    // Utility functions
    clearAllData,
    getSaveStatus,
    saveOnBlur,
  };
}
