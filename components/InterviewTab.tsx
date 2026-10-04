"use client";

import { useState } from "react";
import ResultPanel from "./ResultPanel";
import ProviderBadge from "./ProviderBadge";
import { parseMarkdown } from "@/lib/markdown";

function parseQuestions(text: string): string[] {
  const lines = text.split("\n").filter((l) => l.trim());
  const questions: string[] = [];
  for (const line of lines) {
    const match = line.match(/^\d+[\.\)]\s*(.+)/);
    if (match) {
      questions.push(match[1].trim());
    } else if (line.trim() && !line.startsWith("#")) {
      questions.push(line.replace(/^[\-\*]\s*/, "").trim());
    }
  }
  return questions.length > 0 ? questions : [text];
}

function extractIdealAnswer(text: string): { feedback: string; ideal: string | null } {
  const marker = /\*\*Ideal Sample Answer\*\*/i;
  const match = text.match(marker);
  if (!match || match.index === undefined) {
    return { feedback: text, ideal: null };
  }
  const feedback = text.slice(0, match.index).trim();
  const ideal = text.slice(match.index).replace(marker, "").trim();
  return { feedback, ideal };
}

export default function InterviewTab() {
  const [role, setRole] = useState("");
  const [skills, setSkills] = useState("");
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState<string[]>([]);
  const [selectedQ, setSelectedQ] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingEval, setLoadingEval] = useState(false);
  const [evalText, setEvalText] = useState<string | null>(null);
  const [idealAnswer, setIdealAnswer] = useState<string | null>(null);
  const [showIdeal, setShowIdeal] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerateQuestions(e: React.FormEvent) {
    e.preventDefault();
    setLoadingQuestions(true);
    setQuestions([]);
    setSelectedQ(null);
    setAnswer("");
    setEvalText(null);
    setIdealAnswer(null);
    setShowIdeal(false);
    setProvider(null);
    setError(null);

    try {
      const res = await fetch("/api/interview/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, skills, count }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setQuestions(parseQuestions(data.text));
        setProvider(data.provider);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoadingQuestions(false);
    }
  }

  async function handleEvaluate() {
    if (selectedQ === null || !answer.trim()) return;

    setLoadingEval(true);
    setEvalText(null);
    setIdealAnswer(null);
    setShowIdeal(false);
    setError(null);

    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[selectedQ],
          answer,
          role,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        const { feedback, ideal } = extractIdealAnswer(data.text);
        setEvalText(feedback);
        setIdealAnswer(ideal);
        setProvider(data.provider);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoadingEval(false);
    }
  }

  return (
    <div className="tab-layout interview-layout">
      <div className="form-panel">
        <form onSubmit={handleGenerateQuestions}>
          <h3>AI MOCK INTERVIEW</h3>
          <label>
            ROLE
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Frontend Developer"
              required
            />
          </label>
          <label>
            SKILLS
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, TypeScript, CSS"
              required
            />
          </label>
          <label>
            NUMBER OF QUESTIONS
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              min={1}
              max={15}
            />
          </label>
          <button
            type="submit"
            className="btn btn-purple"
            disabled={loadingQuestions}
          >
            GENERATE QUESTIONS
          </button>
        </form>

        {loadingQuestions && (
          <div className="questions-loading">Generating questions...</div>
        )}

        {questions.length > 0 && (
          <div className="questions-list">
            <h4>SELECT A QUESTION</h4>
            {questions.map((q, i) => (
              <button
                key={i}
                type="button"
                className={`question-item ${selectedQ === i ? "selected" : ""}`}
                onClick={() => {
                  setSelectedQ(i);
                  setAnswer("");
                  setEvalText(null);
                  setIdealAnswer(null);
                  setShowIdeal(false);
                }}
              >
                <span className="q-num">{i + 1}</span>
                {q}
              </button>
            ))}
          </div>
        )}

        {selectedQ !== null && (
          <div className="answer-section">
            <label>
              YOUR ANSWER
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={5}
              />
            </label>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleEvaluate}
              disabled={loadingEval || !answer.trim()}
            >
              EVALUATE ANSWER
            </button>
          </div>
        )}
      </div>

      <div className="result-panel">
        <div className="result-header">
          <h3>FEEDBACK</h3>
          {provider && !loadingEval && <ProviderBadge provider={provider} />}
        </div>
        <div className="result-body">
          {loadingEval && (
            <div className="spinner-container">
              <div className="spinner" />
              <p className="spinner-text">EVALUATING...</p>
            </div>
          )}
          {!loadingEval && error && (
            <div className="result-error">{error}</div>
          )}
          {!loadingEval && !error && evalText && (
            <>
              <div
                className="markdown-content"
                dangerouslySetInnerHTML={{ __html: parseMarkdown(evalText) }}
              />
              {idealAnswer && (
                <div className="ideal-section">
                  <button
                    type="button"
                    className="btn btn-green btn-sm"
                    onClick={() => setShowIdeal(!showIdeal)}
                  >
                    {showIdeal ? "HIDE" : "REVEAL"} IDEAL ANSWER
                  </button>
                  {showIdeal && (
                    <div
                      className="ideal-answer markdown-content"
                      dangerouslySetInnerHTML={{
                        __html: parseMarkdown(idealAnswer),
                      }}
                    />
                  )}
                </div>
              )}
            </>
          )}
          {!loadingEval && !error && !evalText && (
            <p className="result-placeholder">
              Select a question, write your answer, and click Evaluate...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
