import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { text, field, context } = await request.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ API key not configured" },
        { status: 500 }
      );
    }

    // Create context-aware prompt for autocompletion
    const prompt = createAutocompletionPrompt(text, field, context);

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
                "You are an expert CV writing assistant. Provide professional, ATS-optimized autocompletion suggestions. Return only the completion text without explanations.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 150,
          temperature: 0.3,
          stop: ["\n\n", "---"],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API error:", errorData);
      return NextResponse.json(
        { error: "Failed to get autocompletion" },
        { status: response.status }
      );
    }

    const data = await response.json();
    const suggestion = data.choices?.[0]?.message?.content?.trim() || "";

    return NextResponse.json({ suggestion });
  } catch (error) {
    console.error("Error in autocompletion API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function createAutocompletionPrompt(text: string, field: string, context: any) {
  const basePrompts = {
    summary: `Complete this professional summary for a CV. Current text: "${text}". Make it compelling and ATS-friendly. Continue naturally:`,
    jobTitle: `Complete this job title. Current text: "${text}". Make it professional and specific:`,
    company: `Complete this company name. Current text: "${text}". Suggest a realistic company name:`,
    description: `Complete this job description bullet point. Current text: "${text}". Make it action-oriented with metrics if possible:`,
    skills: `Complete this skill. Current text: "${text}". Suggest relevant professional skills:`,
    education: `Complete this education field. Current text: "${text}". Make it professional and complete:`,
    degree: `Complete this degree name. Current text: "${text}". Suggest a specific degree:`,
    institution: `Complete this institution name. Current text: "${text}". Suggest a realistic institution:`,
  };

  let prompt =
    basePrompts[field as keyof typeof basePrompts] ||
    `Complete this CV field. Current text: "${text}". Make it professional:`;

  // Add context if available
  if (context?.jobTitle) {
    prompt += ` Context: Job title is "${context.jobTitle}".`;
  }
  if (context?.industry) {
    prompt += ` Industry: ${context.industry}.`;
  }

  return prompt;
}
