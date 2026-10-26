import { GoogleGenAI } from "@google/genai";

class GeminiService {
    private static instance: GeminiService;
    private aiClient: GoogleGenAI | null = null;

    private constructor() {}

    public static getInstance(): GeminiService {
        if (!GeminiService.instance) {
            GeminiService.instance = new GeminiService();
        }
        return GeminiService.instance;
    }

    private getAIClient(): GoogleGenAI {
        if (!this.aiClient) {
            const apiKey = process.env.API_KEY;
            if (!apiKey) {
                throw new Error("API_KEY environment variable not set.");
            }
            this.aiClient = new GoogleGenAI({ apiKey });
        }
        return this.aiClient;
    }

    private async fileToGenerativePart(file: File) {
      const allowedTypes = new Set([
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif',
      ]);
      if (!allowedTypes.has(file.type)) {
        throw new Error('نوع الصورة غير مدعوم. استخدم JPEG أو PNG أو WEBP أو GIF أو HEIC/HEIF.');
      }
      if (file.size <= 0 || file.size > 10 * 1024 * 1024) {
        throw new Error('حجم الصورة يجب أن يكون أكبر من صفر وألا يتجاوز 10 ميجابايت.');
      }

      const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (reader.result) {
                resolve((reader.result as string).split(',')[1]);
            } else {
                reject(new Error("Failed to read file."));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
      return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
      };
    }

    public async extractTextFromImage(file: File): Promise<string> {
        const ai = this.getAIClient();
        const model = 'gemini-3.8-flash';
        
        try {
            const imagePart = await this.fileToGenerativePart(file);
            const response = await ai.models.generateContent({
                model: model,
                contents: {
                    parts: [
                        { text: "Extract absolutely all text, emojis, symbols, numbers, and special characters from this image exactly as they appear. Support ALL languages (Arabic, Russian, English, etc.) mixed together. Preserve the exact content including emojis. Do not translate. Do not summarize. Do not add markdown code blocks or intro phrases like 'Here is the text'. Just return the raw extracted content." },
                        imagePart
                    ]
                }
            });
            return response.text || "";
        } catch (error) {
            console.error(`Error processing file ${file.name}:`, error);
            if (error instanceof Error) {
                throw new Error(`فشل استخراج النص من ${file.name}: ${error.message}`);
            }
            throw new Error(`فشل استخراج النص من ${file.name} بسبب خطأ غير معروف.`);
        }
    }
}

export const geminiService = GeminiService.getInstance();
