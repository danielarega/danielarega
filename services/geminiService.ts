import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const refineAbstract = async (abstract: string): Promise<string> => {
  if (!process.env.API_KEY) return "AI service unavailable (Missing API Key)";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Refine the following academic abstract for clarity, academic tone, and grammar. Provide only the refined abstract text.\n\n${abstract}`,
    });
    return response.text || "Could not generate feedback.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Error connecting to AI service.";
  }
};

export const summarizeProjectForSupervisor = async (title: string, description: string, abstract?: string): Promise<string> => {
  if (!process.env.API_KEY) return "AI service unavailable (Missing API Key)";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a concise summary for a supervisor regarding this student project.\nTitle: ${title}\nDescription: ${description}\nAbstract: ${abstract || 'N/A'}\n\nFocus on the feasibility and key technical challenges.`,
    });
    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Error connecting to AI service.";
  }
};