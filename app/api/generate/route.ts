import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { idea, format } = await req.json();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a social media content expert for Cuemath, an ed-tech company. Generate a ${format} based on the user's idea. Return ONLY a valid JSON array with exactly 6 slides. Each slide must have: "slideNumber" (number), "title" (short, punchy, max 8 words), "body" (2-3 sentences, engaging and parent-friendly), "imagePrompt" (a vivid 8-10 word visual description for AI image generation, no text or words in the image). First slide is hook, slides 2-5 are content, slide 6 is CTA. Return raw JSON array only, absolutely no markdown, no backticks, no explanation.`
        },
        {
          role: "user",
          content: `Format: ${format}. Idea: ${idea}`
        }
      ]
    });

    const text = completion.choices[0].message.content || "[]";
    const clean = text.replace(/```json|```/g, "").trim();
    const slides = JSON.parse(clean);
    return NextResponse.json({ slides });

  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}