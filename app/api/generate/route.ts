import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { numDumplings, fillingType, wrapperType, flavorEnhancers } = await req.json();
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://api.deepseek.com/v1",
    });
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `You are an expert Asian dumpling chef. Provide precise ingredient quantities for dumpling fillings with pleating technique tips. Use markdown with a clear ingredients table and step-by-step instructions.`,
        },
        {
          role: "user",
          content: `Calculate dumpling filling quantities and tips:\n- Number of dumplings: ${numDumplings}\n- Filling type: ${fillingType} (e.g., pork/chicken/vegetable)\n- Wrapper type: ${wrapperType}\n- Flavor enhancers: ${flavorEnhancers}\n\nProvide:\n1. Precise ingredient quantities (meat, vegetables, aromatics, seasonings)\n2. Filling preparation steps\n3. Wrapper selection guide\n4. Pleating technique tips\n5. Cooking method (pan-fried, steamed, boiled)\n6. Storage and make-ahead tips`,
        },
      ],
      temperature: 0.7,
    });
    return NextResponse.json({ result: response.choices[0].message.content });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
