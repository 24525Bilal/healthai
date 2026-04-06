import "./globals.css";

export const metadata = {
  title: "HealthSentinel AI — Public Health Outbreak Detection",
  description:
    "AI-powered public health assistant that proactively detects disease outbreaks by analyzing anonymized clinical data, providing real-time insights and recommended actions.",
  keywords: "public health, AI, outbreak detection, disease surveillance, Gemini AI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
