import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ API key not configured" },
        { status: 500 }
      );
    }

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
                "You are a helpful AI assistant specialized in CV writing, career advice, and job search guidance. Provide clear, actionable advice to help users improve their resumes and career prospects. Keep responses concise and practical.",
            },
            ...messages,
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API error:", errorData);
      return NextResponse.json(
        { error: "Failed to get AI response" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in AI chat API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
