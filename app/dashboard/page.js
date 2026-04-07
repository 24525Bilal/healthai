// app/dashboard/page.js
// Main Dashboard — Admin-only, protected behind login

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Activity,
  Shield,
  Stethoscope,
  AlertTriangle,
  MapPin,
  Brain,
  TrendingUp,
  Pill,
  FileText,
  Zap,
  Users,
  Building2,
  ChevronRight,
  ShieldAlert,
  HeartPulse,
  Droplets,
  ClipboardList,
  Globe,
  LogOut,
} from "lucide-react";
import {
  clinicalReports as mockClinicalReports,
  trendData as mockTrendData,
  resourceData as mockResourceData,
  areaData as mockAreaData,
} from "../lib/mock-data";
import {
  fetchClinicalReports,
  fetchResources,
  buildTrendData,
  buildAreaData,
} from "../lib/firestore-data";
import { useLang } from "../lib/LanguageContext";
import TrendChart from "../components/TrendChart";
import ResourceTable from "../components/ResourceTable";

export default function Dashboard() {
  const router = useRouter();
  const { lang, toggleLang, t } = useLang();
  const [isAuthed, setIsAuthed] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [clinicalReports, setClinicalReports] = useState(mockClinicalReports);
  const [resourceData, setResourceData] = useState(mockResourceData);
  const [trendData, setTrendData] = useState(mockTrendData);
  const [areaData, setAreaData] = useState(mockAreaData);
  const [dataSource, setDataSource] = useState("loading");
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Auth guard
  useEffect(() => {
    const auth = sessionStorage.getItem("hs_auth");
    if (auth !== "true") {
      router.replace("/login");
    } else {
      setIsAuthed(true);
    }
  }, [router]);

  // Fetch data from Firebase on mount
  useEffect(() => {
    if (!isAuthed) return;
    async function loadData() {
      try {
        const [reports, resources] = await Promise.all([
          fetchClinicalReports(),
          fetchResources(),
        ]);
        setClinicalReports(reports);
        setResourceData(resources);
        setTrendData(buildTrendData(reports));
        setAreaData(buildAreaData(reports));

        const isFromFirebase = reports.length > 0 && reports[0]._docId;
        setDataSource(isFromFirebase ? "firebase" : "mock");

        if (reports.length > 0) {
          runAnalysis(reports);
        }
      } catch (err) {
        console.error("Failed to load from Firebase, using mock data:", err);
        setDataSource("mock");
      } finally {
        setIsLoadingData(false);
      }
    }
    loadData();
  }, [isAuthed]);

  // Live clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString(lang === "ml" ? "ml-IN" : "en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [lang]);

  const handleLogout = () => {
    sessionStorage.removeItem("hs_auth");
    router.push("/");
  };

  // Call the AI analysis API with a 14-day filter
  const runAnalysis = async (reportsToAnalyze = clinicalReports) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      
      const recentReports = reportsToAnalyze.filter(r => {
        if (!r.date) return false;
        const reportDate = new Date(r.date);
        return reportDate >= twoWeeksAgo;
      });

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reports: recentReports }),
      });
      const data = await response.json();
      if (data.success) {
        setAnalysisResult(data.analysis);
      } else {
        setError(data.error || "Analysis failed. Check your Gemini API key.");
      }
    } catch (err) {
      setError("Network error. Make sure the dev server is running.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Calculate stats
  const totalReports = clinicalReports.length;
  const uniqueAreas = [...new Set(clinicalReports.map((r) => r.area))].length;
  const uniqueHospitals = [...new Set(clinicalReports.map((r) => r.hospital))].length;
  const criticalResources = resourceData.filter((r) => r.status === "low").length;

  const getSeverityClass = (level) => {
    if (!level) return "warning";
    if (level === "Critical" || level === "High") return "critical";
    if (level === "Medium") return "warning";
    return "safe";
  };

  if (!isAuthed) return null;


  return (
    <div className="app-container">
      {/* ===== HEADER ===== */}
      <header className="header" id="app-header">
        <div className="header-left">
          <div className="header-logo">
            <ShieldAlert size={26} color="white" />
          </div>
          <div>
            <h1 className="header-title">{t.appTitle}</h1>
            <p className="header-subtitle">{t.appSubtitle}</p>
          </div>
        </div>
        <div className="header-right">
          <button className="lang-toggle" onClick={toggleLang} id="lang-toggle-admin">
            <span className="lang-flag">{lang === "en" ? "🇮🇳" : "🇬🇧"}</span>
            {t.language}
          </button>
          <Link href="/doctor" className="doctor-back-link" id="doctor-portal-link" style={{ background: "rgba(16,185,129,0.1)", borderColor: "rgba(16,185,129,0.2)", color: "#10b981" }}>
            <Stethoscope size={16} />
            Doctor Portal
          </Link>
          <button onClick={handleLogout} className="doctor-back-link" id="logout-btn" style={{ background: "rgba(239,68,68,0.1)", borderColor: "rgba(239,68,68,0.2)", color: "#ef4444", cursor: "pointer" }}>
            <LogOut size={16} />
            Logout
          </button>
          <div className="live-badge">
            <span className="live-dot" />
            {t.liveMonitoring}
          </div>
          {!isLoadingData && (
            <div
              className="live-badge"
              style={{
                background: dataSource === "firebase"
                  ? "rgba(16,185,129,0.15)"
                  : "rgba(245,158,11,0.15)",
                color: dataSource === "firebase" ? "#10b981" : "#f59e0b",
              }}
            >
              <span
                className="live-dot"
                style={{
                  background: dataSource === "firebase" ? "#10b981" : "#f59e0b",
                  boxShadow: dataSource === "firebase"
                    ? "0 0 6px #10b981"
                    : "0 0 6px #f59e0b",
                }}
              />
              {dataSource === "firebase" ? "Firebase" : "Mock Data"}
            </div>
          )}
          <span className="header-time">{currentTime}</span>
        </div>
      </header>

      {/* ===== STATS ROW ===== */}
      <div className="stats-row" id="stats-section">
        <div className="stat-card blue">
          <div className="stat-icon blue">
            <FileText size={20} />
          </div>
          <div className="stat-value">{totalReports}</div>
          <div className="stat-label">{t.clinicalReports}</div>
        </div>
        <div className="stat-card emerald">
          <div className="stat-icon emerald">
            <Building2 size={20} />
          </div>
          <div className="stat-value">{uniqueHospitals}</div>
          <div className="stat-label">{t.reportingHospitals}</div>
        </div>
        <div className="stat-card amber">
          <div className="stat-icon amber">
            <MapPin size={20} />
          </div>
          <div className="stat-value">{uniqueAreas}</div>
          <div className="stat-label">{t.affectedAreas}</div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon red">
            <AlertTriangle size={20} />
          </div>
          <div className="stat-value">{criticalResources}</div>
          <div className="stat-label">{t.resourceShortages}</div>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div className="tabs" id="nav-tabs">
        <button
          className={`tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <Activity size={14} /> {t.overview}
        </button>
        <button
          className={`tab ${activeTab === "ai" ? "active" : ""}`}
          onClick={() => setActiveTab("ai")}
        >
          <Brain size={14} /> {t.aiAnalysis}
        </button>
        <button
          className={`tab ${activeTab === "resources" ? "active" : ""}`}
          onClick={() => setActiveTab("resources")}
        >
          <Pill size={14} /> {t.resources}
        </button>
        <button
          className={`tab ${activeTab === "reports" ? "active" : ""}`}
          onClick={() => setActiveTab("reports")}
        >
          <ClipboardList size={14} /> {t.reports}
        </button>
      </div>

      {/* ===== OVERVIEW TAB ===== */}
      {activeTab === "overview" && (
        <>
          <div className="dashboard-grid">
            {/* Symptom Trends */}
            <div className="card" id="trend-chart-card">
              <div className="card-header">
                <h2 className="card-title">
                  <TrendingUp size={18} /> {t.symptomTrends}
                </h2>
                <span className="card-badge critical">{t.spikeDetected}</span>
              </div>
              <TrendChart data={trendData} />
            </div>

            {/* Area Risk Summary */}
            <div className="card" id="area-risk-card">
              <div className="card-header">
                <h2 className="card-title">
                  <MapPin size={18} /> {t.areaRiskAssessment}
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {areaData.map((area, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 16px",
                      background: "var(--bg-glass)",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border-subtle)",
                      transition: "all 200ms",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: area.color,
                          boxShadow: `0 0 8px ${area.color}40`,
                        }}
                      />
                      <div>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: "0.9rem",
                            color: "var(--text-primary)",
                          }}
                        >
                          {area.name}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {area.cases} {t.casesReported}
                        </div>
                      </div>
                    </div>
                    <span
                      className={`card-badge ${
                        area.risk === "Critical"
                          ? "critical"
                          : area.risk === "High"
                          ? "warning"
                          : "safe"
                      }`}
                    >
                      {area.risk}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="analyze-section">
            <button
              className="analyze-btn"
              onClick={() => {
                setActiveTab("ai");
                if (!analysisResult) runAnalysis();
              }}
              id="quick-analyze-btn"
            >
              <Zap size={20} />
              {t.goToAiAnalysis}
              <ChevronRight size={18} />
            </button>
          </div>
        </>
      )}

      {/* ===== AI ANALYSIS TAB ===== */}
      {activeTab === "ai" && (
        <>
          <div className="analyze-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)", display: 'flex', alignItems: 'center', gap: 8 }}>
              <Brain size={20} color="var(--accent-purple)" />
              {t.aiAnalysis}
            </h2>
            <button
              className="analyze-btn"
              onClick={() => runAnalysis(clinicalReports)}
              disabled={isAnalyzing}
              id="run-analysis-btn"
              style={{ width: 'auto', padding: '10px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {isAnalyzing ? (
                <>
                  <div className="spinner" />
                  {t.analyzingReports}
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Refresh Check (14 Days)
                </>
              )}
            </button>
          </div>

          {error && (
            <div
              className="card"
              style={{
                borderColor: "rgba(239,68,68,0.3)",
                marginBottom: 24,
              }}
            >
              <p style={{ color: "var(--accent-red)", fontWeight: 500 }}>
                ⚠️ {t.error}: {error}
              </p>
            </div>
          )}

          {analysisResult && (
            <div className="ai-results">
              {/* Outbreak Summary Banner */}
              <div
                className={`outbreak-summary ${getSeverityClass(
                  analysisResult.severity_level
                )}`}
              >
                <div className="outbreak-title">
                  {analysisResult.outbreak_detected ? (
                    <AlertTriangle size={22} />
                  ) : (
                    <Shield size={22} />
                  )}
                  {analysisResult.outbreak_detected
                    ? `⚠️ ${t.outbreakDetected}: ${analysisResult.disease_name}`
                    : `✅ ${t.noOutbreakDetected}`}
                </div>
                <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.9rem" }}>
                  {analysisResult.summary}
                </p>
                <div className="outbreak-meta">
                  <div className="meta-item">
                    <span className="meta-label">{t.confidence}</span>
                    <span className="meta-value">{analysisResult.confidence_percent}%</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">{t.severity}</span>
                    <span className="meta-value">{analysisResult.severity_level}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">{t.cases}</span>
                    <span className="meta-value">{analysisResult.total_suspected_cases}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">{t.transmission}</span>
                    <span className="meta-value">{analysisResult.transmission_mode}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">{t.trend}</span>
                    <span className="meta-value">{analysisResult.predicted_trend}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">{t.estNewCases}</span>
                    <span className="meta-value">{analysisResult.estimated_new_cases_next_week}</span>
                  </div>
                </div>
              </div>

              {/* Severity & Confidence Visual */}
              <div
                className={`severity-indicator ${analysisResult.severity_level}`}
              >
                <div>
                  <div className="severity-level">{analysisResult.severity_level}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>
                    {t.threatLevel}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      marginBottom: 6,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      fontWeight: 600,
                    }}
                  >
                    {t.aiConfidence}: {analysisResult.confidence_percent}%
                  </div>
                  <div className="confidence-bar-track">
                    <div
                      className="confidence-bar-fill"
                      style={{
                        width: `${analysisResult.confidence_percent}%`,
                        background:
                          analysisResult.confidence_percent >= 80
                            ? "linear-gradient(90deg, #ef4444, #f97316)"
                            : analysisResult.confidence_percent >= 50
                            ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                            : "linear-gradient(90deg, #10b981, #34d399)",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Recommendations Grid */}
              <div className="recommendations-grid">
                {/* Health Authority Actions */}
                <div className="rec-section">
                  <h3 className="rec-section-title blue">
                    <Shield size={14} /> {t.healthAuthorityActions}
                  </h3>
                  <ul className="rec-list">
                    {analysisResult.recommended_actions?.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>

                {/* Citizen Precautions */}
                <div className="rec-section">
                  <h3 className="rec-section-title amber">
                    <Users size={14} /> {t.citizenPrecautions}
                  </h3>
                  <ul className="rec-list">
                    {analysisResult.citizen_precautions?.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                {/* Medicine Requirements */}
                <div className="rec-section">
                  <h3 className="rec-section-title emerald">
                    <Pill size={14} /> {t.medicineRequirements}
                  </h3>
                  <ul className="rec-list">
                    {analysisResult.medicine_requirements?.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>

                {/* Water & Sanitation */}
                <div className="rec-section">
                  <h3 className="rec-section-title purple">
                    <Droplets size={14} /> {t.waterSanitationAdvisory}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-secondary)",
                      lineHeight: 1.7,
                      padding: "8px 12px",
                      background: "rgba(255,255,255,0.02)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    {analysisResult.water_sanitation_advisory}
                  </p>
                </div>
              </div>

              {/* Affected Areas & Risk Groups */}
              <div className="dashboard-grid" style={{ marginTop: 16 }}>
                <div className="rec-section">
                  <h3 className="rec-section-title blue">
                    <MapPin size={14} /> {t.highestRiskAreas}
                  </h3>
                  <ul className="rec-list">
                    {analysisResult.affected_areas?.map((a, i) => (
                      <li key={i}>
                        {a}
                        {a === analysisResult.highest_risk_area && (
                          <span
                            style={{
                              marginLeft: 8,
                              fontSize: "0.65rem",
                              background: "var(--accent-red-glow)",
                              color: "var(--accent-red)",
                              padding: "2px 8px",
                              borderRadius: 100,
                              fontWeight: 700,
                            }}
                          >
                            {t.highest}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rec-section">
                  <h3 className="rec-section-title amber">
                    <HeartPulse size={14} /> {t.atRiskGroups}
                  </h3>
                  <ul className="rec-list">
                    {analysisResult.at_risk_groups?.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {!analysisResult && !isAnalyzing && !error && (
            <div
              className="card"
              style={{ textAlign: "center", padding: "60px 24px" }}
            >
              <Brain
                size={48}
                style={{ color: "var(--accent-blue)", marginBottom: 16, opacity: 0.5 }}
              />
              <h3
                style={{
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                  marginBottom: 8,
                }}
              >
                {t.clickRunAnalysis}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                {t.analysisDescription} {totalReports} {t.anonymizedReports}
              </p>
            </div>
          )}
        </>
      )}

      {/* ===== RESOURCES TAB ===== */}
      {activeTab === "resources" && (
        <div className="card" id="resource-card">
          <div className="card-header">
            <h2 className="card-title">
              <Pill size={18} /> {t.medicineResourceAvailability}
            </h2>
            <span className="card-badge warning">
              {criticalResources} {t.shortages}
            </span>
          </div>
          <ResourceTable data={resourceData} />
        </div>
      )}

      {/* ===== REPORTS TAB ===== */}
      {activeTab === "reports" && (
        <div className="card" id="reports-card">
          <div className="card-header">
            <h2 className="card-title">
              <ClipboardList size={18} /> {t.anonymizedClinicalReports}
            </h2>
            <span className="card-badge safe">{totalReports} {t.records}</span>
          </div>
          <div className="reports-scroll">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>{t.id}</th>
                  <th>{t.date}</th>
                  <th>{t.hospital}</th>
                  <th>{t.area}</th>
                  <th>{t.age}</th>
                  <th>{t.symptoms}</th>
                </tr>
              </thead>
              <tbody>
                {clinicalReports.map((report, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: "var(--accent-blue)" }}>
                      {report.id}
                    </td>
                    <td>{report.date}</td>
                    <td>{report.hospital}</td>
                    <td>
                      <span className="area-tag">{report.area}</span>
                    </td>
                    <td>{report.age}</td>
                    <td
                      style={{
                        maxWidth: 280,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {report.symptoms}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <p>
          {t.poweredBy} <strong>Google Gemini AI</strong> &bull; Google Firebase &bull; {t.allRightsReserved}
        </p>
        <p style={{ marginTop: 4 }}>{t.footerDisclaimer}</p>
      </footer>
    </div>
  );
}
