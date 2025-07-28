"use client";

import { useCallback } from "react";

/**
 * Custom hook that provides localStorage saving functionality on blur events
 * This complements the existing auto-save mechanism by providing immediate saves
 * when users finish editing fields (on blur)
 */
export function useBlurSave() {
  const saveToLocalStorage = useCallback((key: string, data: any) => {
    try {
      const stateToSave = {
        ...data,
        lastSaved: new Date().toISOString(),
      };
      localStorage.setItem(key, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Error saving to localStorage on blur:", error);
    }
  }, []);

  /**
   * Creates a blur handler that saves the current state to localStorage
   * @param saveFunction - Function that gets the current state to save
   * @param storageKey - Key to use for localStorage (defaults to cv-builder-state)
   */
  const createBlurHandler = useCallback(
    (saveFunction: () => any, storageKey: string = "cv-builder-state") => {
      return () => {
        const currentState = saveFunction();
        saveToLocalStorage(storageKey, currentState);
      };
    },
    [saveToLocalStorage]
  );

  /**
   * Enhanced onChange handler that includes blur save functionality
   * @param originalOnChange - The original onChange handler
   * @param saveFunction - Function that gets the current state to save
   * @param storageKey - Key to use for localStorage
   */
  const createEnhancedChangeHandler = useCallback(
    (
      originalOnChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => void,
      saveFunction: () => any,
      storageKey: string = "cv-builder-state"
    ) => {
      return {
        onChange: originalOnChange,
        onBlur: createBlurHandler(saveFunction, storageKey),
      };
    },
    [createBlurHandler]
  );

  return {
    saveToLocalStorage,
    createBlurHandler,
    createEnhancedChangeHandler,
  };
}
