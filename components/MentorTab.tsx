"use client";

import { useState } from "react";
import ResultPanel from "./ResultPanel";

export default function MentorTab() {
  const [skills, setSkills] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [careerGoals, setCareerGoals] = useState("");
  const [preparationStatus, setPreparationStatus] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setText(null);
    setProvider(null);
    setError(null);

    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills,
          targetRole,
          careerGoals,
          preparationStatus,
          question,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
      } else {
        setText(data.text);
        setProvider(data.provider);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="tab-layout">
      <form className="form-panel" onSubmit={handleSubmit}>
        <h3>AI CAREER MENTOR</h3>
        <label>
          YOUR SKILLS
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="e.g. Python, SQL, basic web dev"
            required
            rows={3}
          />
        </label>
        <label>
          TARGET ROLE
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Backend Engineer"
            required
          />
        </label>
        <label>
          CAREER GOALS
          <textarea
            value={careerGoals}
            onChange={(e) => setCareerGoals(e.target.value)}
            placeholder="Where do you want to be in 2-3 years?"
            rows={2}
          />
        </label>
        <label>
          PREPARATION STATUS
          <input
            type="text"
            value={preparationStatus}
            onChange={(e) => setPreparationStatus(e.target.value)}
            placeholder="e.g. Actively applying, still learning"
          />
        </label>
        <label>
          YOUR QUESTION
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="What career advice do you need?"
            required
            rows={3}
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          GET GUIDANCE
        </button>
      </form>
      <ResultPanel
        loading={loading}
        text={text}
        provider={provider}
        error={error}
        placeholder="Your personalized career guidance will appear here..."
      />
    </div>
  );
}
