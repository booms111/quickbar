
import { GoogleGenAI, Type } from "@google/genai";
import { CommandAction, UserSettings } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateSnippet = async (prompt: string, settings: UserSettings): Promise<Partial<CommandAction>> => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are a professional snippet assistant.
    User Info: Name: ${settings.userName}, Role: ${settings.userRole}, Company: ${settings.userCompany}.
    Generate a useful command snippet based on the user's request.
    Return the response in valid JSON format matching the CommandAction interface.
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
          name: { type: Type.STRING, description: 'A short name for the command' },
          content: { type: Type.STRING, description: 'The text to be copied to clipboard' },
          category: { type: Type.STRING, description: 'One of: email, code, social, custom' },
          icon: { type: Type.STRING, description: 'A single emoji representing the command' },
          description: { type: Type.STRING, description: 'A short description of what this does' },
        },
        required: ["name", "content", "category", "icon"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || '{}');
    return data;
  } catch (err) {
    console.error("Failed to parse Gemini response", err);
    return {
      name: "AI Generated Snippet",
      content: response.text || "Failed to generate content.",
      category: 'ai',
      icon: '✨'
    };
  }
};
