
import { GoogleGenAI, Type } from "@google/genai";
import { CommandAction, UserSettings } from "./config";

export const generateSnippet = async (prompt: string, settings: UserSettings): Promise<Partial<CommandAction>> => {
  // Always initialize inside the call to ensure fresh API Key access in hosted environments
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-pro-preview';
  
  const systemInstruction = `
    You are a professional snippet assistant.
    User Identity:
    - Name: ${settings.userName}
    - Role: ${settings.userRole}
    - Company: ${settings.userCompany}

    Task: Generate a high-quality, professional text snippet or command based on the user's request.
    If the request is for a template, use placeholders like [Recipient Name] where appropriate.
    If the request is for a command, ensure it is syntactically correct for a standard terminal.
    
    Return the response strictly in valid JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'Short, catchy name for the button' },
            content: { type: Type.STRING, description: 'The actual text or code to be copied' },
            category: { type: Type.STRING, description: 'email, code, social, or custom' },
            icon: { type: Type.STRING, description: 'A single, relevant emoji' },
            description: { type: Type.STRING, description: 'A brief 1-sentence explanation' },
          },
          required: ["name", "content", "category", "icon"]
        }
      }
    });

    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini Generation Error:", err);
    return {
      name: "AI Error",
      content: "Could not generate snippet. Check your API connection.",
      category: 'custom',
      icon: '⚠️'
    };
  }
};
