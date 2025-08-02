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

  try {
    const { cvData, language = "en" } = JSON.parse(event.body);

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

    // Create comprehensive CV analysis prompt
    const prompt = createATSAnalysisPrompt(cvData, language);

    const requestData = JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are an ATS (Applicant Tracking System) expert and professional career advisor. 
          Analyze the provided CV data and return a JSON response with specific, actionable feedback.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
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
    const analysisText = groqResponse.choices[0]?.message?.content;

    if (!analysisText) {
      throw new Error("No analysis received from AI");
    }

    // Try to parse as JSON, fallback to text
    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch {
      // If not valid JSON, create structured response
      analysis = {
        score: 75,
        feedback: analysisText,
        suggestions: [
          {
            category: "General",
            text: "Review the analysis above for detailed recommendations",
          },
        ],
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(analysis),
    };
  } catch (error) {
    console.error("Error in ATS analysis:", error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: language === "ar" 
          ? "حدث خطأ في تحليل السيرة الذاتية. يرجى المحاولة مرة أخرى."
          : "An error occurred while analyzing your CV. Please try again.",
      }),
    };
  }
};

function createATSAnalysisPrompt(cvData, language) {
  const isArabic = language === "ar";

  if (isArabic) {
    return `
قم بتحليل السيرة الذاتية التالية وتقديم نقاط ATS وتقييم شامل:

بيانات السيرة الذاتية:
${JSON.stringify(cvData, null, 2)}

يرجى إرجاع تحليل مفصل بتنسيق JSON يتضمن:
{
  "score": رقم من 0-100,
  "feedback": "تقييم شامل مفصل",
  "suggestions": [
    {
      "category": "فئة التحسين",
      "text": "اقتراح محدد"
    }
  ],
  "strengths": ["نقاط القوة"],
  "improvements": ["مجالات التحسين"]
}

ركز على:
- تحسين كلمات مفتاحية لأنظمة ATS
- إضافة إنجازات مقيسة
- تحسين التنسيق والبنية
- إضافة مهارات تقنية ذات صلة
    `;
  }

  return `
Analyze the following CV and provide ATS score and comprehensive assessment:

CV Data:
${JSON.stringify(cvData, null, 2)}

Please return a detailed analysis in JSON format including:
{
  "score": number from 0-100,
  "feedback": "comprehensive detailed assessment",
  "suggestions": [
    {
      "category": "improvement category",
      "text": "specific suggestion"
    }
  ],
  "strengths": ["list of strengths"],
  "improvements": ["areas for improvement"]
}

Focus on:
- ATS keyword optimization
- Adding quantified achievements
- Improving formatting and structure
- Adding relevant technical skills
  `;
}
