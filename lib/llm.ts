const TIMEOUT_MS = 10_000;

export interface LLMResult {
  text: string;
  provider: string;
}

type ProviderFn = (prompt: string) => Promise<string | null>;

async function fetchWithTimeout(
  url: string,
  options: RequestInit
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function callGrok(prompt: string): Promise<string | null> {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GROK_MODEL || "grok-2-1212";
  const res = await fetchWithTimeout("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  return text || null;
}

async function callGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetchWithTimeout(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7 },
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  return text || null;
}

async function callOpenRouter(prompt: string): Promise<string | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENROUTER_MODEL || "openrouter/auto";
  const res = await fetchWithTimeout(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": process.env.OPENROUTER_REFERER || "https://ai-betu.vercel.app",
        "X-Title": "AI Betu Career Tools",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    }
  );

  if (!res.ok) return null;
  const data = await res.json();
  const text = data?.choices?.[0]?.message?.content?.trim();
  return text || null;
}

const PROVIDERS: { name: string; fn: ProviderFn }[] = [
  { name: "grok", fn: callGrok },
  { name: "gemini", fn: callGemini },
  { name: "openrouter", fn: callOpenRouter },
];

export async function callLLM(prompt: string): Promise<LLMResult> {
  const errors: string[] = [];

  for (const { name, fn } of PROVIDERS) {
    try {
      const text = await fn(prompt);
      if (text) {
        return { text, provider: name };
      }
      errors.push(`${name}: empty response`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown error";
      errors.push(`${name}: ${msg}`);
    }
  }

  throw new Error(
    `All LLM providers failed. Details: ${errors.join("; ")}`
  );
}
