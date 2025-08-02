const https = require('https');

// Helper function to make HTTPS requests
function makeHttpsRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            json: () => Promise.resolve(JSON.parse(body))
          });
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

function extractTextFromCVField(cvData, fieldPath) {
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

function generateSpecificSuggestions(cvData, language = "en") {
  const suggestions = [];
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
        applied: false,
      });
    }
  }

  // Check experience descriptions for quantification
  if (cvData?.experience && Array.isArray(cvData.experience)) {
    cvData.experience.forEach((exp, index) => {
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
                    exp.jobTitle || "الوظيفة"
                  }`
                : `Add specific numbers and metrics to ${
                    exp.jobTitle || "position"
                  } description`,
            section: language === "ar" ? "الخبرة" : "Experience",
            fieldPath: `experience.${index}.description`,
            originalText: exp.description,
            suggestedText:
              language === "ar"
                ? `${exp.description} حقق [X%] تحسن في [المقياس] وإدارة فريق من [X] أشخاص.`
                : `${exp.description} Achieved [X%] improvement in [metric] and managed team of [X] people.`,
            priority: "high",
            applied: false,
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
                ? `ابدأ وصف منصب ${exp.jobTitle || "الوظيفة"} بفعل عمل قوي`
                : `Start ${
                    exp.jobTitle || "position"
                  } description with strong action verb`,
            section: language === "ar" ? "الخبرة" : "Experience",
            fieldPath: `experience.${index}.description`,
            originalText: exp.description,
            suggestedText:
              language === "ar"
                ? `قاد/طور/نفذ/حقق ${exp.description.toLowerCase()}`
                : `Led/Developed/Implemented/Achieved ${exp.description.toLowerCase()}`,
            priority: "medium",
            applied: false,
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
        applied: false,
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
      applied: false,
    });
  }

  return suggestions;
}

exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  let language = "en";

  try {
    const {
      cvData,
      jobDescription,
      language: requestLanguage = "en",
    } = JSON.parse(event.body);
    language = requestLanguage;

    if (!process.env.GROQ_API_KEY) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: "GROQ API key not configured" }),
      };
    }

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
      const requestData = JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are an expert ATS consultant and career advisor. Provide detailed, actionable CV improvement suggestions in JSON format.",
          },
          {
            role: "user",
            content: enhancedPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 3000,
      });

      const options = {
        hostname: 'api.groq.com',
        port: 443,
        path: '/openai/v1/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestData)
        }
      };

      const response = await makeHttpsRequest('https://api.groq.com/openai/v1/chat/completions', options, requestData);

      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`);
      }

      const groqResponse = await response.json();
      const resultText = groqResponse.choices[0]?.message?.content;

      if (!resultText) {
        throw new Error("No response received from AI");
      }

      let aiResult;
      try {
        aiResult = JSON.parse(resultText);
      } catch {
        // If AI response is not valid JSON, create fallback structure
        aiResult = {
          suggestions: [],
          atsScore: 70,
          overallFeedback: resultText.substring(0, 500) + "..."
        };
      }

      // Merge AI suggestions with our specific suggestions
      const combinedSuggestions = [
        ...specificSuggestions,
        ...(aiResult.suggestions || []).map((s, index) => ({
          ...s,
          id: String(specificSuggestions.length + index + 1), // Ensure unique IDs
          applied: false,
        })),
      ];

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          suggestions: combinedSuggestions,
          atsScore: aiResult.atsScore || 70,
          overallFeedback: aiResult.overallFeedback || (isArabic 
            ? "تم إنشاء اقتراحات شاملة لتحسين سيرتك الذاتية."
            : "Comprehensive suggestions generated to improve your CV."),
        }),
      };
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

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(fallbackResponse),
      };
    }
  } catch (error) {
    console.error("Error in enhanced AI suggestions:", error);

    const errorMessage =
      language === "ar"
        ? "حدث خطأ في تحليل السيرة الذاتية. يرجى المحاولة مرة أخرى."
        : "An error occurred while analyzing your CV. Please try again.";

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};
