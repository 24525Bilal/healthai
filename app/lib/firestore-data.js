// app/lib/firestore-data.js
// Fetches clinical reports and resources from Firebase Firestore.
// Falls back to mock data if Firestore is empty or errors out.

import { db } from "./firebase";
import { collection, getDocs, addDoc, orderBy, query } from "firebase/firestore";
import {
  clinicalReports as mockReports,
  trendData as mockTrendData,
  resourceData as mockResourceData,
  areaData as mockAreaData,
} from "./mock-data";

// Fetch clinical reports from Firestore
export async function fetchClinicalReports() {
  try {
    const q = query(collection(db, "clinical_reports"), orderBy("date", "asc"));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      console.log("Firestore empty, using mock clinical reports");
      return mockReports;
    }
    const reports = snapshot.docs.map((doc) => ({ _docId: doc.id, ...doc.data() }));
    console.log(`Fetched ${reports.length} clinical reports from Firestore`);
    return reports;
  } catch (err) {
    console.error("Error fetching clinical reports from Firestore:", err);
    return mockReports;
  }
}

// Fetch resources from Firestore
export async function fetchResources() {
  try {
    const snapshot = await getDocs(collection(db, "resources"));
    if (snapshot.empty) {
      console.log("Firestore empty, using mock resource data");
      return mockResourceData;
    }
    const resources = snapshot.docs.map((doc) => ({ _docId: doc.id, ...doc.data() }));
    console.log(`Fetched ${resources.length} resources from Firestore`);
    return resources;
  } catch (err) {
    console.error("Error fetching resources from Firestore:", err);
    return mockResourceData;
  }
}

// Add a new clinical report to Firestore
export async function addClinicalReport(report) {
  try {
    const docRef = await addDoc(collection(db, "clinical_reports"), report);
    console.log("Report added with ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (err) {
    console.error("Error adding report:", err);
    return { success: false, error: err.message };
  }
}

// Build trend data dynamically from clinical reports
export function buildTrendData(reports) {
  if (!reports || reports.length === 0) return mockTrendData;

  const dateMap = {};
  reports.forEach((r) => {
    const dateKey = r.date;
    if (!dateMap[dateKey]) {
      dateMap[dateKey] = { totalCases: 0, diarrhea: 0, fever: 0, respiratory: 0 };
    }
    dateMap[dateKey].totalCases++;

    const sym = (r.symptoms || "").toLowerCase();
    if (sym.includes("diarrhea") || sym.includes("vomiting") || sym.includes("stool")) {
      dateMap[dateKey].diarrhea++;
    } else if (sym.includes("fever") || sym.includes("headache") || sym.includes("body ache")) {
      dateMap[dateKey].fever++;
    } else if (sym.includes("cough") || sym.includes("sore throat") || sym.includes("runny nose")) {
      dateMap[dateKey].respiratory++;
    }
  });

  const sortedDates = Object.keys(dateMap).sort();
  return sortedDates.map((date) => {
    const d = new Date(date);
    const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    return { date: label, ...dateMap[date] };
  });
}

// Build area risk data dynamically from clinical reports
export function buildAreaData(reports) {
  if (!reports || reports.length === 0) return mockAreaData;

  // Default coordinates for known areas
  const areaCoords = {
    "North Zone": { lat: 28.7041, lng: 77.1025 },
    "East Zone": { lat: 28.6328, lng: 77.2197 },
    "South Zone": { lat: 28.5355, lng: 77.3910 },
    "West Zone": { lat: 28.6562, lng: 77.0595 },
  };

  const areaMap = {};
  reports.forEach((r) => {
    const area = r.area;
    if (!areaMap[area]) {
      const coords = areaCoords[area] || { lat: r.lat || 0, lng: r.lng || 0 };
      areaMap[area] = { name: area, ...coords, cases: 0 };
    }
    areaMap[area].cases++;
  });

  // Assign risk levels based on case counts
  return Object.values(areaMap).map((a) => {
    let risk, color;
    if (a.cases >= 8) {
      risk = "Critical";
      color = "#ef4444";
    } else if (a.cases >= 5) {
      risk = "High";
      color = "#f97316";
    } else if (a.cases >= 3) {
      risk = "Medium";
      color = "#f59e0b";
    } else {
      risk = "Low";
      color = "#10b981";
    }
    return { ...a, risk, color };
  });
}
