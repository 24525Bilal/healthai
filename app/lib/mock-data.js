// app/lib/mock-data.js
// Mock clinical data for HealthSentinel AI — Chengannur & surrounding areas, Kerala
// In a real system, this would come from hospital APIs.

export const clinicalReports = [
  { id: "CR001", date: "2026-04-01", hospital: "Govt. Taluk Hospital Chengannur", area: "Chengannur Town", lat: 9.3162, lng: 76.6155, symptoms: "Acute watery diarrhea, vomiting, severe dehydration", age: 34, gender: "M" },
  { id: "CR002", date: "2026-04-01", hospital: "Govt. Taluk Hospital Chengannur", area: "Chengannur Town", lat: 9.3170, lng: 76.6162, symptoms: "Severe dehydration, abdominal cramps, rice-water stools", age: 28, gender: "F" },
  { id: "CR003", date: "2026-04-01", hospital: "Pushpagiri Medical College", area: "Tiruvalla", lat: 9.3853, lng: 76.5754, symptoms: "Profuse watery diarrhea, vomiting, weakness", age: 7, gender: "M" },
  { id: "CR004", date: "2026-04-02", hospital: "Believers Church Medical College", area: "Tiruvalla", lat: 9.3900, lng: 76.5800, symptoms: "Watery diarrhea, nausea, fever 38.5°C, muscle cramps", age: 45, gender: "F" },
  { id: "CR005", date: "2026-04-02", hospital: "Govt. Taluk Hospital Chengannur", area: "Pandanad", lat: 9.3350, lng: 76.6280, symptoms: "Vomiting, muscle cramps, extreme thirst, loose motions", age: 12, gender: "M" },
  { id: "CR006", date: "2026-04-02", hospital: "Govt. Taluk Hospital Chengannur", area: "Chengannur Town", lat: 9.3155, lng: 76.6148, symptoms: "Rice-water stools, rapid dehydration, cold clammy skin", age: 31, gender: "F" },
  { id: "CR007", date: "2026-04-03", hospital: "NSS Medical Mission Hospital", area: "Pandalam", lat: 9.2268, lng: 76.6780, symptoms: "High fever 39°C, body ache, headache, fatigue", age: 67, gender: "M" },
  { id: "CR008", date: "2026-04-03", hospital: "Govt. Taluk Hospital Chengannur", area: "Chengannur Town", lat: 9.3168, lng: 76.6160, symptoms: "Watery diarrhea, vomiting, cold clammy skin, low BP", age: 52, gender: "M" },
  { id: "CR009", date: "2026-04-03", hospital: "Pushpagiri Medical College", area: "Tiruvalla", lat: 9.3860, lng: 76.5760, symptoms: "Acute diarrhea, vomiting, severe cramps, dehydration", age: 23, gender: "F" },
  { id: "CR010", date: "2026-04-04", hospital: "Muthoot Medical Centre", area: "Kozhencherry", lat: 9.3420, lng: 76.7010, symptoms: "Mild fever, sore throat, runny nose, cough", age: 38, gender: "M" },
  { id: "CR011", date: "2026-04-04", hospital: "Govt. Taluk Hospital Chengannur", area: "Chengannur Town", lat: 9.3175, lng: 76.6170, symptoms: "Explosive watery diarrhea, electrolyte imbalance, collapse", age: 19, gender: "F" },
  { id: "CR012", date: "2026-04-04", hospital: "Believers Church Medical College", area: "Tiruvalla", lat: 9.3910, lng: 76.5810, symptoms: "Profuse diarrhea, vomiting, rapid heart rate", age: 41, gender: "M" },
  { id: "CR013", date: "2026-04-05", hospital: "Govt. Taluk Hospital Chengannur", area: "Budhanoor", lat: 9.3080, lng: 76.6050, symptoms: "Severe vomiting, watery diarrhea, pale skin, lethargy", age: 55, gender: "F" },
  { id: "CR014", date: "2026-04-05", hospital: "NSS Medical Mission Hospital", area: "Pandalam", lat: 9.2275, lng: 76.6790, symptoms: "Headache, mild fever, joint pain, fatigue", age: 30, gender: "M" },
  { id: "CR015", date: "2026-04-05", hospital: "Pushpagiri Medical College", area: "Tiruvalla", lat: 9.3870, lng: 76.5770, symptoms: "Watery diarrhea 8 times daily, dehydration, sunken eyes", age: 9, gender: "F" },
  { id: "CR016", date: "2026-04-06", hospital: "Muthoot Medical Centre", area: "Kozhencherry", lat: 9.3430, lng: 76.7020, symptoms: "Diarrhea 5+ times, dehydration, rapid heart rate", age: 27, gender: "M" },
  { id: "CR017", date: "2026-04-06", hospital: "Govt. Taluk Hospital Chengannur", area: "Chengannur Town", lat: 9.3180, lng: 76.6175, symptoms: "Severe watery diarrhea, vomiting, hypotension, dehydration", age: 63, gender: "F" },
  { id: "CR018", date: "2026-04-06", hospital: "Believers Church Medical College", area: "Aranmula", lat: 9.3180, lng: 76.6850, symptoms: "Acute gastroenteritis, vomiting, loose motions, fever", age: 35, gender: "M" },
  { id: "CR019", date: "2026-04-07", hospital: "Govt. Taluk Hospital Chengannur", area: "Chengannur Town", lat: 9.3165, lng: 76.6158, symptoms: "Explosive watery diarrhea, muscle cramps, collapse, cyanosis", age: 48, gender: "F" },
  { id: "CR020", date: "2026-04-07", hospital: "Pushpagiri Medical College", area: "Tiruvalla", lat: 9.3880, lng: 76.5780, symptoms: "Vomiting, dehydration, rice-water stools, rapid pulse", age: 16, gender: "M" },
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

// Area-wise data for the map — Chengannur & surrounding localities
export const areaData = [
  { name: "Chengannur Town", lat: 9.3162, lng: 76.6155, cases: 8, risk: "Critical", color: "#ef4444" },
  { name: "Tiruvalla", lat: 9.3853, lng: 76.5754, cases: 5, risk: "High", color: "#f97316" },
  { name: "Pandalam", lat: 9.2268, lng: 76.6780, cases: 2, risk: "Low", color: "#10b981" },
  { name: "Kozhencherry", lat: 9.3420, lng: 76.7010, cases: 2, risk: "Medium", color: "#f59e0b" },
  { name: "Pandanad", lat: 9.3350, lng: 76.6280, cases: 1, risk: "Low", color: "#10b981" },
  { name: "Aranmula", lat: 9.3180, lng: 76.6850, cases: 1, risk: "Low", color: "#10b981" },
  { name: "Budhanoor", lat: 9.3080, lng: 76.6050, cases: 1, risk: "Low", color: "#10b981" },
];
