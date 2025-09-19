import React, { useState } from "react";
import "../css/AdminDashboard.css";
import Navbar from "../components/Navbar";
import AddProfessor from "../components/AddProfessor.jsx";
import AddVideo from "../components/AddVideos.jsx";
const tabs = [
  { id: "overview", label: "Overview", icon: "👤" },
  { id: "professors", label: "Professors", icon: "👥" },
  { id: "videos", label: "Videos", icon: "▶️" },
];

const overviewStats = [
  { title: "Total Professors", icon: "👥", value: 3, subtitle: "Active faculty members" },
  { title: "Total Videos", icon: "▶️", value: 4, subtitle: "Educational content" },
  { title: "Average Rating", icon: "📊", value: "4.7", subtitle: "Student satisfaction" },
  { title: "Total Reviews", icon: "📊", value: 601, subtitle: "Student feedback" },
];

const quickActions = [
  { label: "Add Professor", icon: "+", primary: true },
  { label: "Manage Videos", icon: "▶️", primary: false },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="dashboard-container">
      <Navbar />

      {/* Tabs */}
      <nav className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span> {tab.label}
          </button>
        ))}
      </nav>

      {/* Quick Actions */}
{activeTab === "overview" && (
  <div className="quick-actions">
    {quickActions.map(({ label, icon, primary }) => (
      <button
        key={label}
        className={`quick-action-btn ${primary ? "primary" : ""}`}
        onClick={() => {
          if (label === "Add Professor") setActiveTab("professors");
          else if (label === "Manage Videos") setActiveTab("videos");
          else if (label === "View Analytics") setActiveTab("analytics");
        }}
      >
        <span className="quick-icon">{icon}</span> {label}
      </button>
    ))}
  </div>
)}


<section className="tab-content">
  {activeTab === "overview" && (
    <div className="stats-cards">
      {overviewStats.map(({ title, icon, value, subtitle }) => (
        <div key={title} className="stat-card">
          <div className="stat-title">
            {title} <span className="stat-icon">{icon}</span>
          </div>
          <div className="stat-value">{value}</div>
          <div className="stat-subtitle">{subtitle}</div>
        </div>
      ))}
    </div>
  )}

  {activeTab === "professors" && <AddProfessor />}
  {activeTab === "videos" && <div><AddVideo/></div>}
</section>

    </div>
  );
}
