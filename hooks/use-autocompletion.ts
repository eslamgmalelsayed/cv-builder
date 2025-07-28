import { useState, useCallback, useRef } from "react";

interface AutocompleteHookProps {
  onSuggestion?: (suggestion: string) => void;
  debounceMs?: number;
  minLength?: number;
}

interface AutocompleteResult {
  suggestion: string;
  isLoading: boolean;
  showSuggestion: boolean;
  getSuggestion: (text: string, field: string, context?: any) => void;
  acceptSuggestion: () => void;
  dismissSuggestion: () => void;
}

export function useAutocompletion({
  onSuggestion,
  debounceMs = 500,
  minLength = 3,
}: AutocompleteHookProps = {}): AutocompleteResult {
  const [suggestion, setSuggestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  const getSuggestion = useCallback(
    async (text: string, field: string, context?: any) => {
      // Clear existing timeout and abort previous requests
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Reset states
      setShowSuggestion(false);
      setSuggestion("");

      // Don't suggest for very short text
      if (text.length < minLength) {
        return;
      }

      // Don't suggest if text ends with punctuation (likely complete)
      if (/[.!?;:]$/.test(text.trim())) {
        return;
      }

      // Debounce the API call
      timeoutRef.current = setTimeout(async () => {
        setIsLoading(true);
        abortControllerRef.current = new AbortController();

        try {
          const response = await fetch("/api/ai-autocomplete", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: text.trim(),
              field,
              context,
            }),
            signal: abortControllerRef.current.signal,
          });

          if (!response.ok) {
            throw new Error("Failed to get suggestion");
          }

          const data = await response.json();
          const suggestionText = data.suggestion?.trim();

          if (suggestionText && suggestionText !== text.trim()) {
            setSuggestion(suggestionText);
            setShowSuggestion(true);
            onSuggestion?.(suggestionText);
          }
        } catch (error) {
          if (error instanceof Error && error.name !== "AbortError") {
            console.error("Autocompletion error:", error);
          }
        } finally {
          setIsLoading(false);
        }
      }, debounceMs);
    },
    [debounceMs, minLength, onSuggestion]
  );

  const acceptSuggestion = useCallback(() => {
    setShowSuggestion(false);
    setSuggestion("");
  }, []);

  const dismissSuggestion = useCallback(() => {
    setShowSuggestion(false);
    setSuggestion("");
  }, []);

  return {
    suggestion,
    isLoading,
    showSuggestion,
    getSuggestion,
    acceptSuggestion,
    dismissSuggestion,
  };
}
