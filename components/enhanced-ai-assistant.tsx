"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Target,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  Lightbulb,
  Wand2,
  Check,
  X,
} from "lucide-react";
import { useAlertModal } from "@/components/ui/alert-modal";

interface AISuggestion {
  id: string;
  type: "keyword" | "improvement" | "format";
  title: string;
  description: string;
  section: string;
  applied: boolean;
  originalText?: string;
  suggestedText?: string;
  fieldPath?: string; // Path to the field in CV data (e.g., "personalInfo.summary", "experience.0.description")
}

interface ATSAnalysis {
  atsScore: number;
  overallFeedback: string;
  categories: {
    [key: string]: {
      score: number;
      feedback: string;
      suggestions: string[];
    };
  };
  prioritySuggestions: Array<{
    id: string;
    type: "critical" | "important" | "nice-to-have";
    section: string;
    title: string;
    description: string;
    impact: "high" | "medium" | "low";
    originalText?: string;
    suggestedText?: string;
    fieldPath?: string;
  }>;
  missingElements: string[];
  strengths: string[];
}

interface EnhancedAIAssistantProps {
  cvData?: any;
  language?: "en" | "ar";
  onApplySuggestion?: (
    fieldPath: string,
    newValue: string,
    suggestionId: string
  ) => void;
}

const translations = {
  en: {
    aiAssistant: "AI Assistant",
    atsAnalysis: "ATS Analysis",
    analyzeCV: "Analyze CV",
    analyzing: "Analyzing...",
    atsScore: "ATS Score",
    overallScore: "Overall ATS Score",
    categories: "Category Scores",
    suggestions: "AI Suggestions",
    prioritySuggestions: "Priority Suggestions",
    strengths: "Strengths",
    missingElements: "Missing Elements",
    critical: "Critical",
    important: "Important",
    niceToHave: "Nice to Have",
    highImpact: "High Impact",
    mediumImpact: "Medium Impact",
    lowImpact: "Low Impact",
    applySuggestion: "Apply",
    applySuggestionTooltip: "Apply this suggestion to your CV",
    suggestionApplied: "Applied",
    revertSuggestion: "Revert",
    viewSuggestion: "View Details",
    applyAll: "Apply All Suggestions",
    revertAll: "Revert All",
    suggestionsCount: "suggestions",
    noSuggestions: "No suggestions available",
    analyzing_message:
      "Analyzing your CV for ATS optimization and content improvements...",
  },
  ar: {
    aiAssistant: "المساعد الذكي",
    atsAnalysis: "تحليل ATS",
    analyzeCV: "تحليل السيرة الذاتية",
    analyzing: "جاري التحليل...",
    atsScore: "نقاط ATS",
    overallScore: "النقاط الإجمالية لـ ATS",
    categories: "نقاط الفئات",
    suggestions: "اقتراحات الذكاء الاصطناعي",
    prioritySuggestions: "الاقتراحات ذات الأولوية",
    strengths: "نقاط القوة",
    missingElements: "العناصر المفقودة",
    critical: "حرج",
    important: "مهم",
    niceToHave: "مفيد",
    highImpact: "تأثير عالي",
    mediumImpact: "تأثير متوسط",
    lowImpact: "تأثير منخفض",
    applySuggestion: "تطبيق",
    applySuggestionTooltip: "تطبيق هذا الاقتراح على سيرتك الذاتية",
    suggestionApplied: "مُطبق",
    revertSuggestion: "تراجع",
    viewSuggestion: "عرض التفاصيل",
    applyAll: "تطبيق جميع الاقتراحات",
    revertAll: "تراجع عن الكل",
    suggestionsCount: "اقتراحات",
    noSuggestions: "لا توجد اقتراحات متاحة",
    analyzing_message: "جاري تحليل سيرتك الذاتية لتحسين ATS والمحتوى...",
  },
};

