const COLORS: Record<string, string> = {
  grok: "#ffe066",
  gemini: "#a0e7e5",
  openrouter: "#d4b8ff",
};

export default function ProviderBadge({ provider }: { provider: string }) {
  const bg = COLORS[provider] || "#b8e986";
  return (
    <span className="provider-badge" style={{ backgroundColor: bg }}>
      {provider.toUpperCase()}
    </span>
  );
}
