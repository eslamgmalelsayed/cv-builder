import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Lightbulb, Check, X, Loader2 } from "lucide-react";
import { useAutocompletion } from "@/hooks/use-autocompletion";
import { cn } from "@/lib/utils";

interface AIInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  field: string;
  context?: any;
  onValueChange?: (value: string) => void;
  variant?: "input" | "textarea";
  language?: "en" | "ar";
}

interface AITextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  field: string;
  context?: any;
  onValueChange?: (value: string) => void;
  language?: "en" | "ar";
}

const translations = {
  en: {
    aiSuggestion: "AI Suggestion",
    accept: "Accept",
    dismiss: "Dismiss",
    generating: "Generating suggestion...",
  },
  ar: {
    aiSuggestion: "اقتراح الذكاء الاصطناعي",
    accept: "قبول",
    dismiss: "رفض",
    generating: "جاري إنشاء الاقتراح...",
  },
};

export function AIInput({
  field,
  context,
  onValueChange,
  variant = "input",
  language = "en",
  className,
  ...props
}: AIInputProps) {
  const [value, setValue] = useState((props.value as string) || "");
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  const {
    suggestion,
    isLoading,
    showSuggestion,
    getSuggestion,
    acceptSuggestion,
    dismissSuggestion,
  } = useAutocompletion({
    debounceMs: 800,
    minLength: 3,
  });

  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value as string);
    }
  }, [props.value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setCursorPosition(e.target.selectionStart || 0);
    onValueChange?.(newValue);

    // Get AI suggestion if there's meaningful content
    if (newValue.trim().length >= 3) {
      getSuggestion(newValue, field, context);
    }
  };

  const handleAcceptSuggestion = () => {
    setValue(suggestion);
    onValueChange?.(suggestion);
    acceptSuggestion();

    // Focus back to input
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(suggestion.length, suggestion.length);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestion) {
      if (e.key === "Tab" || (e.key === "Enter" && e.ctrlKey)) {
        e.preventDefault();
        handleAcceptSuggestion();
      } else if (e.key === "Escape") {
        dismissSuggestion();
      }
    }
  };

  return (
    <div className="relative">
      <Input
        {...props}
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className={cn(
          "pr-8",
          isLoading && "border-blue-300",
          showSuggestion && "border-green-300",
          className
        )}
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
        </div>
      )}

      {/* AI suggestion indicator */}
      {!isLoading && showSuggestion && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <Lightbulb className="w-4 h-4 text-green-500" />
        </div>
      )}

      {/* Suggestion popup */}
      {showSuggestion && suggestion && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-green-300 rounded-md shadow-lg z-50 p-3">
          <div className="flex items-start gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-green-700 mb-1">
                {t.aiSuggestion}
              </p>
              <p className="text-sm text-gray-900 leading-relaxed">
                {suggestion}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={handleAcceptSuggestion}
              className="text-xs px-2 py-1 h-auto"
            >
              <Check className="w-3 h-3 mr-1" />
              {t.accept}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={dismissSuggestion}
              className="text-xs px-2 py-1 h-auto"
            >
              <X className="w-3 h-3 mr-1" />
              {t.dismiss}
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Press Tab or Ctrl+Enter to accept, Esc to dismiss
          </div>
        </div>
      )}
    </div>
  );
}

export function AITextarea({
  field,
  context,
  onValueChange,
  language = "en",
  className,
  ...props
}: AITextareaProps) {
  const [value, setValue] = useState((props.value as string) || "");
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
    debounceMs: 1000,
    minLength: 5,
  });

  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value as string);
    }
  }, [props.value]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    onValueChange?.(newValue);

    // Get AI suggestion for longer content
    if (newValue.trim().length >= 5) {
      // Get the current line or last sentence for context-aware suggestions
      const lines = newValue.split("\n");
      const currentLine = lines[lines.length - 1];
      if (currentLine.trim().length >= 3) {
        getSuggestion(currentLine, field, { ...context, fullText: newValue });
      }
    }
  };

  const handleAcceptSuggestion = () => {
    // Append suggestion to current value
    const newValue = value + (value.endsWith(" ") ? "" : " ") + suggestion;
    setValue(newValue);
    onValueChange?.(newValue);
    acceptSuggestion();

    // Focus back to textarea
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(newValue.length, newValue.length);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestion) {
      if (e.key === "Tab" || (e.key === "Enter" && e.ctrlKey)) {
        e.preventDefault();
        handleAcceptSuggestion();
      } else if (e.key === "Escape") {
        dismissSuggestion();
      }
    }
  };

  return (
    <div className="relative">
      <Textarea
        {...props}
        ref={textareaRef}
        value={value}
        onChange={handleTextareaChange}
        onKeyDown={handleKeyDown}
        className={cn(
          "pr-8",
          isLoading && "border-blue-300",
          showSuggestion && "border-green-300",
          className
        )}
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute right-2 top-3">
          <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
        </div>
      )}

      {/* AI suggestion indicator */}
      {!isLoading && showSuggestion && (
        <div className="absolute right-2 top-3">
          <Lightbulb className="w-4 h-4 text-green-500" />
        </div>
      )}

      {/* Suggestion popup */}
      {showSuggestion && suggestion && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-green-300 rounded-md shadow-lg z-50 p-3">
          <div className="flex items-start gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-green-700 mb-1">
                {t.aiSuggestion}
              </p>
              <p className="text-sm text-gray-900 leading-relaxed">
                {suggestion}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="default"
              onClick={handleAcceptSuggestion}
              className="text-xs px-2 py-1 h-auto"
            >
              <Check className="w-3 h-3 mr-1" />
              {t.accept}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={dismissSuggestion}
              className="text-xs px-2 py-1 h-auto"
            >
              <X className="w-3 h-3 mr-1" />
              {t.dismiss}
            </Button>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Press Tab or Ctrl+Enter to accept, Esc to dismiss
          </div>
        </div>
      )}
    </div>
  );
}
