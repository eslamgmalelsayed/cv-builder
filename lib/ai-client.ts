// Client-side AI service for GitHub Pages deployment
// This replaces server-side API routes with direct client calls

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Note: In production, you should use environment variables or a proxy service
// to avoid exposing API keys on the client side
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY;

interface CVData {
  personalInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    summary?: string;
  };
  experience?: Array<{
    position?: string;
    company?: string;
    description?: string;
    startDate?: string;
    endDate?: string;
  }>;
  skills?: {
    technical?: string[];
    soft?: string[];
  };
  education?: Array<{
    degree?: string;
    institution?: string;
    year?: string;
  }>;
}

interface AISuggestion {
  id: string;
  type: "improvement" | "keyword" | "format";
  title: string;
  description: string;
  section: string;
  applied: boolean;
  fieldPath?: string;
  originalText?: string;
  suggestedText?: string;
  priority: "high" | "medium" | "low";
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

// Generate specific suggestions without AI (fallback)
function generateSpecificSuggestions(cvData: CVData, language: string = "en"): AISuggestion[] {
  const suggestions: AISuggestion[] = [];
  let suggestionId = 1;

  // Check personal info summary
  if (cvData?.personalInfo?.summary) {
    const summary = cvData.personalInfo.summary;
    if (summary.length < 50 || !summary.includes("years")) {
      suggestions.push({
        id: String(suggestionId++),
        type: "improvement",
        title: language === "ar" ? "تحسين الملخص المهني" : "Enhance Professional Summary",
        description: language === "ar" 
          ? "أضف سنوات الخبرة والتخصصات الرئيسية إلى ملخصك المهني"
          : "Add years of experience and key specializations to your professional summary",
        section: language === "ar" ? "المعلومات الشخصية" : "Personal Info",
        applied: false,
        fieldPath: "personalInfo.summary",
        originalText: summary,
        suggestedText: language === "ar"
          ? `${summary} مع خبرة تزيد عن X سنوات في [تخصصك] وإنجازات مثبتة في [مجال خبرتك الرئيسي].`
          : `${summary} With X+ years of experience in [your specialization] and proven achievements in [your key area of expertise].`,
        priority: "high",
      });
    }
  }

  // Check experience descriptions for quantification
  if (cvData?.experience && Array.isArray(cvData.experience)) {
    cvData.experience.forEach((exp, index) => {
      if (exp.description && typeof exp.description === "string") {
        const hasNumbers = /\d/.test(exp.description);
        const hasPercentage = /%/.test(exp.description);
        const hasActionVerbs = /^(Led|Managed|Developed|Implemented|Achieved|Increased|Improved|Created)/i.test(exp.description);

        if (!hasNumbers && !hasPercentage) {
          suggestions.push({
            id: String(suggestionId++),
            type: "improvement",
            title: language === "ar" ? "أضف إنجازات مقيسة" : "Add Quantified Achievements",
            description: language === "ar"
              ? `أضف أرقاماً ومقاييس محددة لوصف منصب ${exp.position || "الوظيفة"}`
              : `Add specific numbers and metrics to ${exp.position || "position"} description`,
            section: language === "ar" ? "الخبرة" : "Experience",
            applied: false,
            fieldPath: `experience.${index}.description`,
            originalText: exp.description,
            suggestedText: language === "ar"
              ? `${exp.description} حقق [X%] تحسن في [المقياس] وإدارة فريق من [X] أشخاص.`
              : `${exp.description} Achieved [X%] improvement in [metric] and managed team of [X] people.`,
            priority: "high",
          });
        }

        if (!hasActionVerbs) {
          suggestions.push({
            id: String(suggestionId++),
            type: "improvement",
            title: language === "ar" ? "استخدم أفعال عمل قوية" : "Use Strong Action Verbs",
            description: language === "ar"
              ? `ابدأ وصف منصب ${exp.position || "الوظيفة"} بفعل عمل قوي`
              : `Start ${exp.position || "position"} description with strong action verb`,
            section: language === "ar" ? "الخبرة" : "Experience",
            applied: false,
            fieldPath: `experience.${index}.description`,
            originalText: exp.description,
            suggestedText: language === "ar"
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
        description: language === "ar"
          ? "أضف المزيد من المهارات التقنية ذات الصلة بصناعتك"
          : "Add more technical skills relevant to your industry",
        section: language === "ar" ? "المهارات" : "Skills",
        applied: false,
        fieldPath: "skills.technical",
        originalText: technicalSkills.join(", "),
        suggestedText: language === "ar"
          ? `${technicalSkills.join(", ")}, [مهارة تقنية 1], [مهارة تقنية 2], [مهارة تقنية 3]`
          : `${technicalSkills.join(", ")}, [Technical Skill 1], [Technical Skill 2], [Technical Skill 3]`,
        priority: "medium",
      });
    }
  }

  return suggestions;
}

// Calculate basic ATS score
function calculateATSScore(cvData: CVData): number {
  let score = 0;
  let maxScore = 100;

  // Personal info completeness (20 points)
  if (cvData?.personalInfo?.name) score += 5;
  if (cvData?.personalInfo?.email) score += 5;
  if (cvData?.personalInfo?.phone) score += 5;
  if (cvData?.personalInfo?.summary && cvData.personalInfo.summary.length > 50) score += 5;

  // Experience section (40 points)
  if (cvData?.experience && cvData.experience.length > 0) {
    score += 10;
    const hasQuantifiedAchievements = cvData.experience.some(exp => 
      exp.description && /\d/.test(exp.description)
    );
    if (hasQuantifiedAchievements) score += 15;
    const hasActionVerbs = cvData.experience.some(exp =>
      exp.description && /^(Led|Managed|Developed|Implemented|Achieved|Increased|Improved|Created)/i.test(exp.description)
    );
    if (hasActionVerbs) score += 15;
  }

  // Skills section (20 points)
  if (cvData?.skills?.technical && cvData.skills.technical.length >= 3) score += 10;
  if (cvData?.skills?.soft && cvData.skills.soft.length >= 3) score += 10;

  // Education section (20 points)
  if (cvData?.education && cvData.education.length > 0) score += 20;

  return Math.min(score, maxScore);
}

// Client-side AI Analysis (with fallback to local analysis)
export async function analyzeCV(cvData: CVData, language: string = "en"): Promise<ATSAnalysis> {
  try {
    // If no API key is provided, use local analysis
    if (!GROQ_API_KEY) {
      return analyzeCVLocally(cvData, language);
    }

    const isArabic = language === "ar";
    const prompt = isArabic ? `
أنت خبير في أنظمة تتبع المتقدمين (ATS). حلل السيرة الذاتية التالية وقدم تقييماً شاملاً:

${JSON.stringify(cvData, null, 2)}

قدم تحليلاً يشمل:
1. نقاط ATS (0-100)
2. تقييم شامل
3. نقاط القوة
4. العناصر المفقودة
5. اقتراحات ذات أولوية

أجب بصيغة JSON.
` : `
You are an ATS expert. Analyze the following CV and provide a comprehensive assessment:

${JSON.stringify(cvData, null, 2)}

Provide analysis including:
1. ATS Score (0-100)
2. Overall feedback
3. Strengths
4. Missing elements
5. Priority suggestions

Respond in JSON format.
`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;
    
    // Parse AI response and format as ATSAnalysis
    // This is a simplified version - you might want to add more robust parsing
    const parsedResponse = JSON.parse(aiResponse);
    
    return {
      atsScore: parsedResponse.atsScore || calculateATSScore(cvData),
      overallFeedback: parsedResponse.overallFeedback || "CV analysis completed successfully.",
      categories: parsedResponse.categories || {
        content: {
          score: calculateATSScore(cvData),
          feedback: "Basic content analysis completed.",
          suggestions: ["Add more quantified achievements", "Use stronger action verbs"]
        }
      },
      prioritySuggestions: parsedResponse.prioritySuggestions || [],
      missingElements: parsedResponse.missingElements || ["Professional summary", "Quantified achievements"],
      strengths: parsedResponse.strengths || ["Clear structure", "Complete contact information"]
    };

  } catch (error) {
    console.error('AI analysis failed, using local analysis:', error);
    return analyzeCVLocally(cvData, language);
  }
}

// Local analysis fallback
function analyzeCVLocally(cvData: CVData, language: string = "en"): ATSAnalysis {
  const atsScore = calculateATSScore(cvData);
  const isArabic = language === "ar";
  
  return {
    atsScore,
    overallFeedback: isArabic 
      ? "تم إجراء تحليل أساسي لسيرتك الذاتية. لتحليل أكثر تفصيلاً، تحتاج إلى إعداد مفتاح API للذكاء الاصطناعي."
      : "Basic CV analysis completed. For more detailed analysis, you need to set up an AI API key.",
    categories: {
      content: {
        score: atsScore,
        feedback: isArabic ? "تحليل المحتوى الأساسي" : "Basic content analysis",
        suggestions: isArabic 
          ? ["أضف المزيد من الإنجازات المقيسة", "استخدم أفعال عمل أقوى"]
          : ["Add more quantified achievements", "Use stronger action verbs"]
      }
    },
    prioritySuggestions: generateSpecificSuggestions(cvData, language).slice(0, 3).map(s => ({
      id: s.id,
      type: s.priority === "high" ? "critical" : s.priority === "medium" ? "important" : "nice-to-have" as const,
      section: s.section,
      title: s.title,
      description: s.description,
      impact: s.priority as "high" | "medium" | "low",
      originalText: s.originalText,
      suggestedText: s.suggestedText,
      fieldPath: s.fieldPath
    })),
    missingElements: atsScore < 60 
      ? (isArabic ? ["ملخص مهني", "إنجازات مقيسة", "مهارات تقنية"] : ["Professional summary", "Quantified achievements", "Technical skills"])
      : [],
    strengths: atsScore > 70 
      ? (isArabic ? ["هيكل واضح", "معلومات اتصال كاملة"] : ["Clear structure", "Complete contact information"])
      : []
  };
}

// Enhanced AI Suggestions (client-side)
export async function getEnhancedSuggestions(cvData: CVData, language: string = "en"): Promise<{
  suggestions: AISuggestion[];
  atsScore: number;
  overallFeedback: string;
}> {
  try {
    // Generate local suggestions as fallback
    const localSuggestions = generateSpecificSuggestions(cvData, language);
    
    // If no API key, return local suggestions
    if (!GROQ_API_KEY) {
      return {
        suggestions: localSuggestions,
        atsScore: calculateATSScore(cvData),
        overallFeedback: language === "ar" 
          ? "تم إنشاء اقتراحات أساسية. لاقتراحات الذكاء الاصطناعي المتقدمة، تحتاج إلى إعداد مفتاح API."
          : "Basic suggestions generated. For advanced AI suggestions, you need to set up an API key."
      };
    }

    // Try to get AI suggestions if API key is available
    const isArabic = language === "ar";
    const prompt = isArabic ? `
حلل السيرة الذاتية وقدم اقتراحات محددة للتحسين:

${JSON.stringify(cvData, null, 2)}

قدم اقتراحات محددة مع النصوص البديلة لكل حقل.
` : `
Analyze the CV and provide specific improvement suggestions:

${JSON.stringify(cvData, null, 2)}

Provide specific suggestions with replacement texts for each field.
`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API failed: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;
    const parsedResponse = JSON.parse(aiResponse);
    
    // Combine AI suggestions with local ones
    const aiSuggestions = parsedResponse.suggestions || [];
    const combinedSuggestions = [
      ...localSuggestions,
      ...aiSuggestions.map((s: any, index: number) => ({
        ...s,
        id: String(localSuggestions.length + index + 1),
        applied: false
      }))
    ];

    return {
      suggestions: combinedSuggestions,
      atsScore: parsedResponse.atsScore || calculateATSScore(cvData),
      overallFeedback: parsedResponse.overallFeedback || "Enhanced suggestions generated successfully."
    };

  } catch (error) {
    console.error('AI suggestions failed, using local suggestions:', error);
    const localSuggestions = generateSpecificSuggestions(cvData, language);
    return {
      suggestions: localSuggestions,
      atsScore: calculateATSScore(cvData),
      overallFeedback: language === "ar" 
        ? "تم إنشاء اقتراحات أساسية بسبب خطأ في الذكاء الاصطناعي."
        : "Basic suggestions generated due to AI error."
    };
  }
}
