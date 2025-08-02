"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Target,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  FileText,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { useAlertModal } from "@/components/ui/alert-modal";
import type { CVData } from "./cv-builder";

interface ATSScoreProps {
  cvData?: CVData;
  language?: "en" | "ar";
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
  improvementNotes: string[];
  missingElements: string[];
  strengths: string[];
}

const translations = {
  en: {
    atsScore: "ATS Score",
    analyzeNow: "Analyze ATS Score",
    analyzing: "Analyzing...",
    reanalyze: "Re-analyze",
    yourScore: "Your ATS Score",
    outOf100: "out of 100",
    excellent: "Excellent",
    good: "Good",
    needsImprovement: "Needs Improvement",
    toReach100: "To reach 100% score:",
    categories: "Score Breakdown",
    strengths: "What's Working Well",
    improvements: "Key Improvements Needed",
    overallFeedback: "Overall Assessment",
    showSuggestions: "Show Suggestions",
    improvementSuggestions: "Improvement Suggestions",
    closeDialog: "Close",
  },
  ar: {
    atsScore: "نقاط ATS",
    analyzeNow: "تحليل نقاط ATS",
    analyzing: "جاري التحليل...",
    reanalyze: "إعادة التحليل",
    yourScore: "نقاطك في ATS",
    outOf100: "من 100",
    excellent: "ممتاز",
    good: "جيد",
    needsImprovement: "يحتاج تحسين",
    toReach100: "للوصول إلى نقاط 100%:",
    categories: "تفصيل النقاط",
    strengths: "ما يعمل بشكل جيد",
    improvements: "التحسينات المطلوبة",
    overallFeedback: "التقييم العام",
    showSuggestions: "عرض الاقتراحات",
    improvementSuggestions: "اقتراحات التحسين",
    closeDialog: "إغلاق",
  },
};
export function ATSScore({ cvData, language = "en" }: ATSScoreProps) {
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestionsDialog, setShowSuggestionsDialog] = useState(false);
  const { showAlert, AlertModalComponent } = useAlertModal();

  const t = translations[language];

  const analyzeATS = async () => {
    if (!cvData) {
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/ai-ats-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvData,
          language,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("ATS API error response:", errorText);
        throw new Error(`ATS analysis failed: ${response.status}`);
      }

      const analysis = await response.json();

      // Normalize the response structure to handle different API response formats
      const normalizedAnalysis = {
        atsScore: analysis.score || analysis.atsScore || 0,
        overallFeedback: analysis.feedback || analysis.overallFeedback || "",
        categories: analysis.categories || {},
        improvementNotes:
          analysis.improvements || analysis.improvementNotes || [],
        missingElements: analysis.missingElements || [],
        strengths: analysis.strengths || [],
        suggestions: analysis.suggestions || [],
      };

      setAtsAnalysis(normalizedAnalysis);
    } catch (error) {
      console.error("Error analyzing ATS:", error);
      showAlert(
        language === "ar" ? "خطأ" : "Error",
        language === "ar"
          ? "فشل في تحليل ATS. يرجى المحاولة مرة أخرى."
          : "Failed to analyze ATS. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-analyze when component mounts
  useEffect(() => {
    if (cvData && !atsAnalysis) {
      analyzeATS();
    }
  }, [cvData]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreStatus = (score: number) => {
    if (score >= 85) return t.excellent;
    if (score >= 70) return t.good;
    return t.needsImprovement;
  };

  const getScoreBackgroundColor = (score: number) => {
    if (score >= 85)
      return "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800";
    if (score >= 70)
      return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800";
    return "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800";
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="flex flex-col w-full h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="w-4 h-4 text-blue-500" />
          {t.atsScore}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col p-4">
        {!atsAnalysis && isAnalyzing ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="text-center">
              <RefreshCw className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
              <h3 className="text-lg font-semibold mb-2">{t.analyzing}</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                {language === "ar"
                  ? "جاري تحليل سيرتك الذاتية للحصول على أفضل نتائج ATS..."
                  : "Analyzing your resume for optimal ATS performance..."}
              </p>
            </div>
          </div>
        ) : !atsAnalysis ? (
          <div className="flex flex-col items-center justify-center space-y-4 py-8">
            <div className="text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">Get Your ATS Score</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Analyze your resume against ATS systems and get AI-powered
                improvement suggestions.
              </p>
            </div>

            <Button
              onClick={analyzeATS}
              disabled={isAnalyzing || !cvData}
              className="w-full max-w-sm"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {t.analyzing}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {t.analyzeNow}
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Score Display */}
            <div
              className={`p-6 rounded-xl border-2 ${getScoreBackgroundColor(
                atsAnalysis.atsScore
              )}`}
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span
                    className={`text-4xl font-bold ${getScoreColor(
                      atsAnalysis.atsScore
                    )}`}
                  >
                    {atsAnalysis.atsScore}
                  </span>
                  <span className="text-lg text-muted-foreground ml-1">
                    /100
                  </span>
                </div>
                <div
                  className={`text-sm font-medium mb-3 ${getScoreColor(
                    atsAnalysis.atsScore
                  )}`}
                >
                  {getScoreStatus(atsAnalysis.atsScore)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(
                      atsAnalysis.atsScore
                    )}`}
                    style={{ width: `${atsAnalysis.atsScore}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {atsAnalysis.overallFeedback}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-2">
              <Button
                onClick={analyzeATS}
                disabled={isAnalyzing}
                variant="outline"
                size="sm"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    {t.analyzing}
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t.reanalyze}
                  </>
                )}
              </Button>

              {atsAnalysis.improvementNotes &&
                atsAnalysis.improvementNotes.length > 0 && (
                  <Dialog
                    open={showSuggestionsDialog}
                    onOpenChange={setShowSuggestionsDialog}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="default"
                        size="sm"
                        className="text-xs px-2"
                      >
                        <Lightbulb className="w-3 h-3 mr-1" />
                        {t.showSuggestions}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-blue-500" />
                          {t.improvementSuggestions}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            {t.toReach100}
                          </h4>
                          <ul className="space-y-3">
                            {atsAnalysis.improvementNotes.map((note, index) => (
                              <li
                                key={index}
                                className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-3 p-3 bg-white dark:bg-blue-900/30 rounded-md border border-blue-100 dark:border-blue-700"
                              >
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                                  {index + 1}
                                </span>
                                <span className="flex-1">{note}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            onClick={() => setShowSuggestionsDialog(false)}
                            variant="outline"
                          >
                            {t.closeDialog}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
            </div>

            {/* Strengths */}
            {atsAnalysis.strengths && atsAnalysis.strengths.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2 text-green-700 dark:text-green-300">
                  <CheckCircle className="w-4 h-4" />
                  {t.strengths}
                </h4>
                <ul className="space-y-1">
                  {atsAnalysis.strengths.slice(0, 3).map((strength, index) => (
                    <li
                      key={index}
                      className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2"
                    >
                      <CheckCircle className="w-3 h-3" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Missing Elements */}
            {atsAnalysis.missingElements &&
              atsAnalysis.missingElements.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2 text-orange-700 dark:text-orange-300">
                    <AlertTriangle className="w-4 h-4" />
                    {t.improvements}
                  </h4>
                  <ul className="space-y-1">
                    {atsAnalysis.missingElements
                      .slice(0, 3)
                      .map((element, index) => (
                        <li
                          key={index}
                          className="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-2"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          {element}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

            {/* Category Breakdown */}
            {atsAnalysis.categories &&
              typeof atsAnalysis.categories === "object" &&
              Object.keys(atsAnalysis.categories).length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    {t.categories}
                  </h4>
                  <div className="space-y-3">
                    {Object.entries(atsAnalysis.categories || {})
                      .slice(0, 4)
                      .map(([category, data]) => (
                        <div
                          key={category}
                          className="bg-white dark:bg-gray-800/50 border rounded-lg p-3"
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
                          <Progress value={data.score} className="h-2" />
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </div>
        )}
      </CardContent>

      <AlertModalComponent />
    </Card>
  );
}
