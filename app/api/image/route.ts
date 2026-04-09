import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const prompt = searchParams.get("prompt") || "abstract background";
  
  const encoded = encodeURIComponent(
    `${prompt}, vibrant, modern, educational, instagram style, high quality`
  );
  
  const imageUrl = `https://image.pollinations.ai/prompt/${encoded}?width=800&height=800&nologo=true`;
  
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();
  
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=3600",
    },
  });
}