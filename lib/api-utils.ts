import { NextResponse } from "next/server";
import { callLLM } from "./llm";

export async function handleLLMRequest(prompt: string) {
  try {
    const result = await callLLM(prompt);
    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return NextResponse.json(
      {
        error:
          "Sorry, all AI providers are currently unavailable. Please try again later.",
        details: message,
      },
      { status: 500 }
    );
  }
}
