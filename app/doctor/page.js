// app/doctor/page.js
// Doctor Portal — allows doctors to submit patient reports to Firebase
// and track rare medicines exclusive to the medical staff.

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Stethoscope,
  Send,
  AlertTriangle,
  Shield,
  CheckCircle2,
  ArrowLeft,
  Building2,
  MapPin,
  User,
  HeartPulse,
  ClipboardList,
  Loader2,
  TrendingUp,
  Pill,
  Database,
  Plus
} from "lucide-react";
import { addClinicalReport, fetchRareMedicines, addRareMedicine } from "../lib/firestore-data";

// Hospital-to-Area mapping — Chengannur & surrounding areas
const hospitalAreaMap = {
  "Govt. Taluk Hospital Chengannur": { area: "Chengannur Town", lat: 9.3162, lng: 76.6155 },
  "Pushpagiri Medical College": { area: "Tiruvalla", lat: 9.3853, lng: 76.5754 },
  "Believers Church Medical College": { area: "Tiruvalla", lat: 9.3900, lng: 76.5800 },
  "Muthoot Medical Centre": { area: "Kozhencherry", lat: 9.3420, lng: 76.7010 },
  "NSS Medical Mission Hospital": { area: "Pandalam", lat: 9.2268, lng: 76.6780 },
};

