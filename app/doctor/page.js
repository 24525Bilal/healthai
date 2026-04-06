// app/doctor/page.js
// Doctor Portal — allows doctors to submit patient reports to Firebase
// and automatically triggers AI outbreak analysis on the updated dataset.

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Stethoscope,
  Send,
  AlertTriangle,
  Shield,
  CheckCircle2,
  ArrowLeft,
  Brain,
  Building2,
  MapPin,
  User,
  Calendar,
  HeartPulse,
  ClipboardList,
  Loader2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { addClinicalReport, fetchClinicalReports } from "../lib/firestore-data";

// Hospital-to-Area mapping — Chengannur & surrounding areas
const hospitalAreaMap = {
  "Govt. Taluk Hospital Chengannur": { area: "Chengannur Town", lat: 9.3162, lng: 76.6155 },
  "Pushpagiri Medical College": { area: "Tiruvalla", lat: 9.3853, lng: 76.5754 },
  "Believers Church Medical College": { area: "Tiruvalla", lat: 9.3900, lng: 76.5800 },
  "Muthoot Medical Centre": { area: "Kozhencherry", lat: 9.3420, lng: 76.7010 },
  "NSS Medical Mission Hospital": { area: "Pandalam", lat: 9.2268, lng: 76.6780 },
};

