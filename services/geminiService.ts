import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
  
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

async function getEnhancedPrompt(basePrompt: string): Promise<string> {
    const systemInstruction = `You are a creative prompt engineer for an AI image generator. 
    Take the user's input and expand it into a detailed, descriptive prompt for generating a single comic book panel. 
    The style should be vibrant, pop-art, with bold outlines, halftones, and a sense of action. 
    Describe the scene, character, colors, and mood in a single paragraph. Only output the final, expanded prompt.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: basePrompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.8,
                topP: 0.9,
            }
        });

        const enhancedPrompt = response.text;
        if (!enhancedPrompt) {
            throw new Error('Failed to get an enhanced prompt from the model.');
        }
        return enhancedPrompt.trim();
    } catch (error) {
        console.error("Error enhancing prompt:", error);
        // Fallback to the original prompt if enhancement fails
        return `A vibrant, pop-art comic book panel of: ${basePrompt}, with bold outlines, halftones, and a sense of action.`;
    }
}


export async function generateComicImageFromPrompt(basePrompt: string): Promise<string> {
    console.log("Starting comic generation for:", basePrompt);

    // Step 1: Enhance the user's prompt for better comic-style results
    const enhancedPrompt = await getEnhancedPrompt(basePrompt);
    console.log("Enhanced prompt:", enhancedPrompt);

    // Step 2: Generate the image using the enhanced prompt
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: enhancedPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
    });

    const generatedImage = response.generatedImages[0];

    if (!generatedImage || !generatedImage.image.imageBytes) {
        throw new Error('Image generation failed, no image bytes returned.');
    }
    
    console.log("Image generated successfully.");
    return generatedImage.image.imageBytes;
}
