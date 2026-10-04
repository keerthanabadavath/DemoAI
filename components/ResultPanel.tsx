"use client";

import LoadingSpinner from "./LoadingSpinner";
import ProviderBadge from "./ProviderBadge";
import { parseMarkdown } from "@/lib/markdown";

interface ResultPanelProps {
  loading: boolean;
  text: string | null;
  provider: string | null;
  error: string | null;
  placeholder?: string;
}

export default function ResultPanel({
  loading,
  text,
  provider,
  error,
  placeholder = "Results will appear here...",
}: ResultPanelProps) {
  return (
    <div className="result-panel">
      <div className="result-header">
        <h3>RESULTS</h3>
        {provider && !loading && <ProviderBadge provider={provider} />}
      </div>
      <div className="result-body">
        {loading && <LoadingSpinner />}
        {!loading && error && (
          <div className="result-error">{error}</div>
        )}
        {!loading && !error && text && (
          <div
            className="markdown-content"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(text) }}
          />
        )}
        {!loading && !error && !text && (
          <p className="result-placeholder">{placeholder}</p>
        )}
      </div>
    </div>
  );
}
