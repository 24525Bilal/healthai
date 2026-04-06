// app/api/analyze/route.js
// This is our backend API endpoint. When the frontend clicks "Run AI Analysis",
// it sends the clinical reports here. We then forward them to Gemini Pro
// and return the structured analysis to the frontend.

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const { reports } = await request.json();

    // Format clinical reports into readable text for Gemini
    const reportsText = reports
      .map(
        (r, i) =>
          `Report ${i + 1} [${r.date}]: Hospital: ${r.hospital}, Area: ${r.area}, ` +
          `Patient Age: ${r.age}, Gender: ${r.gender}, Symptoms: ${r.symptoms}`
      )
      .join("\n");

    // Initialize the Gemini AI client
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // The system prompt — this is what makes Gemini act like an epidemiologist
    const prompt = `
You are an expert epidemiologist and public health AI surveillance system.
You have received the following anonymized clinical reports from hospitals in a metropolitan area over the past 7 days.
Your job is to perform epidemiological analysis and detect any potential disease outbreaks.

ANONYMIZED CLINICAL REPORTS:
${reportsText}

Analyze these reports carefully. Look for:
1. Clustering of similar symptoms across time and location
2. Unusual increases in specific symptom categories
3. Patterns that suggest a common source or person-to-person transmission
4. Age groups that are disproportionately affected

Provide your analysis in the following STRICT JSON format (respond ONLY with this JSON, no other text or markdown):
{
  "outbreak_detected": true or false,
  "disease_name": "most likely disease name",
  "confidence_percent": number between 0-100,
  "total_suspected_cases": number,
  "affected_areas": ["area1", "area2"],
  "highest_risk_area": "area name with most cases",
  "severity_level": "Low" or "Medium" or "High" or "Critical",
  "transmission_mode": "how the disease likely spreads",
  "incubation_period": "estimated incubation period",
  "at_risk_groups": ["group1", "group2"],
  "predicted_trend": "Increasing" or "Stable" or "Decreasing",
  "estimated_new_cases_next_week": number,
  "recommended_actions": [
    "specific action 1 for health authorities",
    "specific action 2",
    "specific action 3",
    "specific action 4",
    "specific action 5"
  ],
  "citizen_precautions": [
    "precaution 1 for the general public",
    "precaution 2",
    "precaution 3",
    "precaution 4"
  ],
  "medicine_requirements": [
    "medicine/supply 1 to stockpile",
    "medicine/supply 2",
    "medicine/supply 3"
  ],
  "water_sanitation_advisory": "specific water and sanitation guidance",
  "summary": "A 3-4 sentence public health summary suitable for both healthcare workers and citizens"
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Clean the response — Gemini sometimes wraps JSON in markdown code blocks
    const cleanJson = responseText
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/gi, "")
      .trim();

    const analysis = JSON.parse(cleanJson);

    return Response.json({ success: true, analysis });
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Check if it's a 429 Too Many Requests error
    if (error.message?.includes("429") || error.message?.includes("exceeded your current quota")) {
      console.log("Gemini API quota exceeded. Falling back to mock analysis data.");
      return Response.json({
        success: true, 
        analysis: {
          outbreak_detected: true,
          disease_name: "Cholera / Acute Gastroenteritis",
          confidence_percent: 88,
          total_suspected_cases: 7,
          affected_areas: ["Chengannur Town", "Tiruvalla"],
          highest_risk_area: "Chengannur Town",
          severity_level: "High",
          transmission_mode: "Contaminated water sources post-flooding",
          incubation_period: "12 hours to 5 days",
          at_risk_groups: ["Children under 5", "Elderly", "Immunocompromised"],
          predicted_trend: "Increasing",
          estimated_new_cases_next_week: 15,
          recommended_actions: [
            "Deploy emergency water purification tablets to Chengannur Town",
            "Set up rapid hydration camps in affected areas",
            "Test municipal water supply for Vibrio cholerae",
            "Launch public awareness campaign on safe drinking water"
          ],
          citizen_precautions: [
            "Boil drinking water for at least 3 minutes",
            "Wash hands thoroughly with soap",
            "Avoid eating raw or street food",
            "Seek immediate medical help if diarrhea occurs"
          ],
          medicine_requirements: [
            "ORS Packets",
            "IV Fluids",
            "Water purification tablets"
          ],
          water_sanitation_advisory: "High risk of water contamination. All drinking water must be boiled or purified.",
          summary: "[AI Quota Fallback] Simulated analysis: A concentrated cluster of acute gastroenteritis and cholera-like symptoms is detected in Chengannur Town and Tiruvalla. Immediate water sanitation measures and ORS distribution are recommended to control the spread."
        }
      });
    }

    return Response.json(
      {
        success: false,
        error: error.message,
        hint: "Check that your NEXT_PUBLIC_GEMINI_API_KEY is set correctly in .env.local",
      },
      { status: 500 }
    );
  }
}
