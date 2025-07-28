"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User } from "lucide-react";
import { useAlertModal } from "@/components/ui/alert-modal";
import type { AIAIAssistantProps } from "./ai-assistant-props";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIAssistantProps extends AIAIAssistantProps {
  language?: "en" | "ar";
}

const translations = {
  en: {
    aiAssistant: "AI Assistant",
    messagePlaceholder:
      "Ask me anything about your CV, career advice, or job search...",
    send: "Send",
    sending: "Sending...",
    typeMessage: "Type your message here...",
  },
  ar: {
    aiAssistant: "المساعد الذكي",
    messagePlaceholder:
      "اسألني أي شيء عن سيرتك الذاتية أو النصائح المهنية أو البحث عن وظيفة...",
    send: "إرسال",
    sending: "جاري الإرسال...",
    typeMessage: "اكتب رسالتك هنا...",
  },
};
export function AIAssistant({ language = "en" }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    setCurrentMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful AI assistant specialized in CV writing, career advice, and job search guidance. Provide clear, actionable advice to help users improve their resumes and career prospects.",
              },
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
              {
                role: "user",
                content: currentMessage.trim(),
              },
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        }
      );

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
      console.error("Error calling Groq API:", error);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
        {/* Messages Container */}
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
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p
                  className={`text-xs mt-1 opacity-70 ${
                    message.role === "user" ? "text-blue-100" : "text-gray-500"
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
      </CardContent>
      <AlertModalComponent />
    </Card>
  );
}

export function AIAssistant({
  cvData,
  onSuggestionApply,
  language = "en",
}: AIAssistantProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [atsScore, setAtsScore] = useState<number>(0);
  const [overallFeedback, setOverallFeedback] = useState<string>("");
  const { showAlert, AlertModalComponent } = useAlertModal();

  const t = translations[language];

  const analyzeCV = async () => {
    setIsAnalyzing(true);
    setSuggestions([]);
    setAtsScore(0);
    setOverallFeedback("");

    try {
      const response = await fetch("/api/ai-suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvData,
          jobDescription: jobDescription.trim() || null,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI suggestions");
      }

      const result = await response.json();
      setSuggestions(result.suggestions || []);
      setAtsScore(result.atsScore || 0);
      setOverallFeedback(result.overallFeedback || "");
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      showAlert(
        language === "ar" ? "خطأ" : "Error",
        language === "ar"
          ? "فشل في الحصول على اقتراحات الذكاء الاصطناعي. يرجى المحاولة مرة أخرى."
          : "Failed to get AI suggestions. Please try again.",
        language === "ar" ? "موافق" : "OK"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySuggestion = (suggestionId: string) => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === suggestionId ? { ...s, applied: true } : s))
    );
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "keyword":
        return <Sparkles className="w-4 h-4 text-blue-500" />;
      case "improvement":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "format":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Lightbulb className="w-4 h-4 text-purple-500" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case "keyword":
        return "bg-blue-50 border-blue-200";
      case "improvement":
        return "bg-green-50 border-green-200";
      case "format":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-purple-50 border-purple-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          {t.aiAssistant}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            {t.jobDescription}
          </label>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder={t.jobDescriptionPlaceholder}
            rows={4}
            className="textarea-clean"
          />
        </div>

        <Button
          onClick={analyzeCV}
          disabled={isAnalyzing}
          className="w-full flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {t.analyzing}
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {t.analyzeCV}
            </>
          )}
        </Button>

        {suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">{t.aiSuggestions}</h4>
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`p-4 rounded-lg border ${getSuggestionColor(
                  suggestion.type
                )} ${suggestion.applied ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getSuggestionIcon(suggestion.type)}
                      <h5 className="font-medium text-sm">
                        {suggestion.title}
                      </h5>
                      <Badge variant="outline" className="text-xs">
                        {suggestion.section}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {suggestion.description}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={suggestion.applied ? "secondary" : "default"}
                    onClick={() => applySuggestion(suggestion.id)}
                    disabled={suggestion.applied}
                  >
                    {suggestion.applied ? t.applied : t.apply}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">
            {t.atsOptimizationScore}
          </h4>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  atsScore >= 80
                    ? "bg-green-500"
                    : atsScore >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${atsScore}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{atsScore}%</span>
          </div>
          {overallFeedback && (
            <p className="text-sm text-gray-600">{overallFeedback}</p>
          )}
          {!overallFeedback && atsScore === 0 && (
            <p className="text-sm text-gray-600">{t.clickAnalyze}</p>
          )}
        </div>
      </CardContent>
      <AlertModalComponent />
    </Card>
  );
}
