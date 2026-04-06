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
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState("form"); // "form" | "submitting" | "result"

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
      setStep("result");
    } catch (err) {
      setError(err.message);
      setStep("form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ hospital: "", age: "", gender: "", symptoms: "" });
    setSubmitSuccess(false);
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
        <div className={`doctor-progress-step ${step === "submitting" ? "active" : (step === "result" ? "done" : "")}`}>
          <div className="doctor-progress-icon">
            {step === "result" ? <CheckCircle2 size={18} /> : <Send size={18} />}
          </div>
          <span>Save Data</span>
        </div>
        <div className="doctor-progress-line" />
        <div className={`doctor-progress-step ${step === "result" ? "active" : ""}`}>
          <div className="doctor-progress-icon">
            <CheckCircle2 size={18} />
          </div>
          <span>Success</span>
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
              Submit Patient Report
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

      {/* ===== RESULTS ===== */}
      {step === "result" && (
        <div className="ai-results" style={{ animation: "fadeSlideIn 0.5s ease-out", maxWidth: 600, margin: "0 auto" }}>
          {/* Success Banner */}
          <div className="doctor-success-banner" id="success-banner" style={{ marginBottom: 24 }}>
            <CheckCircle2 size={24} />
            <div>
              <strong style={{ fontSize: "1.1rem" }}>Patient Report Logged Successfully</strong>
              <p style={{ marginTop: 4 }}>Data safely stored in the central clinical registry.</p>
            </div>
          </div>

          <div className="card" style={{ padding: 24, textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent-emerald-glow)", color: "var(--accent-emerald)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <ShieldAlert size={32} />
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 8 }}>Ready for AI Monitoring</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 20 }}>
              The HealthSentinel AI monitors the data stream automatically to detect sudden outbreaks.
            </p>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
              <button className="analyze-btn" onClick={resetForm} id="add-another-btn">
                <Stethoscope size={18} />
                Add Another Patient
              </button>
              <Link href="/" className="doctor-back-link" style={{ background: "rgba(255,255,255,0.05)", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                <TrendingUp size={18} />
                View Full Dashboard
              </Link>
            </div>
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
