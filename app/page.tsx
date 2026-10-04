import Tabs from "@/components/Tabs";

export default function Home() {
  return (
    <main className="main">
      <header className="hero">
        <h1>AI ASSISTANT</h1>
        <p className="hero-sub">
          Five AI-powered career tools to mentor, plan, analyze, and prepare you
          for your dream role.
        </p>
      </header>
      <Tabs />
    </main>
  );
}
