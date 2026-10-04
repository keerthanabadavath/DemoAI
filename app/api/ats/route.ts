import { handleLLMRequest } from "@/lib/api-utils";
import { atsPrompt } from "@/lib/prompts";

export async function POST(request: Request) {
  const body = await request.json();
  const { resume, jobDescription } = body;

  if (!resume || !jobDescription) {
    return Response.json(
      { error: "resume and jobDescription are required" },
      { status: 400 }
    );
  }

  const prompt = atsPrompt({ resume, jobDescription });
  return handleLLMRequest(prompt);
}
