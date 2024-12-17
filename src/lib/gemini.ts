import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateTriggerword } from "./utils";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not defined in environment variables');
}

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 segundo

// Almacenar la triggerword globalmente
export let globalTriggerword: string | null = null;

export function getGlobalTriggerword(modelName: string): string {
  if (!globalTriggerword) {
    globalTriggerword = generateTriggerword(modelName);
  }
  return globalTriggerword;
}

function getSystemPrompt(modelName: string, gender: string): string {
  // Generar la triggerword solo si no existe
  if (!globalTriggerword) {
    globalTriggerword = generateTriggerword(modelName);
  }

  const genderWord = gender === 'hombre' ? 'man' : 'woman';

  return `You are an expert system in creating detailed descriptions of headshots

if the person in the image is a man you will start the caption with a photo of a ohwx ${genderWord} ${globalTriggerword}

if the person in the image is a woman you will start the caption with a photo of a ohwx ${genderWord} ${globalTriggerword}

Obligations:
Your only permitted output is the caption
You will not describe facial, body or any other details that may describe the person in the photo
You will focus on the clothing, the landscape, the lighting etc.
You are allowed to describe the facial expression, if the person is smiling, angry, etc.`;
}

export function getModel(modelName: string, gender: string) {
  return genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
    },
    systemInstruction: getSystemPrompt(modelName, gender)
  });
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function generateWithRetry(model: any, content: any[], retryCount = 0): Promise<string> {
  try {
    const result = await model.generateContent(content);
    const response = await result.response;
    return response.text();
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Retry attempt ${retryCount + 1} of ${MAX_RETRIES}`);
      await delay(RETRY_DELAY * (retryCount + 1)); // Backoff exponencial
      return generateWithRetry(model, content, retryCount + 1);
    }
    throw error;
  }
}

export async function generateImageCaption(imageData: Blob, modelName: string, gender: string): Promise<string> {
  try {
    const model = getModel(modelName, gender);
    const imageBase64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const cleanBase64 = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
        resolve(cleanBase64);
      };
      reader.readAsDataURL(imageData);
    });

    return await generateWithRetry(model, [
      { text: "Generate a caption for this image" },
      { inlineData: { data: imageBase64, mimeType: imageData.type } }
    ]);
  } catch (error) {
    console.error('Error generating caption:', error);
    throw error;
  }
} 