// app/citizen/page.js
// Citizen Health Portal — Public-facing page for health alerts & precautions

"use client";

import { useState, useEffect } from "react";
import {
  ShieldAlert,
  Shield,
  AlertTriangle,
  MapPin,
  Pill,
  Users,
  Droplets,
  HeartPulse,
  Phone,
  ChevronRight,
  Activity,
  TrendingUp,
  Siren,
  ShieldCheck,
  BadgeAlert,
  TriangleAlert,
  Clock,
  Lock,
  Globe,
} from "lucide-react";
import { clinicalReports, areaData } from "../lib/mock-data";
import { useLang } from "../lib/LanguageContext";
import Link from "next/link";
import ChatBot from "../components/ChatBot";

export default function CitizenPortal() {
  const { lang, toggleLang, t } = useLang();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState("");

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
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [lang]);

  // Auto-fetch AI analysis on page load
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reports: clinicalReports }),
        });
        const data = await response.json();
        if (data.success) {
          setAnalysisResult(data.analysis);
        }
      } catch (err) {
        setError(t.fetchingHealthData);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalysis();
  }, []);

  const totalCases = clinicalReports.length;
  const getSeverityClass = (level) => {
    if (!level) return "warning";
    if (level === "Critical" || level === "High") return "critical";
    if (level === "Medium") return "warning";
    return "safe";
  };

  const getSeverityEmoji = (level) => {
    if (level === "Critical") return "🔴";
    if (level === "High") return "🟠";
    if (level === "Medium") return "🟡";
    return "🟢";
  };

  const precautions = analysisResult?.citizen_precautions || [
    t.washHands, t.drinkBoiledWater, t.avoidStreetFood,
    t.maintainHygiene, t.coverMouth, t.seekMedical,
  ];
  const medicines = analysisResult?.medicine_requirements || [
    t.orsPackets, t.feverRelief, t.firstAidKit,
  ];
  const waterAdvisory = analysisResult?.water_sanitation_advisory || t.defaultWaterAdvisory;
  const atRiskGroups = analysisResult?.at_risk_groups || [
    t.childrenUnder5, t.elderlyAbove60, t.pregnantWomen, t.immunocompromised,
  ];

  const emergencyContacts = [
    { name: t.emergencyAmbulance, number: "108", icon: Siren, color: "#ef4444" },
    { name: t.healthHelpline, number: "104", icon: Phone, color: "#3b82f6" },
    { name: t.disasterManagement, number: "1078", icon: ShieldAlert, color: "#f59e0b" },
    { name: t.womenHelpline, number: "1091", icon: HeartPulse, color: "#ec4899" },
  ];

  return (
    <div className="app-container citizen-page">
      {/* ===== CITIZEN HEADER ===== */}
      <header className="citizen-header" id="citizen-header">
        <div className="citizen-header-top">
          <Link href="/login" className="back-link" id="admin-login-btn">
            <Lock size={16} />
            {t.adminDashboard}
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="lang-toggle" onClick={toggleLang} id="lang-toggle-citizen">
              <span className="lang-flag">{lang === "en" ? "🇮🇳" : "🇬🇧"}</span>
              {t.language}
            </button>
            <div className="citizen-time">
              <Clock size={14} />
              {currentTime}
            </div>
          </div>
        </div>
        <div className="citizen-header-main">
          <div className="citizen-logo">
            <ShieldCheck size={32} color="white" />
          </div>
          <div>
            <h1 className="citizen-title">{t.citizenHealthPortal}</h1>
            <p className="citizen-subtitle">{t.citizenSubtitle}</p>
          </div>
        </div>
      </header>

      {/* ===== LOADING STATE ===== */}
      {isLoading && (
        <div className="citizen-loading">
          <div className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
          <p>{t.fetchingHealthData}</p>
        </div>
      )}

      {/* ===== ACTIVE ALERT BANNER ===== */}
      {!isLoading && analysisResult && analysisResult.outbreak_detected && (
        <div
          className={`alert-banner ${getSeverityClass(analysisResult.severity_level)}`}
          id="alert-banner"
        >
          <div className="alert-banner-icon">
            <TriangleAlert size={28} />
          </div>
          <div className="alert-banner-content">
            <div className="alert-banner-header">
              <h2>
                {getSeverityEmoji(analysisResult.severity_level)} {t.activeHealthAlert}:{" "}
                {analysisResult.disease_name}
              </h2>
              <span className={`card-badge ${getSeverityClass(analysisResult.severity_level)}`}>
                {analysisResult.severity_level} {t.severityText}
              </span>
            </div>
            <p className="alert-banner-summary">{analysisResult.summary}</p>
            <div className="alert-banner-meta">
              <div className="alert-meta-chip">
                <MapPin size={13} />
                {analysisResult.highest_risk_area || t.affectedAreas}
              </div>
              <div className="alert-meta-chip">
                <Users size={13} />
                {analysisResult.total_suspected_cases} {t.suspectedCases.toLowerCase()}
              </div>
              <div className="alert-meta-chip">
                <TrendingUp size={13} />
                {t.trend}: {analysisResult.predicted_trend}
              </div>
              <div className="alert-meta-chip">
                <Activity size={13} />
                {analysisResult.transmission_mode}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* No outbreak — all clear */}
      {!isLoading && analysisResult && !analysisResult.outbreak_detected && (
        <div className="alert-banner safe" id="alert-banner-safe">
          <div className="alert-banner-icon safe-icon">
            <ShieldCheck size={28} />
          </div>
          <div className="alert-banner-content">
            <h2>✅ {t.noActiveOutbreak}</h2>
            <p className="alert-banner-summary">
              {analysisResult.summary || t.noOutbreakDesc}
            </p>
          </div>
        </div>
      )}

      {/* ===== QUICK STATS ===== */}
      {!isLoading && analysisResult && (
        <div className="citizen-stats-row" id="citizen-stats">
          <div className="citizen-stat">
            <div className="citizen-stat-num">
              {analysisResult.total_suspected_cases || totalCases}
            </div>
            <div className="citizen-stat-label">{t.suspectedCases}</div>
          </div>
          <div className="citizen-stat">
            <div className="citizen-stat-num">{analysisResult.confidence_percent}%</div>
            <div className="citizen-stat-label">{t.aiConfidenceLabel}</div>
          </div>
          <div className="citizen-stat">
            <div className="citizen-stat-num">
              {analysisResult.estimated_new_cases_next_week || "—"}
            </div>
            <div className="citizen-stat-label">{t.estNewCasesLabel}</div>
          </div>
          <div className="citizen-stat">
            <div className="citizen-stat-num">{analysisResult.incubation_period || "—"}</div>
            <div className="citizen-stat-label">{t.incubationPeriod}</div>
          </div>
        </div>
      )}

      {/* ===== PREVENTION & PRECAUTIONS GRID ===== */}
      {!isLoading && (
        <div className="prevention-grid" id="prevention-section">
          {/* Citizen Precautions */}
          <div className="prevention-card" id="precautions-card">
            <div className="prevention-card-header amber">
              <div className="prevention-card-icon amber">
                <Shield size={20} />
              </div>
              <h3>{t.precautionsSafety}</h3>
            </div>
            <ul className="prevention-list">
              {precautions.map((item, i) => (
                <li key={i}>
                  <span className="prevention-bullet amber">●</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Medicines & Supplies */}
          <div className="prevention-card" id="medicines-card">
            <div className="prevention-card-header emerald">
              <div className="prevention-card-icon emerald">
                <Pill size={20} />
              </div>
              <h3>{t.medicineSupplies}</h3>
            </div>
            <ul className="prevention-list">
              {medicines.map((item, i) => (
                <li key={i}>
                  <span className="prevention-bullet emerald">●</span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="prevention-card-footer">
              <BadgeAlert size={14} />
              {t.consultDoctor}
            </div>
          </div>

          {/* Water & Sanitation */}
          <div className="prevention-card" id="water-card">
            <div className="prevention-card-header blue">
              <div className="prevention-card-icon blue">
                <Droplets size={20} />
              </div>
              <h3>{t.waterSanitation}</h3>
            </div>
            <div className="prevention-advisory">
              <p>{waterAdvisory}</p>
            </div>
            <div className="prevention-tips">
              <div className="prevention-tip">
                <span className="prevention-bullet blue">●</span>
                {t.boilWater}
              </div>
              <div className="prevention-tip">
                <span className="prevention-bullet blue">●</span>
                {t.avoidStagnant}
              </div>
              <div className="prevention-tip">
                <span className="prevention-bullet blue">●</span>
                {t.useChlorine}
              </div>
            </div>
          </div>

          {/* At-Risk Groups */}
          <div className="prevention-card" id="risk-groups-card">
            <div className="prevention-card-header red">
              <div className="prevention-card-icon red">
                <HeartPulse size={20} />
              </div>
              <h3>{t.atRiskGroupsTitle}</h3>
            </div>
            <div className="risk-groups-list">
              {atRiskGroups.map((group, i) => (
                <div className="risk-group-item" key={i}>
                  <Users size={14} />
                  {group}
                </div>
              ))}
            </div>
            <div className="prevention-card-footer warning">
              <AlertTriangle size={14} />
              {t.extraPrecautions}
            </div>
          </div>
        </div>
      )}

      {/* ===== AREA RISK ZONES ===== */}
      {!isLoading && (
        <div className="citizen-card" id="area-risk-section">
          <div className="card-header">
            <h2 className="card-title">
              <MapPin size={18} /> {t.areaRiskLevels}
            </h2>
          </div>
          <div className="risk-zone-grid">
            {areaData.map((area, idx) => (
              <div className={`risk-zone-card ${area.risk.toLowerCase()}`} key={idx}>
                <div className="risk-zone-dot" style={{ background: area.color }} />
                <div className="risk-zone-info">
                  <div className="risk-zone-name">{area.name}</div>
                  <div className="risk-zone-cases">{area.cases} {t.casesReported}</div>
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
          {analysisResult?.affected_areas && (
            <div className="risk-zone-highlight">
              <AlertTriangle size={14} />
              <span>
                {t.highestRiskArea}: <strong>{analysisResult.highest_risk_area}</strong>
              </span>
            </div>
          )}
        </div>
      )}

      {/* ===== RECOMMENDED ACTIONS (from AI) ===== */}
      {!isLoading && analysisResult?.recommended_actions && (
        <div className="citizen-card" id="recommended-actions">
          <div className="card-header">
            <h2 className="card-title">
              <ShieldAlert size={18} /> {t.healthAuthorityRecommendations}
            </h2>
          </div>
          <div className="authority-actions">
            {analysisResult.recommended_actions.map((action, i) => (
              <div className="authority-action-item" key={i}>
                <div className="action-number">{i + 1}</div>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== EMERGENCY CONTACTS ===== */}
      <div className="emergency-section" id="emergency-contacts">
        <h2 className="emergency-title">
          <Phone size={20} /> {t.emergencyHelplines}
        </h2>
        <div className="emergency-grid">
          {emergencyContacts.map((contact, idx) => (
            <a
              key={idx}
              href={`tel:${contact.number}`}
              className="emergency-card"
              id={`emergency-${contact.number}`}
            >
              <div
                className="emergency-icon"
                style={{ background: `${contact.color}20`, color: contact.color }}
              >
                <contact.icon size={22} />
              </div>
              <div className="emergency-info">
                <div className="emergency-name">{contact.name}</div>
                <div className="emergency-number" style={{ color: contact.color }}>
                  {contact.number}
                </div>
              </div>
              <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
            </a>
          ))}
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="footer" id="citizen-footer">
        <p>
          {t.poweredBy} <strong>Google Gemini AI</strong> &bull; {t.allRightsReserved}
        </p>
        <p style={{ marginTop: 4 }}>{t.footerCitizenDisclaimer}</p>
      </footer>

      {/* ===== CHATBOT ===== */}
      <ChatBot />
    </div>
  );
}
