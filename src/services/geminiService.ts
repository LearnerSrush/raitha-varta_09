import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const OFFLINE_CROP_DATA = (crop?: string) => {
  const crops = ["Paddy", "Tomato", "Coconut", "Areca Nut", "Onion", "Chilli"];
  const selectedCrop = crop || crops[Math.floor(Math.random() * crops.length)];
  
  return {
    cropName: `${selectedCrop} (Simulated)`,
    diseaseName: `Potential ${selectedCrop} Condition`,
    cause: "Environmental stress or nutrient imbalance (Offline Simulation)",
    severity: "Medium",
    organicSolution: "Apply fermented neem cake or diluted sour buttermilk spray.",
    chemicalSolution: "Apply Hexaconazole 5% EC (Consult local expert for exact dosage).",
    confidence: 0.85,
    symptoms: [
      "Discoloration on leaf surfaces",
      "Stunted growth in affected patches",
      "Slight wilting during peak sunlight"
    ],
    treatmentSteps: [
      { step: "Isolate and remove highly infected leaves", dosage: "Immediate" },
      { step: "Ensure proper drainage in the field", dosage: "Within 24hrs" },
      { step: "Check soil pH and moisture levels", dosage: "Morning/Evening" },
      { step: "Apply recommended organic solution", dosage: "Twice weekly" }
    ],
    expectedRecovery: "10-14 days",
    isOfflineResult: true
  };
};

export const geminiService = {
  async detectDisease(imageData: string, language: string = 'English') {
    if (!navigator.onLine || !process.env.GEMINI_API_KEY) {
      return OFFLINE_CROP_DATA();
    }

    // Detect actual mime type if possible
    const mimeMatch = imageData.match(/data:([^;]+);/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const base64Data = imageData.includes('base64,') ? imageData.split('base64,')[1] : imageData;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [
              { text: `Identify the crop and any diseases present in this image. Provide the disease name, cause, severity, organic solution, and chemical solution in ${language} language. For crops like Tomato and Onion, always include a specific step in 'treatmentSteps' to check soil pH levels as they are highly sensitive to acidity/alkalinity. Respond in JSON format.` },
              { inlineData: { mimeType, data: base64Data } }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              cropName: { type: Type.STRING },
              diseaseName: { type: Type.STRING },
              cause: { type: Type.STRING },
              severity: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
              organicSolution: { type: Type.STRING },
              chemicalSolution: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              symptoms: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              treatmentSteps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.STRING },
                    dosage: { type: Type.STRING }
                  }
                }
              },
              expectedRecovery: { type: Type.STRING }
            },
            required: ["cropName", "diseaseName", "severity"]
          }
        }
      });
      
      let text = response.text || '';
      if (!text) throw new Error("Empty response from AI");

      // Clean up text if needed
      text = text.replace(/```json\n?|```\n?/g, '').trim();
      
      return JSON.parse(text);
    } catch (error) {
      console.warn("Disease detection failed, using simulated data:", error);
      return OFFLINE_CROP_DATA();
    }
  },

  async processAdvisory(text: string) {
    if (!navigator.onLine || !process.env.GEMINI_API_KEY) {
      return {
        title: { en: "Agricultural Best Practices", hi: "कृषि सर्वोत्तम अभ्यास", kn: "ಕೃಷಿ ಉತ್ತಮ ಪದ್ಧತಿಗಳು" },
        description: { en: "General advisory for maintaining crop productivity and health during the current season.", hi: "वर्तमान सीजन के दौरान फसल उत्पादकता और स्वास्थ्य बनाए रखने के लिए सामान्य सलाह।", kn: "ಪ್ರಸ್ತುತ ಋತುವಿನಲ್ಲಿ ಬೆಳೆ ಉತ್ಪಾದಕತೆ ಮತ್ತು ಆರೋಗ್ಯವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಲು ಸಾಮಾನ್ಯ ಸಲಹೆ." },
        actionLine: { en: "Ensure regular monitoring and proper field sanitation.", hi: "नियमित निगरानी और उचित स्वच्छता सुनिश्चित करें।", kn: "ನಿಯಮಿತ ಮೇಲ್ವಿಚಾರಣೆ ಮತ್ತು ಸರಿಯಾದ ಕ್ಷೇತ್ರ ನೈರ್ಮಲ್ಯವನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ." },
        dosageInfo: { en: "Follow standard local practices.", hi: "मानक स्थानीय प्रथाओं का पालन करें।", kn: "ಸ್ಥಳೀಯ ಪದ್ಧತಿಗಳನ್ನು ಅನುಸರಿಸಿ." }
      };
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [{ text: `Convert the following agricultural advisory into a simple flashcard format. Provide a title, short description (max 2 lines), an action step, and dosage/timing info. Translate the output into English, Kannada, and Hindi. Respond in JSON. \n\nAdvisory: ${text}` }]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.OBJECT,
                properties: { en: { type: Type.STRING }, kn: { type: Type.STRING }, hi: { type: Type.STRING } }
              },
              description: {
                type: Type.OBJECT,
                properties: { en: { type: Type.STRING }, kn: { type: Type.STRING }, hi: { type: Type.STRING } }
              },
              actionLine: {
                type: Type.OBJECT,
                properties: { en: { type: Type.STRING }, kn: { type: Type.STRING }, hi: { type: Type.STRING } }
              },
              dosageInfo: {
                type: Type.OBJECT,
                properties: { en: { type: Type.STRING }, kn: { type: Type.STRING }, hi: { type: Type.STRING } }
              }
            }
          }
        }
      });
      let jsonText = (response.text || '{}').replace(/```json\n?|```\n?/g, '').trim();
      return JSON.parse(jsonText);
    } catch (error) {
      console.warn("Advisory processing failed, using simple fallback:", error);
      return {
        title: { en: "Advisory: " + text.substring(0, 20), hi: "सलाह", kn: "ಸಲಹೆ" },
        description: { en: text, hi: text, kn: text },
        actionLine: { en: "Follow instructions carefully.", hi: "निर्देशਾਂ का पालन करें।", kn: "ಸೂಚನೆಗಳನ್ನು ಅನುಸರಿಸಿ." },
        dosageInfo: { en: "As specified in advisory.", hi: "सलाह के अनुसार।", kn: "ಸಲಹೆಯಂತೆ." }
      };
    }
  },

  async askAssistant(query: string, language: string) {
    if (!navigator.onLine || !process.env.GEMINI_API_KEY) {
      return "ನಾನು ಪ್ರಸ್ತುತ ಸ್ಥಳೀಯ ಸಿಮ್ಯುಲೇಶನ್ ಮೋಡ್‌ನಲ್ಲಿದ್ದೇನೆ. ನೈಜ-ಸಮಯದ AI ಸಹಾಯವನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲು, ದಯವಿಟ್ಟು ನಿಮ್ಮ API ಕೀಯನ್ನು ಸರಿಯಾಗಿ ಕಾನ್ಫಿಗರ್ ಮಾಡಿ.";
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            parts: [{ text: `You are Raitha-Varta AI, a friendly farming assistant. Answer the following question in ${language}. Keep it simple and actionable. Query: ${query}` }]
          }
        ],
        config: {
          systemInstruction: "Expert at Indian agriculture, particularly Karnataka crops like Paddy, Areca Nut, and Coconut."
        }
      });
      return response.text || "I'm sorry, I couldn't process that request.";
    } catch (error) {
      console.warn("Assistant failed, using informative fallback:", error);
      return "I'm currently having trouble connecting to the AI brain. Please check your internet connection or try again later.";
    }
  }
};
