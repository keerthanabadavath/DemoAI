"use client";

import { useState } from "react";
import ResultPanel from "./ResultPanel";

export default function RoadmapTab() {
  const [currentSkills, setCurrentSkills] = useState("");
  const [targetRole, setTargetRole] = useState("");
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
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentSkills, targetRole }),
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
        <h3>PERSONALIZED ROADMAP</h3>
        <label>
          CURRENT SKILLS
          <textarea
            value={currentSkills}
            onChange={(e) => setCurrentSkills(e.target.value)}
            placeholder="e.g. Java basics, HTML/CSS"
            required
            rows={4}
          />
        </label>
        <label>
          TARGET ROLE
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Full Stack Java Developer"
            required
          />
        </label>
        <button type="submit" className="btn btn-green" disabled={loading}>
          GENERATE ROADMAP
        </button>
      </form>
      <ResultPanel
        loading={loading}
        text={text}
        provider={provider}
        error={error}
        placeholder="Your learning roadmap will appear here..."
      />
    </div>
  );
}
