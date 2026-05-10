import { GoogleGenAI, Type } from "@google/genai";
import { Lead } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const geminiService = {
  scoreLeads: async (leads: Lead[], context: string): Promise<{ id: string; score: number; priority: 'low' | 'medium' | 'high'; reasoning: string }[]> => {
    if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing");

    const prompt = `
      You are a Sales Lead Scoring Expert. Analyze the following local business leads and score them from 0 to 100 based on their likelihood to convert for the following goal: "${context}".
      
      Higher scores should be given to businesses with:
      - High ratings but fewer reviews (growing).
      - Available contact info (email/phone).
      - Relevant industry to the goal.
      
      Leads:
      ${JSON.stringify(leads.map(l => ({ id: l.id, name: l.name, industry: l.industry, rating: l.rating, reviews: l.userRatingsTotal, email: !!l.email, phone: !!l.phone })))}
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                score: { type: Type.NUMBER },
                priority: { type: Type.STRING, enum: ['low', 'medium', 'high'] },
                reasoning: { type: Type.STRING }
              },
              required: ['id', 'score', 'priority', 'reasoning']
            }
          }
        }
      });

      return JSON.parse(response.text || '[]');
    } catch (error) {
      console.error("Gemini Error:", error);
      return [];
    }
  }
};
