// app/api/chat/route.js
// Chatbot API — Uses Gemini AI as a public health medical info assistant

import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are HealthSentinel AI Assistant, a helpful and empathetic public health chatbot embedded in a citizen health portal.

Your role:
- Answer questions about common diseases, symptoms, prevention, and first-aid
- Provide general health and hygiene guidance
- Share information about when to seek medical help
- Explain medical terms in simple language
- Give guidance on water safety, sanitation, and disease prevention
- Be supportive and reassuring, but always recommend consulting a real doctor for diagnosis/treatment

Rules:
- NEVER diagnose a condition. Always say "consult a healthcare professional"
- Keep responses concise (2-4 paragraphs max)
- Use simple, easy-to-understand language
- If asked about emergencies, always advise calling 108 (ambulance) or visiting the nearest hospital immediately
- If asked non-medical questions, politely redirect to health topics
- Format responses with bullet points or numbered lists when listing symptoms or steps
- Do NOT prescribe specific medications or dosages`;

export async function POST(request) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== "string") {
      return Response.json(
        { success: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Build conversation history for context
    const chatHistory = (history || []).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are a health assistant. Follow these instructions for all responses: " + SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Understood! I'm HealthSentinel AI Assistant, ready to help with public health information. I'll provide helpful, concise guidance while always recommending professional medical consultation for specific health concerns. How can I help you today?" }],
        },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    return Response.json({ success: true, reply: responseText });
  } catch (error) {
    console.error("Chat API Error:", error);
    
    // Check if it's a 429 Too Many Requests error
    if (error.message?.includes("429") || error.message?.includes("exceeded your current quota")) {
      return Response.json({ 
        success: true, 
        reply: "⚠️ *Notice: HealthSentinel AI is currently experiencing high load (API Quota Exceeded).*\n\nHowever, for general health inquiries:\n\n• **For stomach issues/diarrhea**: Stay hydrated with ORS, boil drinking water, and seek medical help if symptoms persist.\n• **For fever**: Rest, stay hydrated, and consult a doctor if it exceeds 39°C or lasts more than 3 days.\n• **Emergency**: Please call 108 immediately or visit the nearest hospital."
      });
    }

    return Response.json(
      {
        success: false,
        error: "Failed to get response. Please try again.",
      },
      { status: 500 }
    );
  }
}
