# HealthSentinel AI 🏥🛡️

> AI-powered public health assistant that proactively detects and manages disease outbreaks by analyzing anonymized clinical data from hospitals.

![Built with](https://img.shields.io/badge/Built%20with-Next.js-black)
![AI](https://img.shields.io/badge/AI-Google%20Gemini%201.5-blue)
![Database](https://img.shields.io/badge/Database-Firebase%20Firestore-orange)
![Status](https://img.shields.io/badge/Status-Live-green)

## 🚀 What It Does

HealthSentinel AI aggregates anonymized diagnosis reports from hospitals and uses **Google Gemini AI** to identify emerging patterns in symptoms — enabling **early detection of potential outbreaks**.

### Key Features
- **🤖 AI Outbreak Detection** — Gemini AI analyzes clinical reports to detect disease clusters
- **📊 Real-time Symptom Trends** — Interactive charts showing symptom patterns over time
- **⚠️ Severity Assessment** — Confidence scores, risk levels, and predicted case trends
- **💊 Resource Monitoring** — Track medicine and hospital resource availability
- **🏥 Anonymized Reports** — View all clinical data without exposing patient identities
- **📋 Actionable Recommendations** — AI-generated guidance for health authorities and citizens

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15** | Full-stack React framework |
| **Google Gemini AI** | Disease pattern analysis & outbreak prediction |
| **Google Firebase** | Firestore database + Hosting |
| **Recharts** | Interactive data visualization |
| **Lucide React** | Modern icon system |

## 📦 Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env.local` and fill in your API keys:
```bash
cp .env.example .env.local
```

### 3. Seed Firestore (optional)
Edit `scripts/seed-firestore.mjs` with your Firebase config, then:
```bash
node scripts/seed-firestore.mjs
```

### 4. Run locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 📸 Screenshots

- **Dashboard Overview** — Symptom trend charts and area risk assessment
- **AI Analysis** — One-click Gemini AI analysis with outbreak detection results
- **Resource Monitor** — Medicine availability with shortage alerts
- **Clinical Reports** — Anonymized patient data in a searchable table

## 🏗️ Architecture

```
User → Next.js Frontend → /api/analyze → Google Gemini AI
                        → Firebase Firestore (data storage)
                        → Firebase Hosting (deployment)
```

## 👥 Team

Built during a hackathon in 7 hours.

## 📄 License

MIT
