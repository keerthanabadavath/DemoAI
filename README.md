# AI — Career Tools

A lightweight, single-page web app with five AI-powered career tools. Built with Next.js (App Router), deployed on Vercel.

## Features

| Tab | Description |
|-----|-------------|
| **Mentor** | Personalized career guidance based on skills, goals, and questions |
| **Roadmap** | Structured learning path from current skills to target role |
| **ATS** | Resume analysis against a job description (PDF upload or paste) |
| **Interview** | Mock interview questions with AI evaluation and ideal answers |

## LLM Fallback Chain

Requests try providers in order: **Grok → Gemini → OpenRouter**. Fallback triggers on HTTP error, 10-second timeout, or empty response.

## Getting Started

### Prerequisites

- Node.js 18+
- At least one LLM API key (Grok, Gemini, or OpenRouter)

### Local Development

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Add your API keys to .env.local
# GROK_API_KEY=...
# GEMINI_API_KEY=...
# OPENROUTER_API_KEY=...

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROK_API_KEY` | No* | — | xAI Grok API key |
| `GEMINI_API_KEY` | No* | — | Google Gemini API key |
| `OPENROUTER_API_KEY` | No* | — | OpenRouter API key |
| `GROK_MODEL` | No | `grok-beta` | Grok model name |
| `GEMINI_MODEL` | No | `gemini-1.5-flash` | Gemini model name |
| `OPENROUTER_MODEL` | No | `openrouter/auto` | OpenRouter model |
| `OPENROUTER_REFERER` | No | — | Referer header for OpenRouter |

\*At least one API key is required for the app to function.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add environment variables in Project Settings → Environment Variables.
4. Deploy — Vercel auto-detects Next.js.

```bash
# Or deploy via CLI
npm i -g vercel
vercel
```

## API Routes

All routes accept `POST` with JSON body and return `{ text: string, provider: string }`.

| Route | Body Fields |
|-------|-------------|
| `/api/mentor` | `skills`, `targetRole`, `careerGoals`, `preparationStatus`, `question` |
| `/api/roadmap` | `currentSkills`, `targetRole` |
| `/api/ats` | `resume`, `jobDescription` |
| `/api/interview/questions` | `role`, `skills`, `count` |
| `/api/interview/evaluate` | `question`, `answer`, `role` |

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **pdf.js** (client-side PDF text extraction)
- Plain CSS (neobrutalistic design)
- No database, no authentication

## Project Structure

```
├── app/
│   ├── api/          # Serverless API routes
│   ├── globals.css   # Neobrutalistic styles
│   ├── layout.tsx
│   └── page.tsx
├── components/       # Tab components & UI
├── lib/
│   ├── llm.ts        # Fallback chain logic
│   ├── prompts.ts    # LLM prompt templates
│   ├── markdown.ts   # Lightweight markdown parser
│   └── pdf.ts        # Client-side PDF extraction
└── vercel.json
```

## License

MIT
