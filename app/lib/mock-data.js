// app/lib/mock-data.js
// This file contains all the mock data for our hackathon demo.
// In a real system, this would come from hospital APIs.

export const clinicalReports = [
  { id: "CR001", date: "2026-04-01", hospital: "City General Hospital", area: "North Zone", lat: 28.7041, lng: 77.1025, symptoms: "Acute watery diarrhea, vomiting, severe dehydration", age: 34, gender: "M" },
  { id: "CR002", date: "2026-04-01", hospital: "City General Hospital", area: "North Zone", lat: 28.7090, lng: 77.1080, symptoms: "Severe dehydration, abdominal cramps, rice-water stools", age: 28, gender: "F" },
  { id: "CR003", date: "2026-04-01", hospital: "Sunrise Clinic", area: "North Zone", lat: 28.7120, lng: 77.0990, symptoms: "Profuse watery diarrhea, vomiting, weakness", age: 7, gender: "M" },
  { id: "CR004", date: "2026-04-02", hospital: "Metro Hospital", area: "East Zone", lat: 28.6328, lng: 77.2197, symptoms: "Watery diarrhea, nausea, fever 38.5°C, muscle cramps", age: 45, gender: "F" },
  { id: "CR005", date: "2026-04-02", hospital: "Metro Hospital", area: "East Zone", lat: 28.6380, lng: 77.2250, symptoms: "Vomiting, muscle cramps, extreme thirst, loose motions", age: 12, gender: "M" },
  { id: "CR006", date: "2026-04-02", hospital: "City General Hospital", area: "North Zone", lat: 28.7050, lng: 77.1050, symptoms: "Rice-water stools, rapid dehydration, cold clammy skin", age: 31, gender: "F" },
  { id: "CR007", date: "2026-04-03", hospital: "Sunrise Clinic", area: "South Zone", lat: 28.5355, lng: 77.3910, symptoms: "High fever 39°C, body ache, headache, fatigue", age: 67, gender: "M" },
  { id: "CR008", date: "2026-04-03", hospital: "City General Hospital", area: "North Zone", lat: 28.7060, lng: 77.1060, symptoms: "Watery diarrhea, vomiting, cold clammy skin, low BP", age: 52, gender: "M" },
  { id: "CR009", date: "2026-04-03", hospital: "Metro Hospital", area: "East Zone", lat: 28.6340, lng: 77.2210, symptoms: "Acute diarrhea, vomiting, severe cramps, dehydration", age: 23, gender: "F" },
  { id: "CR010", date: "2026-04-04", hospital: "Apollo Clinic", area: "West Zone", lat: 28.6562, lng: 77.0595, symptoms: "Mild fever, sore throat, runny nose, cough", age: 38, gender: "M" },
  { id: "CR011", date: "2026-04-04", hospital: "City General Hospital", area: "North Zone", lat: 28.7080, lng: 77.1040, symptoms: "Explosive watery diarrhea, electrolyte imbalance, collapse", age: 19, gender: "F" },
  { id: "CR012", date: "2026-04-04", hospital: "Metro Hospital", area: "East Zone", lat: 28.6350, lng: 77.2230, symptoms: "Profuse diarrhea, vomiting, rapid heart rate", age: 41, gender: "M" },
  { id: "CR013", date: "2026-04-05", hospital: "City General Hospital", area: "North Zone", lat: 28.7100, lng: 77.1070, symptoms: "Severe vomiting, watery diarrhea, pale skin, lethargy", age: 55, gender: "F" },
  { id: "CR014", date: "2026-04-05", hospital: "Sunrise Clinic", area: "South Zone", lat: 28.5370, lng: 77.3920, symptoms: "Headache, mild fever, joint pain, fatigue", age: 30, gender: "M" },
  { id: "CR015", date: "2026-04-05", hospital: "Metro Hospital", area: "East Zone", lat: 28.6360, lng: 77.2190, symptoms: "Watery diarrhea 8 times daily, dehydration, sunken eyes", age: 9, gender: "F" },
  { id: "CR016", date: "2026-04-06", hospital: "Apollo Clinic", area: "West Zone", lat: 28.6580, lng: 77.0610, symptoms: "Diarrhea 5+ times, dehydration, rapid heart rate", age: 27, gender: "M" },
  { id: "CR017", date: "2026-04-06", hospital: "City General Hospital", area: "North Zone", lat: 28.7070, lng: 77.1030, symptoms: "Severe watery diarrhea, vomiting, hypotension, dehydration", age: 63, gender: "F" },
  { id: "CR018", date: "2026-04-06", hospital: "Metro Hospital", area: "East Zone", lat: 28.6370, lng: 77.2240, symptoms: "Acute gastroenteritis, vomiting, loose motions, fever", age: 35, gender: "M" },
  { id: "CR019", date: "2026-04-07", hospital: "City General Hospital", area: "North Zone", lat: 28.7110, lng: 77.1090, symptoms: "Explosive watery diarrhea, muscle cramps, collapse, cyanosis", age: 48, gender: "F" },
  { id: "CR020", date: "2026-04-07", hospital: "Metro Hospital", area: "East Zone", lat: 28.6390, lng: 77.2200, symptoms: "Vomiting, dehydration, rice-water stools, rapid pulse", age: 16, gender: "M" },
];

// Aggregated symptom trend data (daily case counts)
export const trendData = [
  { date: "Apr 1", totalCases: 3, diarrhea: 3, fever: 0, respiratory: 0 },
  { date: "Apr 2", totalCases: 3, diarrhea: 3, fever: 0, respiratory: 0 },
  { date: "Apr 3", totalCases: 3, diarrhea: 2, fever: 1, respiratory: 0 },
  { date: "Apr 4", totalCases: 3, diarrhea: 2, fever: 0, respiratory: 1 },
  { date: "Apr 5", totalCases: 3, diarrhea: 3, fever: 0, respiratory: 0 },
  { date: "Apr 6", totalCases: 3, diarrhea: 3, fever: 0, respiratory: 0 },
  { date: "Apr 7", totalCases: 2, diarrhea: 2, fever: 0, respiratory: 0 },
];

// Resource/medicine availability data
export const resourceData = [
  { name: "ORS Packets", stock: 1200, capacity: 5000, unit: "packets", status: "low" },
  { name: "IV Fluids (Ringer Lactate)", stock: 340, capacity: 1000, unit: "units", status: "low" },
  { name: "Doxycycline (Antibiotic)", stock: 800, capacity: 2000, unit: "tablets", status: "medium" },
  { name: "Azithromycin", stock: 1500, capacity: 2000, unit: "tablets", status: "high" },
  { name: "Zinc Supplements", stock: 600, capacity: 3000, unit: "tablets", status: "low" },
  { name: "Chlorine Tablets (Water)", stock: 4500, capacity: 5000, unit: "tablets", status: "high" },
  { name: "PPE Kits", stock: 280, capacity: 1000, unit: "kits", status: "low" },
  { name: "Hospital Beds Available", stock: 45, capacity: 200, unit: "beds", status: "low" },
];

// Area-wise data for the map
export const areaData = [
  { name: "North Zone", lat: 28.7041, lng: 77.1025, cases: 9, risk: "Critical", color: "#ef4444" },
  { name: "East Zone", lat: 28.6328, lng: 77.2197, cases: 7, risk: "High", color: "#f97316" },
  { name: "South Zone", lat: 28.5355, lng: 77.3910, cases: 2, risk: "Low", color: "#10b981" },
  { name: "West Zone", lat: 28.6562, lng: 77.0595, cases: 2, risk: "Low", color: "#10b981" },
];
