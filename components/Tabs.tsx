"use client";

import { useState } from "react";
import MentorTab from "./MentorTab";
import RoadmapTab from "./RoadmapTab";
import ATSTab from "./ATSTab";
import InterviewTab from "./InterviewTab";

const TABS = [
  { id: "mentor", label: "MENTOR", color: "#ffe066" },
  { id: "roadmap", label: "ROADMAP", color: "#b8e986" },
  { id: "ats", label: "ATS", color: "#ff6b6b" },
  { id: "interview", label: "INTERVIEW", color: "#d4b8ff" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Tabs() {
  const [active, setActive] = useState<TabId>("mentor");

  return (
    <div className="tabs-container">
      <nav className="tab-nav">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-btn ${active === tab.id ? "active" : ""}`}
            style={
              active === tab.id
                ? { backgroundColor: tab.color }
                : undefined
            }
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <div className="tab-content">
        {active === "mentor" && <MentorTab />}
        {active === "roadmap" && <RoadmapTab />}
        {active === "ats" && <ATSTab />}
        {active === "interview" && <InterviewTab />}
      </div>
    </div>
  );
}
