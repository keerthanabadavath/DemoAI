"use client";

import { useState } from "react";
import ResultPanel from "./ResultPanel";
import { extractTextFromPDF } from "@/lib/pdf";

export default function ATSTab() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [text, setText] = useState<string | null>(null);
  const [provider, setProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePDFUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setPdfLoading(true);
    setError(null);
    try {
      const extracted = await extractTextFromPDF(file);
      setResume(extracted);
    } catch {
      setError("Failed to extract text from PDF. Try pasting your resume instead.");
    } finally {
      setPdfLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setText(null);
    setProvider(null);
    setError(null);

    try {
      const res = await fetch("/api/ats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
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
        <h3>RESUME + ATS ANALYSIS</h3>
        <label>
          UPLOAD RESUME (PDF)
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handlePDFUpload}
            className="file-input"
          />
          {pdfLoading && <span className="file-status">Extracting text...</span>}
        </label>
        <label>
          RESUME TEXT
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your resume text here, or upload a PDF above"
            required
            rows={8}
          />
        </label>
        <label>
          JOB DESCRIPTION
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here"
            required
            rows={6}
          />
        </label>
        <button type="submit" className="btn btn-red" disabled={loading || pdfLoading}>
          ANALYZE RESUME
        </button>
      </form>
      <ResultPanel
        loading={loading}
        text={text}
        provider={provider}
        error={error}
        placeholder="ATS analysis results will appear here..."
      />
    </div>
  );
}
