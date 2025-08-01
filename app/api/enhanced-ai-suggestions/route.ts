import { type NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";

const EnhancedSuggestionSchema = z.object({
  suggestions: z.array(
    z.object({
      id: z.union([z.string(), z.number()]).transform((val) => String(val)),
      type: z.enum(["improvement", "keyword", "format"]),
      title: z.string(),
      description: z.string(),
      section: z.string(),
      applied: z.boolean().default(false),
      fieldPath: z.string().optional(), // Path to the field in CV data
      originalText: z.string().optional(), // Current text
      suggestedText: z.string().optional(), // Suggested replacement
      priority: z.enum(["high", "medium", "low"]).default("medium"),
    })
  ),
  atsScore: z.number().min(0).max(100),
  overallFeedback: z.string(),
});

function extractTextFromCVField(cvData: any, fieldPath: string): string {
  const parts = fieldPath.split(".");
  let current = cvData;

  for (const part of parts) {
    if (current && typeof current === "object") {
      // Handle array indices like "experience.0.description"
      if (/^\d+$/.test(part)) {
        current = current[parseInt(part)];
      } else {
        current = current[part];
      }
    } else {
      return "";
    }
  }

  return typeof current === "string" ? current : "";
}

function generateSpecificSuggestions(cvData: any, language: string = "en") {
  const suggestions: any[] = [];
  let suggestionId = 1;

  // Check personal info summary
  if (cvData?.personalInfo?.summary) {
    const summary = cvData.personalInfo.summary;
    if (summary.length < 50 || !summary.includes("years")) {
      suggestions.push({
        id: String(suggestionId++),
        type: "improvement",
        title:
          language === "ar"
            ? "تحسين الملخص المهني"
            : "Enhance Professional Summary",
        description:
          language === "ar"
            ? "أضف سنوات الخبرة والتخصصات الرئيسية إلى ملخصك المهني"
            : "Add years of experience and key specializations to your professional summary",
        section: language === "ar" ? "المعلومات الشخصية" : "Personal Info",
        fieldPath: "personalInfo.summary",
        originalText: summary,
        suggestedText:
          language === "ar"
            ? `${summary} مع خبرة تزيد عن X سنوات في [تخصصك] وإنجازات مثبتة في [مجال خبرتك الرئيسي].`
            : `${summary} With X+ years of experience in [your specialization] and proven achievements in [your key area of expertise].`,
        priority: "high",
      });
    }
  }

  // Check experience descriptions for quantification
  if (cvData?.experience && Array.isArray(cvData.experience)) {
    cvData.experience.forEach((exp: any, index: number) => {
      if (exp.description && typeof exp.description === "string") {
        const hasNumbers = /\d/.test(exp.description);
        const hasPercentage = /%/.test(exp.description);
        const hasActionVerbs =
          /^(Led|Managed|Developed|Implemented|Achieved|Increased|Improved|Created)/i.test(
            exp.description
          );

        if (!hasNumbers && !hasPercentage) {
          suggestions.push({
            id: String(suggestionId++),
            type: "improvement",
            title:
              language === "ar"
                ? "أضف إنجازات مقيسة"
                : "Add Quantified Achievements",
            description:
              language === "ar"
                ? `أضف أرقاماً ومقاييس محددة لوصف منصب ${
                    exp.position || "الوظيفة"
                  }`
                : `Add specific numbers and metrics to ${
                    exp.position || "position"
                  } description`,
            section: language === "ar" ? "الخبرة" : "Experience",
            fieldPath: `experience.${index}.description`,
            originalText: exp.description,
            suggestedText:
              language === "ar"
                ? `${exp.description} حقق [X%] تحسن في [المقياس] وإدارة فريق من [X] أشخاص.`
                : `${exp.description} Achieved [X%] improvement in [metric] and managed team of [X] people.`,
            priority: "high",
          });
        }

        if (!hasActionVerbs) {
          suggestions.push({
            id: String(suggestionId++),
            type: "improvement",
            title:
              language === "ar"
                ? "استخدم أفعال عمل قوية"
                : "Use Strong Action Verbs",
            description:
              language === "ar"
                ? `ابدأ وصف منصب ${exp.position || "الوظيفة"} بفعل عمل قوي`
                : `Start ${
                    exp.position || "position"
                  } description with strong action verb`,
            section: language === "ar" ? "الخبرة" : "Experience",
            fieldPath: `experience.${index}.description`,
            originalText: exp.description,
            suggestedText:
              language === "ar"
                ? `قاد/طور/نفذ/حقق ${exp.description.toLowerCase()}`
                : `Led/Developed/Implemented/Achieved ${exp.description.toLowerCase()}`,
            priority: "medium",
          });
        }
      }
    });
  }

  // Check skills section
  if (cvData?.skills) {
    const technicalSkills = cvData.skills.technical || [];
    if (technicalSkills.length < 5) {
      suggestions.push({
        id: String(suggestionId++),
        type: "keyword",
        title: language === "ar" ? "أضف مهارات تقنية" : "Add Technical Skills",
        description:
          language === "ar"
            ? "أضف المزيد من المهارات التقنية ذات الصلة بصناعتك"
            : "Add more technical skills relevant to your industry",
        section: language === "ar" ? "المهارات" : "Skills",
        fieldPath: "skills.technical",
        originalText: technicalSkills.join(", "),
        suggestedText:
          language === "ar"
            ? `${technicalSkills.join(
                ", "
              )}, [مهارة تقنية 1], [مهارة تقنية 2], [مهارة تقنية 3]`
            : `${technicalSkills.join(
                ", "
              )}, [Technical Skill 1], [Technical Skill 2], [Technical Skill 3]`,
        priority: "medium",
      });
    }
  }

  // Check for missing professional summary
  if (
    !cvData?.personalInfo?.summary ||
    cvData.personalInfo.summary.length < 20
  ) {
    suggestions.push({
      id: String(suggestionId++),
      type: "format",
      title: language === "ar" ? "أضف ملخص مهني" : "Add Professional Summary",
      description:
        language === "ar"
          ? "أضف ملخصاً مهنياً قوياً في بداية سيرتك الذاتية"
          : "Add a strong professional summary at the top of your resume",
      section: language === "ar" ? "المعلومات الشخصية" : "Personal Info",
      fieldPath: "personalInfo.summary",
      originalText: cvData?.personalInfo?.summary || "",
      suggestedText:
        language === "ar"
          ? "محترف ذو خبرة في [مجالك] مع سجل حافل في [إنجازاتك الرئيسية]. خبرة X+ سنوات في [تخصصك] مع إنجازات مثبتة في [مجال الخبرة]."
          : "Experienced [your field] professional with a proven track record in [your key achievements]. X+ years of expertise in [your specialization] with demonstrated accomplishments in [expertise area].",
      priority: "high",
    });
  }

  return suggestions;
}

export async function POST(request: NextRequest) {
  let language = "en";

  try {
    const {
      cvData,
      jobDescription,
      language: requestLanguage = "en",
    } = await request.json();
    language = requestLanguage;

    // Generate specific actionable suggestions
    const specificSuggestions = generateSpecificSuggestions(cvData, language);

    const isArabic = language === "ar";

    const enhancedPrompt = isArabic
      ? `
أنت خبير استشاري في أنظمة تتبع المتقدمين (ATS) ومستشار مهني بخبرة تزيد عن 15 عامًا. حلل السيرة الذاتية وقدم اقتراحات محددة وقابلة للتطبيق.

بيانات السيرة الذاتية:
${JSON.stringify(cvData, null, 2)}

${jobDescription ? `وصف الوظيفة المستهدفة:\n${jobDescription}\n` : ""}

قم بتحليل السيرة الذاتية وتقديم اقتراحات مع النصوص البديلة المحددة. ركز على:

1. الاقتراحات المحددة مع النصوص البديلة الفعلية
2. مسارات الحقول في بيانات السيرة الذاتية (مثل "personalInfo.summary", "experience.0.description")  
3. النص الأصلي والنص المقترح للاستبدال

أعطي الأولوية للتحسينات التالية:
- إضافة إنجازات مقيسة بأرقام محددة
- تحسين أفعال العمل والمصطلحات المهنية
- إضافة كلمات مفتاحية خاصة بالصناعة
- تحسين التنسيق لأنظمة ATS

يجب أن تتضمن كل اقتراح:
- معرف فريد (نص)
- نوع (improvement/keyword/format)
- عنوان واضح
- وصف مفصل  
- قسم السيرة الذاتية
- مسار الحقل (إن أمكن)
- النص الأصلي
- النص المقترح للاستبدال
- الأولوية (high/medium/low)
`
      : `
You are an expert ATS consultant and career advisor with 15+ years of experience. Analyze the CV and provide specific, actionable suggestions.

CV DATA:
${JSON.stringify(cvData, null, 2)}

${jobDescription ? `TARGET JOB DESCRIPTION:\n${jobDescription}\n` : ""}

Analyze the CV and provide suggestions with specific replacement texts. Focus on:

1. Specific suggestions with actual replacement text
2. Field paths in the CV data (like "personalInfo.summary", "experience.0.description")
3. Original text and suggested text for replacement

Prioritize these improvements:
- Adding quantified achievements with specific numbers
- Improving action verbs and professional terminology  
- Adding industry-specific keywords
- Optimizing formatting for ATS systems

Each suggestion should include:
- Unique ID (string)
- Type (improvement/keyword/format)
- Clear title
- Detailed description
- CV section
- Field path (if applicable)
- Original text
- Suggested replacement text
- Priority (high/medium/low)
`;

    const responseFormat = isArabic
      ? `
يرجى إرجاع ردك بتنسيق JSON التالي:
{
  "suggestions": [
    {
      "id": "1",
      "type": "improvement|keyword|format",
      "title": "عنوان الاقتراح",
      "description": "وصف مفصل",
      "section": "قسم السيرة الذاتية",
      "fieldPath": "مسار الحقل في البيانات",
      "originalText": "النص الحالي",
      "suggestedText": "النص المقترح",
      "priority": "high|medium|low",
      "applied": false
    }
  ],
  "atsScore": 75,
  "overallFeedback": "التقييم الشامل..."
}
`
      : `
Please return your response in the following JSON format:
{
  "suggestions": [
    {
      "id": "1", 
      "type": "improvement|keyword|format",
      "title": "Suggestion title",
      "description": "Detailed description",
      "section": "CV section name",
      "fieldPath": "path.to.field.in.data",
      "originalText": "Current text",
      "suggestedText": "Suggested replacement",
      "priority": "high|medium|low",
      "applied": false
    }
  ],
  "atsScore": 75,
  "overallFeedback": "Overall assessment..."
}
`;

    try {
      const result = await generateObject({
        model: groq("llama-3.3-70b-versatile"),
        schema: EnhancedSuggestionSchema,
        prompt: enhancedPrompt + responseFormat,
        temperature: 0.7,
      });

      // Merge AI suggestions with our specific suggestions
      const combinedSuggestions = [
        ...specificSuggestions,
        ...result.object.suggestions.map((s, index) => ({
          ...s,
          id: String(specificSuggestions.length + index + 1), // Ensure unique IDs
        })),
      ];

      return NextResponse.json({
        suggestions: combinedSuggestions,
        atsScore: result.object.atsScore,
        overallFeedback: result.object.overallFeedback,
      });
    } catch (aiError) {
      console.error("AI generation error:", aiError);
      // Return fallback with our specific suggestions
      const fallbackResponse = {
        suggestions: specificSuggestions,
        atsScore: 65,
        overallFeedback: isArabic
          ? "تم إنشاء اقتراحات أساسية. لتحليل أكثر تفصيلاً، يرجى المحاولة مرة أخرى."
          : "Basic suggestions generated. For more detailed analysis, please try again.",
      };

      return NextResponse.json(fallbackResponse);
    }
  } catch (error) {
    console.error("Error in enhanced AI suggestions:", error);

    const errorMessage =
      language === "ar"
        ? "حدث خطأ في تحليل السيرة الذاتية. يرجى المحاولة مرة أخرى."
        : "An error occurred while analyzing your CV. Please try again.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
