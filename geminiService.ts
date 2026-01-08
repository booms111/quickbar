
import { GoogleGenAI, Type } from "@google/genai";
import { CommandAction, UserSettings } from "./config";

export const generateSnippet = async (prompt: string, settings: UserSettings): Promise<Partial<CommandAction>> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are a professional snippet assistant.
    User Info: Name: ${settings.userName}, Role: ${settings.userRole}, Company: ${settings.userCompany}.
    Generate a useful command or text snippet based on the user's request.
    If the request is vague, provide a common professional default.
    Return the response in valid JSON format matching the schema.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Short name (max 15 chars)' },
          content: { type: Type.STRING, description: 'The text to copy' },
          category: { type: Type.STRING, description: 'email, code, social, or custom' },
          icon: { type: Type.STRING, description: 'A relevant emoji' },
          description: { type: Type.STRING, description: 'Short description' },
        },
        required: ["name", "content", "category", "icon"]
      }
    }
  });

  try {
    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (err) {
    console.error("Failed to parse AI response", err);
    return {
      name: "AI Snippet",
      content: response.text || "Error generating snippet.",
      category: 'ai',
      icon: '✨'
    };
  }
};
