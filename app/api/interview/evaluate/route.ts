import { handleLLMRequest } from "@/lib/api-utils";
import { interviewEvaluatePrompt } from "@/lib/prompts";

export async function POST(request: Request) {
  const body = await request.json();
  const { question, answer, role } = body;

  if (!question || !answer || !role) {
    return Response.json(
      { error: "question, answer, and role are required" },
      { status: 400 }
    );
  }

  const prompt = interviewEvaluatePrompt({ question, answer, role });
  return handleLLMRequest(prompt);
}
