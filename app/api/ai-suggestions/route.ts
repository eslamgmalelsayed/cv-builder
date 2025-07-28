import { type NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";

const SuggestionSchema = z.object({
  suggestions: z.array(
    z.object({
      id: z.union([z.string(), z.number()]).transform((val) => String(val)),
      type: z.enum(["improvement", "keyword", "format"]),
      title: z.string(),
      description: z.string(),
      section: z.string(),
      applied: z.boolean().default(false),
    })
  ),
  atsScore: z.number().min(0).max(100),
  overallFeedback: z.string(),
});

export async function POST(request: NextRequest) {
  let language = "en"; // Default language

  try {
    const {
      cvData,
      jobDescription,
      language: requestLanguage = "en",
    } = await request.json();
    language = requestLanguage; // Set the actual language from request

    // Create language-specific prompts
    const isArabic = language === "ar";

    const basePrompt = isArabic
      ? `
أنت خبير استشاري في أنظمة تتبع المتقدمين (ATS) ومستشار مهني بخبرة تزيد عن 15 عامًا في مساعدة الباحثين عن عمل على تحسين سيرهم الذاتية لكل من أنظمة ATS والمجندين البشريين.

حلل بيانات السيرة الذاتية التالية وقدم اقتراحات محددة وقابلة للتطبيق لتحسين التوافق مع ATS والفعالية الشاملة.

بيانات السيرة الذاتية:
${JSON.stringify(cvData, null, 2)}

${jobDescription ? `وصف الوظيفة المستهدفة:\n${jobDescription}\n` : ""}

متطلبات التحليل:
1. قدم 3-6 اقتراحات محددة وقابلة للتطبيق مصنفة كالتالي:
   - "keyword": كلمات مفتاحية مفقودة من الصناعة، مصطلحات تقنية، أو لغة خاصة بالوظيفة
   - "improvement" : ""}

متطلبات التحليل:
1. قدم 3-6 اقتراحات محددة وقابلة للتطبيق مصنفة كالتالي:
   - "keyword": كلمات مفتاحية مفقودة من الصناعة، مصطلحات تقنية، أو لغة خاصة بالوظيفة
   - "improvement": تحسينات المحتوى، التقدير الكمي، بيانات التأثير، أو أوصاف أفضل
   - "format": تنسيق متوافق مع ATS، تنظيم الأقسام، أو تحسينات هيكلية

2. احسب نقاط التوافق مع ATS (0-100) بناءً على:
   - تحسين الكلمات المفتاحية
   - هيكل الأقسام والعناوين
   - اكتمال المحتوى
   - الإنجازات القابلة للقياس
   - استخدام اللغة المهنية

3. قدم ملخص التقييم الشامل

مجالات التركيز:
- التوافق مع تحليل ATS (تنسيق بسيط، عناوين معيارية)
- المصطلحات والكلمات المفتاحية المعيارية في الصناعة
- الإنجازات القابلة للقياس مع المقاييس/الأرقام
- أفعال العمل ولغة التأثير المركزة
- تحسين الملخص المهني
- كثافة الكلمات المفتاحية في قسم المهارات
- أوصاف الخبرة مع نتائج قابلة للقياس
${jobDescription ? "- التوافق مع متطلبات وصف الوظيفة المقدم" : ""}

مهم: أرجع الاقتراحات بمعرفات نصية (مثل "1"، "2"، "3"، إلخ) وتأكد من أن كل اقتراح محدد وقابل للتطبيق.
`
      : `
You are an expert ATS (Applicant Tracking System) consultant and career advisor with 15+ years of experience helping job seekers optimize their resumes for both ATS systems and human recruiters.

Analyze the following CV data and provide specific, actionable suggestions to improve ATS compatibility and overall effectiveness.

CV DATA:
${JSON.stringify(cvData, null, 2)}

${jobDescription ? `TARGET JOB DESCRIPTION:\n${jobDescription}\n` : ""}

ANALYSIS REQUIREMENTS:
1. Provide 3-6 specific, actionable suggestions categorized as:
   - "keyword": Missing industry keywords, technical terms, or job-specific language
   - "improvement": Content enhancements, quantification, impact statements, or better descriptions  
   - "format": ATS-friendly formatting, section organization, or structural improvements

2. Calculate an ATS compatibility score (0-100) based on:
   - Keyword optimization
   - Section structure and headings
   - Content completeness
   - Quantifiable achievements
   - Professional language usage

3. Provide overall feedback summary

FOCUS AREAS:
- ATS parsing compatibility (simple formatting, standard headings)
- Industry-standard terminology and keywords
- Quantifiable achievements with metrics/numbers
- Action verbs and impact-focused language
- Professional summary optimization
- Skills section keyword density
- Experience descriptions with measurable results
${
  jobDescription
    ? "- Alignment with the provided job description requirements"
    : ""
}

IMPORTANT: Return suggestions with string IDs (like "1", "2", "3", etc.) and ensure each suggestion is specific and actionable.
`;

    const responseFormat = isArabic
      ? `
يرجى إرجاع ردك بتنسيق JSON التالي:
{
  "suggestions": [
    {
      "id": "1",
      "type": "keyword|improvement|format",
      "title": "عنوان موجز",
      "description": "وصف مفصل",
      "section": "الخبرة|المهارات|المعلومات الشخصية|التعليم",
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
      "type": "keyword|improvement|format",
      "title": "Brief title",
      "description": "Detailed description",
      "section": "Experience|Skills|Personal Info|Education",
      "applied": false
    }
  ],
  "atsScore": 75,
  "overallFeedback": "Overall assessment..."
}
`;

    const prompt = basePrompt + responseFormat;

    const result = await generateObject({
      model: groq("llama-3.1-8b-instant"),
      schema: SuggestionSchema,
      prompt,
      temperature: 0.7,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error("Error generating AI suggestions:", error);

    // Return language-specific fallback response
    const isArabic = language === "ar";

    const fallbackResponse = {
      suggestions: isArabic
        ? [
            {
              id: "1",
              type: "improvement" as const,
              title: "إضافة إنجازات قابلة للقياس",
              description:
                "أدرج مقاييس وأرقام محددة في خبرتك العملية. مثال: 'زيادة المبيعات بنسبة 25%' أو 'إدارة فريق من 8 أشخاص'.",
              section: "الخبرة",
              applied: false,
            },
            {
              id: "2",
              type: "keyword" as const,
              title: "تحسين الكلمات المفتاحية",
              description:
                "أضف كلمات مفتاحية خاصة بالصناعة ومهارات تقنية توجد عادة في أوصاف الوظائف في مجالك.",
              section: "المهارات",
              applied: false,
            },
            {
              id: "3",
              type: "format" as const,
              title: "تحسين الملخص المهني",
              description:
                "تأكد من أن ملخصك المهني يتكون من 2-3 جمل ويتضمن سنوات خبرتك والتخصصات الرئيسية.",
              section: "المعلومات الشخصية",
              applied: false,
            },
            {
              id: "4",
              type: "improvement" as const,
              title: "استخدام أفعال العمل",
              description:
                "ابدأ كل نقطة في قسم الخبرة بأفعال عمل قوية مثل 'تطوير'، 'إدارة'، 'تنفيذ'، أو 'تحقيق'.",
              section: "الخبرة",
              applied: false,
            },
            {
              id: "5",
              type: "format" as const,
              title: "توحيد عناوين الأقسام",
              description:
                "استخدم عناوين أقسام معيارية متوافقة مع ATS مثل 'الخبرة العملية'، 'التعليم'، 'المهارات'، و'الملخص المهني'.",
              section: "المعلومات الشخصية",
              applied: false,
            },
          ]
        : [
            {
              id: "1",
              type: "improvement" as const,
              title: "Add Quantifiable Achievements",
              description:
                "Include specific metrics and numbers in your work experience. For example: 'Increased sales by 25%' or 'Managed a team of 8 people'.",
              section: "Experience",
              applied: false,
            },
            {
              id: "2",
              type: "keyword" as const,
              title: "Optimize Keywords",
              description:
                "Add industry-specific keywords and technical skills that are commonly found in job descriptions for your field.",
              section: "Skills",
              applied: false,
            },
            {
              id: "3",
              type: "format" as const,
              title: "Professional Summary Enhancement",
              description:
                "Ensure your professional summary is 2-3 sentences and includes your years of experience and key specializations.",
              section: "Personal Info",
              applied: false,
            },
            {
              id: "4",
              type: "improvement" as const,
              title: "Use Action Verbs",
              description:
                "Start each bullet point in your experience section with strong action verbs like 'Developed', 'Managed', 'Implemented', or 'Achieved'.",
              section: "Experience",
              applied: false,
            },
            {
              id: "5",
              type: "format" as const,
              title: "Standardize Section Headings",
              description:
                "Use standard ATS-friendly section headings like 'WORK EXPERIENCE', 'EDUCATION', 'SKILLS', and 'PROFESSIONAL SUMMARY'.",
              section: "Personal Info",
              applied: false,
            },
          ],
      atsScore: 65,
      overallFeedback: isArabic
        ? "سيرتك الذاتية لها هيكل جيد ولكن يمكن أن تستفيد من المزيد من الإنجازات القابلة للقياس والكلمات المفتاحية الخاصة بالصناعة. ركز على إضافة المقاييس إلى قسم الخبرة وتحسين مهاراتك لأنظمة ATS."
        : "Your CV has good structure but could benefit from more quantifiable achievements and industry-specific keywords. Focus on adding metrics to your experience section and optimizing your skills for ATS systems.",
    };

    return NextResponse.json(fallbackResponse);
  }
}