export function EnhancedAIAssistant({
  cvData,
  language = "en",
  onApplySuggestion,
}: EnhancedAIAssistantProps) {
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(
    null
  );
  const { showAlert, AlertModalComponent } = useAlertModal();

  const t = translations[language];

  const analyzeCV = async () => {
    if (!cvData || isAnalyzing) return;

    setIsAnalyzing(true);
    try {
      // First get ATS analysis
      const atsResponse = await fetch("/api/ai-ats-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvData,
          language,
        }),
      });

      if (!atsResponse.ok) {
        throw new Error(`ATS analysis failed: ${atsResponse.status}`);
      }

      const atsAnalysis = await atsResponse.json();
      setAtsAnalysis(atsAnalysis);

      // Then get detailed suggestions
      const suggestionsResponse = await fetch("/api/enhanced-ai-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvData,
          language,
        }),
      });

      if (!suggestionsResponse.ok) {
        throw new Error(`Suggestions failed: ${suggestionsResponse.status}`);
      }

      const suggestionsData = await suggestionsResponse.json();
      setSuggestions(suggestionsData.suggestions || []);
    } catch (error) {
      console.error("Error analyzing CV:", error);
      showAlert(
        language === "ar" ? "خطأ" : "Error",
        language === "ar"
          ? "فشل في تحليل السيرة الذاتية. يرجى المحاولة مرة أخرى."
          : "Failed to analyze CV. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestion = (suggestionId: string) => {
    const suggestion = suggestions.find((s) => s.id === suggestionId);
    if (
      !suggestion ||
      !suggestion.fieldPath ||
      !suggestion.suggestedText ||
      !onApplySuggestion
    ) {
      return;
    }

    onApplySuggestion(
      suggestion.fieldPath,
      suggestion.suggestedText,
      suggestionId
    );

    setSuggestions((prev) =>
      prev.map((s) => (s.id === suggestionId ? { ...s, applied: true } : s))
    );
  };

  const revertSuggestion = (suggestionId: string) => {
    const suggestion = suggestions.find((s) => s.id === suggestionId);
    if (
      !suggestion ||
      !suggestion.fieldPath ||
      !suggestion.originalText ||
      !onApplySuggestion
    ) {
      return;
    }

    onApplySuggestion(
      suggestion.fieldPath,
      suggestion.originalText,
      suggestionId
    );

    setSuggestions((prev) =>
      prev.map((s) => (s.id === suggestionId ? { ...s, applied: false } : s))
    );
  };

  const applyAllSuggestions = () => {
    suggestions.forEach((suggestion) => {
      if (
        !suggestion.applied &&
        suggestion.fieldPath &&
        suggestion.suggestedText &&
        onApplySuggestion
      ) {
        onApplySuggestion(
          suggestion.fieldPath,
          suggestion.suggestedText,
          suggestion.id
        );
      }
    });

    setSuggestions((prev) => prev.map((s) => ({ ...s, applied: true })));
  };

  const revertAllSuggestions = () => {
    suggestions.forEach((suggestion) => {
      if (
        suggestion.applied &&
        suggestion.fieldPath &&
        suggestion.originalText &&
        onApplySuggestion
      ) {
        onApplySuggestion(
          suggestion.fieldPath,
          suggestion.originalText,
          suggestion.id
        );
      }
    });

    setSuggestions((prev) => prev.map((s) => ({ ...s, applied: false })));
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "keyword":
        return <Sparkles className="w-4 h-4 text-blue-500" />;
      case "improvement":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "format":
        return <FileText className="w-4 h-4 text-orange-500" />;
      default:
        return <Lightbulb className="w-4 h-4 text-purple-500" />;
    }
  };

  const getSuggestionBadgeColor = (type: string) => {
    switch (type) {
      case "keyword":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "improvement":
        return "bg-green-100 text-green-700 border-green-200";
      case "format":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-purple-100 text-purple-700 border-purple-200";
    }
  };

  const appliedCount = suggestions.filter((s) => s.applied).length;
  const totalCount = suggestions.length;

  return (
    <Card className="w-full max-w-md mx-auto lg:max-w-none lg:mx-0">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Wand2 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          {t.aiAssistant}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="analysis" className="text-xs sm:text-sm">
              {t.atsAnalysis}
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="text-xs sm:text-sm">
              <span className="hidden sm:inline">{t.suggestions}</span>
              <span className="sm:hidden">Suggestions</span>
              {totalCount > 0 && (
                <span className="ml-1 text-xs">
                  ({appliedCount}/{totalCount})
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-4">
            {!atsAnalysis ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-6 sm:py-8 px-4">
                <div className="text-center">
                  <Target className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">
                    Get Your ATS Score
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                    {t.analyzing_message}
                  </p>
                </div>

                <Button
                  onClick={analyzeCV}
                  disabled={isAnalyzing || !cvData}
                  className="w-full max-w-sm"
                  size="lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      {t.analyzing}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      {t.analyzeCV}
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-4 rounded-lg border">
                  <h3 className="font-semibold text-base sm:text-lg mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                    {t.overallScore}
                  </h3>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <div className="flex-1">
                      <Progress
                        value={atsAnalysis.atsScore}
                        className="h-2 sm:h-3"
                      />
                    </div>
                    <span
                      className={`text-xl sm:text-2xl font-bold ${getScoreColor(
                        atsAnalysis.atsScore
                      )}`}
                    >
                      {atsAnalysis.atsScore}%
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-2">
                    {atsAnalysis.overallFeedback}
                  </p>
                </div>

                {/* Category Scores */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {t.categories}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(atsAnalysis.categories).map(
                      ([category, data]) => (
                        <div
                          key={category}
                          className="bg-white border rounded-lg p-3"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium capitalize text-sm">
                              {category}
                            </span>
                            <span
                              className={`font-semibold text-sm ${getScoreColor(
                                data.score
                              )}`}
                            >
                              {data.score}%
                            </span>
                          </div>
                          <Progress value={data.score} className="h-2 mb-2" />
                          <p className="text-xs text-gray-600">
                            {data.feedback}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Reanalyze Button */}
                <Button
                  onClick={analyzeCV}
                  disabled={isAnalyzing}
                  variant="outline"
                  className="w-full max-w-sm mx-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      {t.analyzing}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Re-analyze
                    </>
                  )}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            {suggestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-6 sm:py-8 px-4">
                <Lightbulb className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">
                  {t.noSuggestions}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-6 max-w-sm text-center">
                  {language === "ar"
                    ? "قم بتحليل سيرتك الذاتية أولاً للحصول على اقتراحات مخصصة"
                    : "Analyze your CV first to get personalized suggestions"}
                </p>
                <Button
                  onClick={analyzeCV}
                  disabled={isAnalyzing || !cvData}
                  className="max-w-sm"
                >
                  {isAnalyzing ? t.analyzing : t.analyzeCV}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Action Buttons */}
                <div className="flex flex-col xs:flex-row gap-2 w-full">
                  <Button
                    onClick={applyAllSuggestions}
                    disabled={appliedCount === totalCount}
                    size="sm"
                    className="flex-1 min-w-0 px-2 sm:px-4 py-2"
                  >
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm truncate">
                      {t.applyAll}
                    </span>
                  </Button>
                  <Button
                    onClick={revertAllSuggestions}
                    disabled={appliedCount === 0}
                    variant="outline"
                    size="sm"
                    className="flex-1 min-w-0 px-2 sm:px-4 py-2"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
                    <span className="text-xs sm:text-sm truncate">
                      {t.revertAll}
                    </span>
                  </Button>
                </div>

                {/* Suggestions List */}
                <div className="space-y-3">
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className={`border rounded-lg p-3 sm:p-4 transition-all ${
                        suggestion.applied
                          ? "bg-green-50 border-green-200"
                          : "bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-2 sm:gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getSuggestionIcon(suggestion.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                            <h5 className="font-medium text-xs sm:text-sm break-words">
                              {suggestion.title}
                            </h5>
                            <Badge
                              variant="outline"
                              className={`text-xs shrink-0 ${getSuggestionBadgeColor(
                                suggestion.type
                              )}`}
                            >
                              {suggestion.type}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="text-xs shrink-0"
                            >
                              {suggestion.section}
                            </Badge>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-3">
                            {suggestion.description}
                          </p>

                          {/* Show original vs suggested text if available */}
                          {suggestion.originalText &&
                            suggestion.suggestedText && (
                              <div className="space-y-2 text-xs mb-3">
                                <div className="p-2 bg-red-50 border border-red-200 rounded">
                                  <span className="font-medium text-red-700">
                                    Original:
                                  </span>
                                  <p className="text-red-600 mt-1 break-words">
                                    {suggestion.originalText}
                                  </p>
                                </div>
                                <div className="p-2 bg-green-50 border border-green-200 rounded">
                                  <span className="font-medium text-green-700">
                                    Suggested:
                                  </span>
                                  <p className="text-green-600 mt-1 break-words">
                                    {suggestion.suggestedText}
                                  </p>
                                </div>
                              </div>
                            )}

                          <div className="flex flex-col sm:flex-row gap-2 mt-3">
                            {!suggestion.applied ? (
                              <Button
                                size="sm"
                                onClick={() => applySuggestion(suggestion.id)}
                                disabled={
                                  !suggestion.fieldPath ||
                                  !suggestion.suggestedText
                                }
                                className="w-full sm:w-auto"
                              >
                                <Wand2 className="w-3 h-3 mr-1" />
                                <span className="text-xs">
                                  {t.applySuggestion}
                                </span>
                              </Button>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  disabled
                                  className="w-full sm:w-auto"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  <span className="text-xs">
                                    {t.suggestionApplied}
                                  </span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    revertSuggestion(suggestion.id)
                                  }
                                  className="w-full sm:w-auto"
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  <span className="text-xs">
                                    {t.revertSuggestion}
                                  </span>
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <AlertModalComponent />
    </Card>
  );
}
