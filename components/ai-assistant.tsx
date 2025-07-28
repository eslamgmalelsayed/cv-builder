"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Target,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  Lightbulb,
} from "lucide-react";
import { useAlertModal } from "@/components/ui/alert-modal";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
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
  }>;
  missingElements: string[];
  strengths: string[];
}

interface AIAssistantProps {
  cvData?: any;
  language?: "en" | "ar";
}

const translations = {
  en: {
    aiAssistant: "AI Assistant",
    chat: "Chat",
    atsAnalysis: "ATS Analysis",
    messagePlaceholder:
      "Ask me anything about your CV, career advice, or job search...",
    send: "Send",
    sending: "Sending...",
    typeMessage: "Type your message here...",
    analyzeCV: "Analyze CV",
    analyzing: "Analyzing...",
    atsScore: "ATS Score",
    overallScore: "Overall ATS Score",
    categories: "Category Scores",
    suggestions: "Priority Suggestions",
    strengths: "Strengths",
    missingElements: "Missing Elements",
    critical: "Critical",
    important: "Important",
    niceToHave: "Nice to Have",
    highImpact: "High Impact",
    mediumImpact: "Medium Impact",
    lowImpact: "Low Impact",
  },
  ar: {
    aiAssistant: "المساعد الذكي",
    chat: "محادثة",
    atsAnalysis: "تحليل ATS",
    messagePlaceholder:
      "اسألني أي شيء عن سيرتك الذاتية أو النصائح المهنية أو البحث عن وظيفة...",
    send: "إرسال",
    sending: "جاري الإرسال...",
    typeMessage: "اكتب رسالتك هنا...",
    analyzeCV: "تحليل السيرة الذاتية",
    analyzing: "جاري التحليل...",
    atsScore: "نقاط ATS",
    overallScore: "النقاط الإجمالية لـ ATS",
    categories: "نقاط الفئات",
    suggestions: "الاقتراحات ذات الأولوية",
    strengths: "نقاط القوة",
    missingElements: "العناصر المفقودة",
    critical: "حرج",
    important: "مهم",
    niceToHave: "مفيد",
    highImpact: "تأثير عالي",
    mediumImpact: "تأثير متوسط",
    lowImpact: "تأثير منخفض",
  },
};

export function AIAssistant({ cvData, language = "en" }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [atsAnalysis, setAtsAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { showAlert, AlertModalComponent } = useAlertModal();

  const t = translations[language];

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = currentMessage.trim();
    setCurrentMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            {
              role: "user",
              content: messageToSend,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse =
        data.choices?.[0]?.message?.content ||
        "Sorry, I couldn't generate a response.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling AI API:", error);
      showAlert(
        language === "ar" ? "خطأ" : "Error",
        language === "ar"
          ? "فشل في الاتصال بالمساعد الذكي. يرجى المحاولة مرة أخرى."
          : "Failed to connect to AI assistant. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeATS = async () => {
    if (!cvData || isAnalyzing) return;

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
        throw new Error(`ATS analysis failed: ${response.status}`);
      }

      const analysis = await response.json();
      setAtsAnalysis(analysis);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
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
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "important":
        return <TrendingUp className="w-4 h-4 text-yellow-500" />;
      default:
        return <Lightbulb className="w-4 h-4 text-blue-500" />;
    }
  };

  const getSuggestionBadgeColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-100 text-red-700 border-red-200";
      case "important":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-500" />
          {t.aiAssistant}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <Tabs defaultValue="chat" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              {t.chat}
            </TabsTrigger>
            <TabsTrigger value="ats" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              {t.atsAnalysis}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="flex-1 flex flex-col mt-4">
            {/* Chat Interface */}
            <div className="flex-1 max-h-96 overflow-y-auto mb-4 space-y-4 border rounded-lg p-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Bot className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">{t.messagePlaceholder}</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0">
                      <Bot className="w-6 h-6 text-blue-500" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white border shadow-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-1 opacity-70 ${
                        message.role === "user"
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {message.role === "user" && (
                    <div className="flex-shrink-0">
                      <User className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <Bot className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="bg-white border shadow-sm rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={t.typeMessage}
                className="flex-1 min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!currentMessage.trim() || isLoading}
                size="sm"
                className="px-3"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="ats" className="flex-1 flex flex-col mt-4">
            {/* ATS Analysis Interface */}
            <div className="space-y-4">
              <Button
                onClick={analyzeATS}
                disabled={isAnalyzing || !cvData}
                className="w-full"
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

              {atsAnalysis && (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
                    <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      {t.overallScore}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Progress
                          value={atsAnalysis.atsScore}
                          className="h-3"
                        />
                      </div>
                      <span
                        className={`text-2xl font-bold ${getScoreColor(
                          atsAnalysis.atsScore
                        )}`}
                      >
                        {atsAnalysis.atsScore}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {atsAnalysis.overallFeedback}
                    </p>
                  </div>

                  {/* Category Scores */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      {t.categories}
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(atsAnalysis.categories).map(
                        ([category, data]) => (
                          <div
                            key={category}
                            className="bg-white border rounded-lg p-3"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium capitalize">
                                {category}
                              </span>
                              <span
                                className={`font-semibold ${getScoreColor(
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

                  {/* Priority Suggestions */}
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      {t.suggestions}
                    </h4>
                    <div className="space-y-3">
                      {atsAnalysis.prioritySuggestions.map((suggestion) => (
                        <div
                          key={suggestion.id}
                          className="bg-white border rounded-lg p-3"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              {getSuggestionIcon(suggestion.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-medium text-sm">
                                  {suggestion.title}
                                </h5>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getSuggestionBadgeColor(
                                    suggestion.type
                                  )}`}
                                >
                                  {t[suggestion.type as keyof typeof t]}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {suggestion.section}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {suggestion.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths and Missing Elements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        {t.strengths}
                      </h4>
                      <ul className="space-y-1">
                        {atsAnalysis.strengths.map((strength, index) => (
                          <li
                            key={index}
                            className="text-sm text-green-600 flex items-center gap-2"
                          >
                            <CheckCircle className="w-3 h-3" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2 text-orange-700">
                        <AlertTriangle className="w-4 h-4" />
                        {t.missingElements}
                      </h4>
                      <ul className="space-y-1">
                        {atsAnalysis.missingElements.map((element, index) => (
                          <li
                            key={index}
                            className="text-sm text-orange-600 flex items-center gap-2"
                          >
                            <AlertTriangle className="w-3 h-3" />
                            {element}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <AlertModalComponent />
    </Card>
  );
}
