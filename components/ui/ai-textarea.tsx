"use client";

import React, { useState, useRef, useEffect, forwardRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAutocompletion } from "@/hooks/use-autocompletion";
import { Check, X, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AITextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  field: string;
  context?: any;
  onValueChange?: (value: string) => void;
  debounceMs?: number;
  language?: "en" | "ar";
}

const translations = {
  en: {
    aiSuggestion: "AI Suggestion",
    accept: "Accept",
    dismiss: "Dismiss",
    generating: "Generating...",
  },
  ar: {
    aiSuggestion: "اقتراح الذكي",
    accept: "قبول",
    dismiss: "رفض",
    generating: "جاري التوليد...",
  },
};

export const AITextarea = forwardRef<HTMLTextAreaElement, AITextareaProps>(
  (
    {
      field,
      context,
      onValueChange,
      onChange,
      value,
      debounceMs = 1000,
      language = "en",
      className,
      ...props
    },
    ref
  ) => {
    const [currentValue, setCurrentValue] = useState(value || "");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const t = translations[language];

    const {
      suggestion,
      isLoading,
      showSuggestion,
      getSuggestion,
      acceptSuggestion,
      dismissSuggestion,
    } = useAutocompletion({
      debounceMs,
    });

    // Trigger AI suggestion when text changes
    useEffect(() => {
      if (currentValue && typeof currentValue === "string") {
        const trimmedValue = currentValue.trim();
        if (trimmedValue.length >= 10) {
          // Only suggest for longer text
          getSuggestion(trimmedValue, field, context);
        }
      }
    }, [currentValue, field, context, getSuggestion]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setCurrentValue(newValue);
      onValueChange?.(newValue);
      onChange?.(e);
    };

    const handleAcceptSuggestion = () => {
      if (suggestion) {
        const newValue = suggestion;
        setCurrentValue(newValue);
        onValueChange?.(newValue);
        acceptSuggestion();

        // Focus back to textarea
        textareaRef.current?.focus();
      }
    };

    const handleDismissSuggestion = () => {
      dismissSuggestion();
      textareaRef.current?.focus();
    };

    // Handle keyboard shortcuts
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (showSuggestion) {
        if (e.key === "Tab" && !e.shiftKey) {
          e.preventDefault();
          handleAcceptSuggestion();
        } else if (e.key === "Escape") {
          e.preventDefault();
          handleDismissSuggestion();
        }
      }
      props.onKeyDown?.(e);
    };

    return (
      <div className="relative">
        <Textarea
          ref={(element) => {
            if (ref) {
              if (typeof ref === "function") {
                ref(element);
              } else {
                (
                  ref as React.MutableRefObject<HTMLTextAreaElement | null>
                ).current = element;
              }
            }
            (
              textareaRef as React.MutableRefObject<HTMLTextAreaElement | null>
            ).current = element;
          }}
          {...props}
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(
            className,
            showSuggestion && "border-blue-300 ring-1 ring-blue-200"
          )}
        />

        {/* AI Loading Indicator */}
        {isLoading && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="text-xs">{t.generating}</span>
            </Badge>
          </div>
        )}

        {/* AI Suggestion Popup */}
        {showSuggestion && suggestion && (
          <div className="absolute top-full mt-2 left-0 right-0 z-50">
            <div className="bg-white border border-blue-200 rounded-lg shadow-lg p-3 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">
                  {t.aiSuggestion}
                </span>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded p-3">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {suggestion}
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDismissSuggestion}
                  className="flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  {t.dismiss}
                </Button>
                <Button
                  size="sm"
                  onClick={handleAcceptSuggestion}
                  className="flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  {t.accept}
                </Button>
              </div>

              <div className="text-xs text-gray-500 border-t pt-2">
                Press{" "}
                <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                  Tab
                </kbd>{" "}
                to accept or{" "}
                <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                  Esc
                </kbd>{" "}
                to dismiss
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

AITextarea.displayName = "AITextarea";
