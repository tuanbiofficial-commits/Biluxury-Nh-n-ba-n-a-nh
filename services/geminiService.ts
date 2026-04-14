
import { GoogleGenAI } from "@google/genai";
import { PoseType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const BASE_PROMPT = `High-end menswear fashion photography for a 'Quiet Luxury' catalogue. 
Modern Classic style, clean and professional.
Environment: Minimalist luxury interior with warm wood, stone textures, and soft natural diffused lighting. 
Tone: Warm neutral (beige, chocolate, navy, slate). 
Quality: Ultra-sharp details, premium textile texture, no watermarks, no text.
Subject: A male model wearing the EXACT jacket from the product image provided. 
Model appearance: The face must be an EXACT match to the provided face image (eyes, nose, skin tone, bone structure). Groomed, tidy hair.
Outfit: Minimalist pairing with neutral wool trousers and premium leather shoes.`;

const POSE_PROMPTS = {
  [PoseType.PORTRAIT_FRONT]: "Full height shot, portrait orientation. The model is standing straight, facing the camera directly with a neutral, calm expression. Hands hanging naturally at the sides.",
  [PoseType.PORTRAIT_3_4]: "Full height shot, portrait orientation. 3/4 angle view. One hand is placed casually in the trouser pocket. Body slightly turned, face clearly visible and recognizable.",
  [PoseType.LANDSCAPE_CROSSED]: "Mid-shot, landscape orientation. The model is standing with arms crossed in a confident, calm manner. Well-balanced composition, clear facial features.",
  [PoseType.LANDSCAPE_RELAXED]: "Mid-shot, landscape orientation. The model is leaning slightly, weight on one leg, relaxed posture. Looking slightly away from the camera while maintaining facial recognition."
};

export const generateFashionImage = async (
  productBase64: string,
  faceBase64: string,
  pose: PoseType,
  aspectRatio: "16:9" | "9:16" | "1:1" | "3:4" | "4:3"
): Promise<string> => {
  // Extract base64 content
  const productData = productBase64.split(',')[1];
  const faceData = faceBase64.split(',')[1];

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: productData,
            mimeType: 'image/png',
          },
        },
        {
          inlineData: {
            data: faceData,
            mimeType: 'image/png',
          },
        },
        {
          text: `${BASE_PROMPT} ${POSE_PROMPTS[pose]}. Aspect ratio: ${aspectRatio}`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio as any,
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image data returned from AI");
};
