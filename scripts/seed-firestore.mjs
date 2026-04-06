// scripts/seed-firestore.mjs
// Run this ONCE to upload mock data to your Firebase Firestore database.
// Usage: node scripts/seed-firestore.mjs
//
// BEFORE RUNNING: Replace the firebaseConfig values below with YOUR values
// from Firebase Console → Project Settings → Your Apps → Web App

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

// ⚠️ REPLACE THESE WITH YOUR REAL FIREBASE CONFIG ⚠️
const firebaseConfig = {
  apiKey: "PASTE_YOUR_FIREBASE_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const mockReports = [
  { id: "CR001", date: "2026-04-01", hospital: "City General Hospital", area: "North Zone", symptoms: "Acute watery diarrhea, vomiting, severe dehydration", age: 34, gender: "M" },
  { id: "CR002", date: "2026-04-01", hospital: "City General Hospital", area: "North Zone", symptoms: "Severe dehydration, abdominal cramps, rice-water stools", age: 28, gender: "F" },
  { id: "CR003", date: "2026-04-01", hospital: "Sunrise Clinic", area: "North Zone", symptoms: "Profuse watery diarrhea, vomiting, weakness", age: 7, gender: "M" },
  { id: "CR004", date: "2026-04-02", hospital: "Metro Hospital", area: "East Zone", symptoms: "Watery diarrhea, nausea, fever 38.5C, muscle cramps", age: 45, gender: "F" },
  { id: "CR005", date: "2026-04-02", hospital: "Metro Hospital", area: "East Zone", symptoms: "Vomiting, muscle cramps, extreme thirst, loose motions", age: 12, gender: "M" },
  { id: "CR006", date: "2026-04-02", hospital: "City General Hospital", area: "North Zone", symptoms: "Rice-water stools, rapid dehydration, cold clammy skin", age: 31, gender: "F" },
  { id: "CR007", date: "2026-04-03", hospital: "Sunrise Clinic", area: "South Zone", symptoms: "High fever 39C, body ache, headache, fatigue", age: 67, gender: "M" },
  { id: "CR008", date: "2026-04-03", hospital: "City General Hospital", area: "North Zone", symptoms: "Watery diarrhea, vomiting, cold clammy skin, low BP", age: 52, gender: "M" },
  { id: "CR009", date: "2026-04-03", hospital: "Metro Hospital", area: "East Zone", symptoms: "Acute diarrhea, vomiting, severe cramps, dehydration", age: 23, gender: "F" },
  { id: "CR010", date: "2026-04-04", hospital: "Apollo Clinic", area: "West Zone", symptoms: "Mild fever, sore throat, runny nose, cough", age: 38, gender: "M" },
  { id: "CR011", date: "2026-04-04", hospital: "City General Hospital", area: "North Zone", symptoms: "Explosive watery diarrhea, electrolyte imbalance, collapse", age: 19, gender: "F" },
  { id: "CR012", date: "2026-04-04", hospital: "Metro Hospital", area: "East Zone", symptoms: "Profuse diarrhea, vomiting, rapid heart rate", age: 41, gender: "M" },
  { id: "CR013", date: "2026-04-05", hospital: "City General Hospital", area: "North Zone", symptoms: "Severe vomiting, watery diarrhea, pale skin, lethargy", age: 55, gender: "F" },
  { id: "CR014", date: "2026-04-05", hospital: "Sunrise Clinic", area: "South Zone", symptoms: "Headache, mild fever, joint pain, fatigue", age: 30, gender: "M" },
  { id: "CR015", date: "2026-04-05", hospital: "Metro Hospital", area: "East Zone", symptoms: "Watery diarrhea 8 times daily, dehydration, sunken eyes", age: 9, gender: "F" },
  { id: "CR016", date: "2026-04-06", hospital: "Apollo Clinic", area: "West Zone", symptoms: "Diarrhea 5+ times, dehydration, rapid heart rate", age: 27, gender: "M" },
  { id: "CR017", date: "2026-04-06", hospital: "City General Hospital", area: "North Zone", symptoms: "Severe watery diarrhea, vomiting, hypotension, dehydration", age: 63, gender: "F" },
  { id: "CR018", date: "2026-04-06", hospital: "Metro Hospital", area: "East Zone", symptoms: "Acute gastroenteritis, vomiting, loose motions, fever", age: 35, gender: "M" },
  { id: "CR019", date: "2026-04-07", hospital: "City General Hospital", area: "North Zone", symptoms: "Explosive watery diarrhea, muscle cramps, collapse, cyanosis", age: 48, gender: "F" },
  { id: "CR020", date: "2026-04-07", hospital: "Metro Hospital", area: "East Zone", symptoms: "Vomiting, dehydration, rice-water stools, rapid pulse", age: 16, gender: "M" },
];

const resourceData = [
  { name: "ORS Packets", stock: 1200, capacity: 5000, unit: "packets", status: "low" },
  { name: "IV Fluids (Ringer Lactate)", stock: 340, capacity: 1000, unit: "units", status: "low" },
  { name: "Doxycycline (Antibiotic)", stock: 800, capacity: 2000, unit: "tablets", status: "medium" },
  { name: "Azithromycin", stock: 1500, capacity: 2000, unit: "tablets", status: "high" },
  { name: "Zinc Supplements", stock: 600, capacity: 3000, unit: "tablets", status: "low" },
  { name: "Chlorine Tablets (Water)", stock: 4500, capacity: 5000, unit: "tablets", status: "high" },
  { name: "PPE Kits", stock: 280, capacity: 1000, unit: "kits", status: "low" },
  { name: "Hospital Beds Available", stock: 45, capacity: 200, unit: "beds", status: "low" },
];

async function seedData() {
  console.log("🏥 Seeding Firestore with clinical reports...\n");

  // Check if data already exists
  const existing = await getDocs(collection(db, "clinical_reports"));
  if (existing.size > 0) {
    console.log(`⚠️  Firestore already has ${existing.size} reports. Skipping to avoid duplicates.`);
    console.log("   Delete the collection in Firebase Console if you want to re-seed.\n");
  } else {
    for (const report of mockReports) {
      await addDoc(collection(db, "clinical_reports"), report);
      console.log(`  ✅ Added: ${report.id} - ${report.hospital} (${report.area})`);
    }
    console.log(`\n✅ ${mockReports.length} clinical reports added!\n`);
  }

  console.log("💊 Seeding Firestore with resource data...\n");

  const existingRes = await getDocs(collection(db, "resources"));
  if (existingRes.size > 0) {
    console.log(`⚠️  Firestore already has ${existingRes.size} resource entries. Skipping.\n`);
  } else {
    for (const res of resourceData) {
      await addDoc(collection(db, "resources"), res);
      console.log(`  ✅ Added: ${res.name} (${res.stock}/${res.capacity} ${res.unit})`);
    }
    console.log(`\n✅ ${resourceData.length} resource entries added!\n`);
  }

  console.log("🎉 Done! Check your Firebase Console → Firestore to see the data.");
  process.exit(0);
}

seedData().catch((err) => {
  console.error("❌ Error seeding data:", err.message);
  process.exit(1);
});