export default function DoctorPortal() {
  const [activeTab, setActiveTab] = useState("patients"); // "patients" | "medicines"

  // Patient Form State
  const [formData, setFormData] = useState({
    hospital: "",
    age: "",
    gender: "",
    symptoms: "",
  });
  const [isSubmittingPatient, setIsSubmittingPatient] = useState(false);
  const [patientSubmitSuccess, setPatientSubmitSuccess] = useState(false);
  const [patientError, setPatientError] = useState(null);
  const [patientStep, setPatientStep] = useState("form"); // "form" | "submitting" | "result"

  // Medicines State
  const [rareMedicines, setRareMedicines] = useState([]);
  const [isLoadingMeds, setIsLoadingMeds] = useState(false);
  const [medData, setMedData] = useState({ name: "", stock: "", capacity: "" });
  const [isSubmittingMed, setIsSubmittingMed] = useState(false);
  const [medError, setMedError] = useState(null);

  // Load medicines on mount
  useEffect(() => {
    loadMedicines();
  }, []);

  const loadMedicines = async () => {
    setIsLoadingMeds(true);
    const m = await fetchRareMedicines();
    setRareMedicines(m);
    setIsLoadingMeds(false);
  };

  const selectedArea = formData.hospital
    ? hospitalAreaMap[formData.hospital]?.area || "Unknown"
    : "";

  const handlePatientChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMedChange = (e) => {
    const { name, value } = e.target;
    setMedData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    setPatientError(null);
    setPatientSubmitSuccess(false);

    if (!formData.hospital || !formData.age || !formData.gender || !formData.symptoms.trim()) {
      setPatientError("Please fill in all fields.");
      return;
    }

    try {
      setPatientStep("submitting");
      setIsSubmittingPatient(true);

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

      setIsSubmittingPatient(false);
      setPatientSubmitSuccess(true);
      setPatientStep("result");
    } catch (err) {
      setPatientError(err.message);
      setPatientStep("form");
    } finally {
      setIsSubmittingPatient(false);
    }
  };

  const handleMedSubmit = async (e) => {
    e.preventDefault();
    setMedError(null);

    if (!medData.name.trim() || !medData.stock || !medData.capacity) {
      setMedError("Please fill in all medicine details.");
      return;
    }

    try {
      setIsSubmittingMed(true);
      const newMed = {
        name: medData.name.trim(),
        stock: parseInt(medData.stock),
        capacity: parseInt(medData.capacity),
        unit: "units",
        status: parseInt(medData.stock) < (parseInt(medData.capacity) * 0.2) ? "low" : "medium"
      };

      const result = await addRareMedicine(newMed);
      if (!result.success) throw new Error(result.error || "Failed to add medicine.");

      setMedData({ name: "", stock: "", capacity: "" });
      loadMedicines(); // Reload list
    } catch (err) {
      setMedError(err.message);
    } finally {
      setIsSubmittingMed(false);
    }
  };

  const resetPatientForm = () => {
    setFormData({ hospital: "", age: "", gender: "", symptoms: "" });
    setPatientSubmitSuccess(false);
    setPatientError(null);
    setPatientStep("form");
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
            <p className="header-subtitle">HealthSentinel AI — Clinical Registry</p>
          </div>
        </div>
        <div className="header-right">
          <Link href="/" className="doctor-back-link" id="back-to-dashboard">
            <ArrowLeft size={16} />
            Dashboard
          </Link>
        </div>
      </header>

      {/* ===== TABS ===== */}
      <div className="tabs" style={{ maxWidth: 600, margin: "0 auto 24px" }}>
        <button 
          className={`tab ${activeTab === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveTab('patients')}
        >
          <User size={16} />
          Patient Registry
        </button>
        <button 
          className={`tab ${activeTab === 'medicines' ? 'active' : ''}`}
          onClick={() => setActiveTab('medicines')}
        >
          <Pill size={16} />
          Rare Medicines
        </button>
      </div>

      {/* ========================================= */}
      {/* ============= PATIENT TAB =============== */}
      {/* ========================================= */}
      {activeTab === "patients" && (
        <>
          {/* PROGRESS STEPS */}
          <div className="doctor-progress" id="progress-bar">
            <div className={`doctor-progress-step ${patientStep === "form" ? "active" : (patientStep !== "form" ? "done" : "")}`}>
              <div className="doctor-progress-icon">
                {patientStep !== "form" ? <CheckCircle2 size={18} /> : <ClipboardList size={18} />}
              </div>
              <span>Patient Details</span>
            </div>
            <div className="doctor-progress-line" />
            <div className={`doctor-progress-step ${patientStep === "submitting" ? "active" : (patientStep === "result" ? "done" : "")}`}>
              <div className="doctor-progress-icon">
                {patientStep === "result" ? <CheckCircle2 size={18} /> : <Send size={18} />}
              </div>
              <span>Save Data</span>
            </div>
            <div className="doctor-progress-line" />
            <div className={`doctor-progress-step ${patientStep === "result" ? "active" : ""}`}>
              <div className="doctor-progress-icon">
                <CheckCircle2 size={18} />
              </div>
              <span>Success</span>
            </div>
          </div>

          {/* FORM */}
          {(patientStep === "form") && (
            <div className="card doctor-form-card" id="patient-form-card">
              <div className="card-header">
                <h2 className="card-title">
                  <Stethoscope size={18} /> Submit Patient Report
                </h2>
                <span className="card-badge safe">Secure Entry</span>
              </div>

              {patientError && (
                <div className="doctor-error" id="form-error">
                  <AlertTriangle size={16} />
                  {patientError}
                </div>
              )}

              <form onSubmit={handlePatientSubmit} className="doctor-form">
                <div className="doctor-field">
                  <label className="doctor-label"><Building2 size={14} /> Hospital</label>
                  <select name="hospital" value={formData.hospital} onChange={handlePatientChange} className="doctor-select">
                    <option value="">Select Hospital</option>
                    {Object.keys(hospitalAreaMap).map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                {selectedArea && (
                  <div className="doctor-field">
                    <label className="doctor-label"><MapPin size={14} /> Area</label>
                    <div className="doctor-area-display"><MapPin size={14} />{selectedArea}</div>
                  </div>
                )}
                <div className="doctor-field-row">
                  <div className="doctor-field">
                    <label className="doctor-label"><User size={14} /> Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handlePatientChange} placeholder="e.g. 34" min="0" max="120" className="doctor-input"/>
                  </div>
                  <div className="doctor-field">
                    <label className="doctor-label"><User size={14} /> Gender</label>
                    <select name="gender" value={formData.gender} onChange={handlePatientChange} className="doctor-select">
                      <option value="">Select Gender</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                      <option value="O">Other</option>
                    </select>
                  </div>
                </div>
                <div className="doctor-field">
                  <label className="doctor-label"><HeartPulse size={14} /> Symptoms</label>
                  <textarea name="symptoms" value={formData.symptoms} onChange={handlePatientChange} placeholder="Describe symptoms..." rows={4} className="doctor-textarea"/>
                </div>
                <button type="submit" className="analyze-btn">
                  <Send size={18} /> Submit Patient Report
                </button>
              </form>
            </div>
          )}

          {/* SUBMITTING */}
          {patientStep === "submitting" && (
            <div className="card doctor-status-card">
              <div className="doctor-status-content">
                <Loader2 size={48} className="doctor-spin" style={{ color: "var(--accent-blue)" }} />
                <h3>Saving Patient Report...</h3>
              </div>
            </div>
          )}

          {/* RESULTS */}
          {patientStep === "result" && (
            <div className="ai-results" style={{ maxWidth: 600, margin: "0 auto" }}>
              <div className="doctor-success-banner" style={{ marginBottom: 24 }}>
                <CheckCircle2 size={24} />
                <div>
                  <strong style={{ fontSize: "1.1rem" }}>Patient Report Logged</strong>
                </div>
              </div>
              <div className="card" style={{ padding: 24, textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--accent-emerald-glow)", color: "var(--accent-emerald)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <ShieldAlert size={32} />
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: 8 }}>Ready for Monitoring</h3>
                <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
                  <button className="analyze-btn" onClick={resetPatientForm}><Stethoscope size={18} />Add Another</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ========================================= */}
      {/* =========== RARE MEDICINES TAB ========== */}
      {/* ========================================= */}
      {activeTab === "medicines" && (
        <div style={{ animation: "fadeSlideIn 0.4s ease-out" }}>
          <div className="dashboard-grid">
            {/* Add Medicine Form */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <Pill size={18} /> Add Rare Medicine
                </h2>
                <span className="card-badge warning">Doctor Exclusive</span>
              </div>
              
              {medError && (
                <div className="doctor-error" style={{ marginBottom: 16 }}>
                  <AlertTriangle size={16} />
                  {medError}
                </div>
              )}

              <form onSubmit={handleMedSubmit} className="doctor-form">
                <div className="doctor-field">
                  <label className="doctor-label"><Database size={14} /> Medicine Name</label>
                  <input type="text" name="name" value={medData.name} onChange={handleMedChange} placeholder="e.g. Anti-Venom, Paxlovid" className="doctor-input"/>
                </div>

                <div className="doctor-field-row">
                  <div className="doctor-field">
                    <label className="doctor-label"><Database size={14} /> Current Stock</label>
                    <input type="number" name="stock" value={medData.stock} onChange={handleMedChange} placeholder="e.g. 50" min="0" className="doctor-input"/>
                  </div>
                  <div className="doctor-field">
                    <label className="doctor-label"><Database size={14} /> Max Capacity</label>
                    <input type="number" name="capacity" value={medData.capacity} onChange={handleMedChange} placeholder="e.g. 200" min="1" className="doctor-input"/>
                  </div>
                </div>

                <button type="submit" className="analyze-btn" disabled={isSubmittingMed} style={{ background: "linear-gradient(135deg, var(--accent-emerald), #34d399)" }}>
                  {isSubmittingMed ? <Loader2 size={18} className="doctor-spin"/> : <Plus size={18}/>}
                  {isSubmittingMed ? "Saving..." : "Add to Inventory"}
                </button>
              </form>
            </div>

            {/* Inventory List */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <Database size={18} /> Current Inventory
                </h2>
              </div>
              
              {isLoadingMeds ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
                  <Loader2 size={32} className="doctor-spin" style={{ color: "var(--text-muted)" }}/>
                </div>
              ) : rareMedicines.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)" }}>
                  <Pill size={48} style={{ opacity: 0.2, margin: "0 auto 16px" }} />
                  <p>No rare medicines in inventory yet.</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table className="resource-table" style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Stock Level</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rareMedicines.map((med, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 500 }}>{med.name}</td>
                          <td>
                            <div style={{ fontSize: "0.8rem", marginBottom: 6 }}>
                              {med.stock} / {med.capacity}
                            </div>
                            <div className="stock-bar">
                              <div 
                                className={`stock-bar-fill ${med.status || "low"}`} 
                                style={{ width: `${Math.min(100, Math.max(0, (med.stock / med.capacity) * 100))}%` }}
                              />
                            </div>
                          </td>
                          <td>
                            <span className={`stock-status ${med.status || "low"}`}>{med.status || "Low"}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== FOOTER ===== */}
      <footer className="footer" style={{ marginTop: 40 }}>
        <p>
          Powered by <strong>Google Gemini AI</strong> &bull; Google Firebase &bull; HealthSentinel AI &copy; 2026
        </p>
      </footer>
    </div>
  );
}
