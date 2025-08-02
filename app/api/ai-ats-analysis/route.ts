import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { cvData, language = "en" } = await request.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ API key not configured" },
        { status: 500 }
      );
    }

    // Create comprehensive CV analysis prompt
    const prompt = createATSAnalysisPrompt(cvData, language);

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are an expert ATS (Applicant Tracking System) analyzer and CV optimization specialist. Analyze CVs and provide detailed scoring and improvement suggestions. Always respond with valid JSON format.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 2000,
          temperature: 0.2,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API error:", errorData);
      return NextResponse.json(
        { error: "Failed to analyze CV" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const analysisText = data.choices?.[0]?.message?.content?.trim() || "";

    // Parse the AI response
    const analysis = parseATSAnalysis(analysisText, language);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Error in ATS analysis API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function createATSAnalysisPrompt(cvData: any, language: string) {
  const cvText = JSON.stringify(cvData, null, 2);

  const prompt = `
Analyze this CV for ATS (Applicant Tracking System) compliance and provide a comprehensive score with specific improvement notes.

CV Data:
${cvText}

Please provide your analysis in the following JSON format:

{
  "atsScore": 85,
  "overallFeedback": "Brief overall assessment in ${
    language === "ar" ? "Arabic" : "English"
  }",
  "categories": {
    "formatting": {
      "score": 90,
      "feedback": "Assessment of formatting"
    },
    "keywords": {
      "score": 80,
      "feedback": "Assessment of keywords"
    },
    "content": {
      "score": 85,
      "feedback": "Assessment of content quality"
    },
    "structure": {
      "score": 90,
      "feedback": "Assessment of CV structure"
    }
  },
  "improvementNotes": [
    "Add specific quantified achievements (e.g., 'Increased sales by 25%' instead of 'Increased sales')",
    "Include industry-specific keywords like [specific keywords based on CV content]",
    "Add a professional summary section at the top",
    "Use stronger action verbs like 'spearheaded', 'optimized', 'implemented'",
    "Add relevant technical skills section"
  ],
  "missingElements": ["Professional summary", "Quantified achievements", "Industry keywords"],
  "strengths": ["Clear job titles", "Good education section", "Consistent formatting"]
}

IMPORTANT INSTRUCTIONS:
1. The improvementNotes array should contain 3-7 specific, actionable items that tell the user EXACTLY what to change to reach 100% score
2. Each note should be specific to the user's CV content, not generic advice
3. Focus on the most impactful changes first
4. Be precise about what sections need what improvements
5. Include specific examples where possible
6. Write in ${language === "ar" ? "Arabic" : "English"}

Analyze the CV thoroughly considering:
1. ATS readability (simple formatting, standard section headers)
2. Keyword optimization (industry-relevant terms, skills)
3. Content quality (quantified achievements, action verbs)
4. Structure and completeness (all necessary sections present)
5. Professional presentation

The improvementNotes should be the primary focus - these are AI-generated suggestions that tell the user exactly what to do to reach 100%.
`;

  return prompt;
}

function parseATSAnalysis(analysisText: string, language: string) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback parsing if JSON is not properly formatted
    return {
      atsScore: 75,
      overallFeedback:
        language === "ar"
          ? "تحتاج سيرتك الذاتية إلى تحسينات لتحسين توافقها مع أنظمة ATS"
          : "Your CV needs improvements to enhance ATS compatibility",
      categories: {
        formatting: {
          score: 80,
          feedback:
            language === "ar"
              ? "التنسيق جيد بشكل عام"
              : "Formatting is generally good",
          suggestions: [
            language === "ar"
              ? "استخدم تنسيقاً بسيطاً"
              : "Use simple formatting",
            language === "ar" ? "تجنب الجداول المعقدة" : "Avoid complex tables",
          ],
        },
        keywords: {
          score: 70,
          feedback:
            language === "ar"
              ? "تحتاج إلى مزيد من الكلمات المفتاحية"
              : "Needs more relevant keywords",
          suggestions: [
            language === "ar"
              ? "أضف مهارات تقنية محددة"
              : "Add specific technical skills",
            language === "ar"
              ? "استخدم مصطلحات الصناعة"
              : "Use industry terminology",
          ],
        },
        content: {
          score: 75,
          feedback:
            language === "ar"
              ? "المحتوى جيد لكن يحتاج إلى مقاييس"
              : "Good content but needs metrics",
          suggestions: [
            language === "ar"
              ? "أضف أرقاماً ونتائج محددة"
              : "Add specific numbers and results",
            language === "ar"
              ? "استخدم أفعال إنجاز قوية"
              : "Use strong action verbs",
          ],
        },
        structure: {
          score: 85,
          feedback:
            language === "ar"
              ? "البنية واضحة ومنظمة"
              : "Structure is clear and organized",
          suggestions: [
            language === "ar"
              ? "أضف ملخصاً مهنياً"
              : "Add professional summary",
            language === "ar"
              ? "رتب الأقسام حسب الأهمية"
              : "Order sections by importance",
          ],
        },
      },
      prioritySuggestions: [
        {
          id: "1",
          type: "critical",
          section: language === "ar" ? "الخبرة" : "Experience",
          title:
            language === "ar"
              ? "أضف إنجازات مقيسة"
              : "Add Quantified Achievements",
          description:
            language === "ar"
              ? "أضف أرقاماً ومقاييس محددة في وصف وظائفك"
              : "Include specific numbers and metrics in your job descriptions",
          impact: "high",
        },
      ],
      missingElements: [
        language === "ar" ? "الملخص المهني" : "Professional summary",
        language === "ar" ? "الإنجازات المقيسة" : "Quantified achievements",
        language === "ar" ? "الكلمات المفتاحية للصناعة" : "Industry keywords",
      ],
      strengths: [
        language === "ar" ? "مسميات وظيفية واضحة" : "Clear job titles",
        language === "ar" ? "قسم تعليم جيد" : "Good education section",
        language === "ar" ? "تنسيق متسق" : "Consistent formatting",
      ],
    };
  } catch (error) {
    console.error("Error parsing ATS analysis:", error);
    return {
      atsScore: 75,
      overallFeedback: "Analysis completed with basic scoring",
      categories: {},
      prioritySuggestions: [],
      missingElements: [],
      strengths: [],
    };
  }
}