export default function DoctorPortal() {
  const [formData, setFormData] = useState({
    hospital: "",
    age: "",
    gender: "",
    symptoms: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState("form"); // "form" | "submitting" | "analyzing" | "result"

  const selectedArea = formData.hospital
    ? hospitalAreaMap[formData.hospital]?.area || "Unknown"
    : "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitSuccess(false);
    setAnalysisResult(null);

    // Validate
    if (!formData.hospital || !formData.age || !formData.gender || !formData.symptoms.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      // ===== STEP 1: Save to Firebase =====
      setStep("submitting");
      setIsSubmitting(true);

      const today = new Date().toISOString().split("T")[0];
      const hospitalInfo = hospitalAreaMap[formData.hospital];
      const reportId = `CR${Date.now().toString().slice(-6)}`;

      const newReport = {
        id: reportId,
        date: today,
        hospital: formData.hospital,
        area: hospitalInfo.area,
        lat: hospitalInfo.lat,
        lng: hospitalInfo.lng,
        symptoms: formData.symptoms.trim(),
        age: parseInt(formData.age),
        gender: formData.gender,
      };

      const result = await addClinicalReport(newReport);
      if (!result.success) {
        throw new Error(result.error || "Failed to save report to database.");
      }

      setIsSubmitting(false);
      setSubmitSuccess(true);

      // ===== STEP 2: Fetch all reports and run AI Analysis =====
      setStep("analyzing");
      setIsAnalyzing(true);

      const allReports = await fetchClinicalReports();

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reports: allReports }),
      });

      const data = await response.json();

      if (data.success) {
        setAnalysisResult(data.analysis);
        setStep("result");
      } else {
        throw new Error(data.error || "AI analysis failed.");
      }
    } catch (err) {
      setError(err.message);
      setStep("form");
    } finally {
      setIsSubmitting(false);
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setFormData({ hospital: "", age: "", gender: "", symptoms: "" });
    setSubmitSuccess(false);
    setAnalysisResult(null);
    setError(null);
    setStep("form");
  };

  const getSeverityClass = (level) => {
    if (!level) return "warning";
    if (level === "Critical" || level === "High") return "critical";
    if (level === "Medium") return "warning";
    return "safe";
  };

  return (
    <div className="app-container">
      {/* ===== HEADER ===== */}
      <header className="header" id="doctor-header">
        <div className="header-left">
          <div className="header-logo" style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)" }}>
            <Stethoscope size={26} color="white" />
          </div>
          <div>
            <h1 className="header-title">Doctor Portal</h1>
            <p className="header-subtitle">HealthSentinel AI — Patient Report Submission</p>
          </div>
        </div>
        <div className="header-right">
          <Link href="/" className="doctor-back-link" id="back-to-dashboard">
            <ArrowLeft size={16} />
            Dashboard
          </Link>
        </div>
      </header>

      {/* ===== PROGRESS STEPS ===== */}
      <div className="doctor-progress" id="progress-bar">
        <div className={`doctor-progress-step ${step === "form" ? "active" : (step !== "form" ? "done" : "")}`}>
          <div className="doctor-progress-icon">
            {step !== "form" ? <CheckCircle2 size={18} /> : <ClipboardList size={18} />}
          </div>
          <span>Patient Details</span>
        </div>
        <div className="doctor-progress-line" />
        <div className={`doctor-progress-step ${step === "submitting" ? "active" : (step === "analyzing" || step === "result" ? "done" : "")}`}>
          <div className="doctor-progress-icon">
            {(step === "analyzing" || step === "result") ? <CheckCircle2 size={18} /> : <Send size={18} />}
          </div>
          <span>Save to Database</span>
        </div>
        <div className="doctor-progress-line" />
        <div className={`doctor-progress-step ${step === "analyzing" ? "active" : (step === "result" ? "done" : "")}`}>
          <div className="doctor-progress-icon">
            {step === "result" ? <CheckCircle2 size={18} /> : <Brain size={18} />}
          </div>
          <span>AI Analysis</span>
        </div>
        <div className="doctor-progress-line" />
        <div className={`doctor-progress-step ${step === "result" ? "active" : ""}`}>
          <div className="doctor-progress-icon">
            <Sparkles size={18} />
          </div>
          <span>Results</span>
        </div>
      </div>

      {/* ===== FORM ===== */}
      {(step === "form") && (
        <div className="card doctor-form-card" id="patient-form-card">
          <div className="card-header">
            <h2 className="card-title">
              <Stethoscope size={18} /> Submit Patient Report
            </h2>
            <span className="card-badge safe">Secure Entry</span>
          </div>

          {error && (
            <div className="doctor-error" id="form-error">
              <AlertTriangle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="doctor-form">
            {/* Hospital */}
            <div className="doctor-field">
              <label className="doctor-label">
                <Building2 size={14} /> Hospital
              </label>
              <select
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                className="doctor-select"
                id="hospital-select"
              >
                <option value="">Select Hospital</option>
                {Object.keys(hospitalAreaMap).map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            {/* Area (auto-filled) */}
            {selectedArea && (
              <div className="doctor-field">
                <label className="doctor-label">
                  <MapPin size={14} /> Area (Auto-detected)
                </label>
                <div className="doctor-area-display">
                  <MapPin size={14} />
                  {selectedArea}
                </div>
              </div>
            )}

            {/* Age & Gender Row */}
            <div className="doctor-field-row">
              <div className="doctor-field">
                <label className="doctor-label">
                  <User size={14} /> Patient Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g. 34"
                  min="0"
                  max="120"
                  className="doctor-input"
                  id="age-input"
                />
              </div>
              <div className="doctor-field">
                <label className="doctor-label">
                  <User size={14} /> Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="doctor-select"
                  id="gender-select"
                >
                  <option value="">Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
            </div>

            {/* Symptoms */}
            <div className="doctor-field">
              <label className="doctor-label">
                <HeartPulse size={14} /> Symptoms Observed
              </label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="Describe the patient's symptoms in detail, e.g. 'Acute watery diarrhea, vomiting, severe dehydration, cold clammy skin'"
                rows={4}
                className="doctor-textarea"
                id="symptoms-input"
              />
            </div>

            {/* Submit */}
            <button type="submit" className="analyze-btn" id="submit-report-btn">
              <Send size={18} />
              Submit Report & Run AI Analysis
              <Sparkles size={16} />
            </button>
          </form>
        </div>
      )}

      {/* ===== SUBMITTING STATE ===== */}
      {step === "submitting" && (
        <div className="card doctor-status-card">
          <div className="doctor-status-content">
            <Loader2 size={48} className="doctor-spin" style={{ color: "var(--accent-blue)" }} />
            <h3>Saving Patient Report to Database...</h3>
            <p>Securely uploading to Firebase Firestore</p>
          </div>
        </div>
      )}

      {/* ===== ANALYZING STATE ===== */}
      {step === "analyzing" && (
        <div className="card doctor-status-card">
          <div className="doctor-status-content">
            <Brain size={48} className="doctor-spin" style={{ color: "var(--accent-purple)" }} />
            <h3>AI is Analyzing All Reports...</h3>
            <p>Gemini AI is processing the full dataset including your new patient report</p>
          </div>
        </div>
      )}

      {/* ===== RESULTS ===== */}
      {step === "result" && analysisResult && (
        <div className="ai-results" style={{ animation: "fadeSlideIn 0.5s ease-out" }}>
          {/* Success Banner */}
          <div className="doctor-success-banner" id="success-banner">
            <CheckCircle2 size={22} />
            <div>
              <strong>Patient Report Logged Successfully</strong>
              <p>Report saved to Firebase and AI analysis complete</p>
            </div>
          </div>

          {/* Outbreak Summary */}
          <div className={`outbreak-summary ${getSeverityClass(analysisResult.severity_level)}`}>
            <div className="outbreak-title">
              {analysisResult.outbreak_detected ? (
                <AlertTriangle size={22} />
              ) : (
                <Shield size={22} />
              )}
              {analysisResult.outbreak_detected
                ? `⚠️ OUTBREAK DETECTED: ${analysisResult.disease_name}`
                : "✅ No Outbreak Detected"}
            </div>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.9rem" }}>
              {analysisResult.summary}
            </p>
            <div className="outbreak-meta">
              <div className="meta-item">
                <span className="meta-label">Confidence</span>
                <span className="meta-value">{analysisResult.confidence_percent}%</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Severity</span>
                <span className="meta-value">{analysisResult.severity_level}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Total Cases</span>
                <span className="meta-value">{analysisResult.total_suspected_cases}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Transmission</span>
                <span className="meta-value">{analysisResult.transmission_mode}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Trend</span>
                <span className="meta-value">{analysisResult.predicted_trend}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Est. New (7d)</span>
                <span className="meta-value">{analysisResult.estimated_new_cases_next_week}</span>
              </div>
            </div>
          </div>

          {/* Severity & Confidence */}
          <div className={`severity-indicator ${analysisResult.severity_level}`}>
            <div>
              <div className="severity-level">{analysisResult.severity_level}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 4 }}>
                City Threat Level
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
                AI Confidence: {analysisResult.confidence_percent}%
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

          {/* Quick Recommendations */}
          <div className="recommendations-grid">
            <div className="rec-section">
              <h3 className="rec-section-title blue">
                <Shield size={14} /> Recommended Actions
              </h3>
              <ul className="rec-list">
                {analysisResult.recommended_actions?.slice(0, 3).map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
            <div className="rec-section">
              <h3 className="rec-section-title amber">
                <HeartPulse size={14} /> Citizen Precautions
              </h3>
              <ul className="rec-list">
                {analysisResult.citizen_precautions?.slice(0, 3).map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
            <button className="analyze-btn" onClick={resetForm} id="add-another-btn" style={{ flex: 1 }}>
              <Stethoscope size={18} />
              Add Another Patient
            </button>
            <Link href="/" className="analyze-btn" id="view-dashboard-btn" style={{ flex: 1, textDecoration: "none", textAlign: "center" }}>
              <TrendingUp size={18} />
              View Full Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <p>
          Powered by <strong>Google Gemini AI</strong> &bull; Google Firebase &bull; HealthSentinel AI &copy; 2026
        </p>
        <p style={{ marginTop: 4 }}>
          All patient data is anonymized and encrypted. Built for public health readiness.
        </p>
      </footer>
    </div>
  );
}
