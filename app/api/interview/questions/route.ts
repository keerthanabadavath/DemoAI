import { handleLLMRequest } from "@/lib/api-utils";
import { interviewQuestionsPrompt } from "@/lib/prompts";

export async function POST(request: Request) {
  const body = await request.json();
  const { role, skills, count } = body;

  if (!role || !skills) {
    return Response.json(
      { error: "role and skills are required" },
      { status: 400 }
    );
  }

  const prompt = interviewQuestionsPrompt({
    role,
    skills,
    count: Math.min(Math.max(Number(count) || 5, 1), 15),
  });

  return handleLLMRequest(prompt);
}
