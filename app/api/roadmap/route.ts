import { handleLLMRequest } from "@/lib/api-utils";
import { roadmapPrompt } from "@/lib/prompts";

export async function POST(request: Request) {
  const body = await request.json();
  const { currentSkills, targetRole } = body;

  if (!currentSkills || !targetRole) {
    return Response.json(
      { error: "currentSkills and targetRole are required" },
      { status: 400 }
    );
  }

  const prompt = roadmapPrompt({ currentSkills, targetRole });
  return handleLLMRequest(prompt);
}
