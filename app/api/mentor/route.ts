import { handleLLMRequest } from "@/lib/api-utils";
import { mentorPrompt } from "@/lib/prompts";

export async function POST(request: Request) {
  const body = await request.json();
  const { skills, targetRole, careerGoals, preparationStatus, question } = body;

  if (!skills || !targetRole || !question) {
    return Response.json(
      { error: "skills, targetRole, and question are required" },
      { status: 400 }
    );
  }

  const prompt = mentorPrompt({
    skills,
    targetRole,
    careerGoals: careerGoals || "Not specified",
    preparationStatus: preparationStatus || "Not specified",
    question,
  });

  return handleLLMRequest(prompt);
}
