import { GoogleGenAI, Type } from "@google/genai";
import type { TopicSuggestion } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBlogPost = async (prompt: string, title: string): Promise<string> => {
    try {
        const fullPrompt = `Act as a professional blogger named Landry. Write an engaging and insightful blog post on the topic: '${prompt}'. The title of the post is '${title}'. The tone should be personal, yet informative. Structure the post with a compelling introduction, well-organized body paragraphs using markdown headings (e.g., ## A Subheading), and a thoughtful conclusion. Use markdown for formatting like bolding (**word**) and bullet points (* point). Do not include the main title in your output, just the article body.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
        });
        
        return response.text;
    } catch (error) {
        console.error("Error generating blog post:", error);
        throw new Error("Failed to generate blog post content.");
    }
};

export const generateBlogImage = async (prompt: string): Promise<string> => {
    try {
        const imagePrompt = `Create a high-quality, visually stunning blog header image that captures the essence of this topic: '${prompt}'. The style should be modern and slightly abstract, suitable for a personal tech or lifestyle blog. Photorealistic.`;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: imagePrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });
        
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;

    } catch (error) {
        console.error("Error generating blog image:", error);
        throw new Error("Failed to generate blog image.");
    }
};

export const generateTopicSuggestions = async (): Promise<TopicSuggestion[]> => {
    try {
        const prompt = `Generate a list of 5 creative and engaging blog post topic suggestions for a personal blog. For each suggestion, provide a catchy title and a short prompt describing the angle of the post.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        suggestions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: {
                                        type: Type.STRING,
                                        description: 'A catchy title for the blog post.',
                                    },
                                    prompt: {
                                        type: Type.STRING,
                                        description: 'A short prompt or summary of what the blog post should be about.',
                                    },
                                },
                                required: ["title", "prompt"],
                            }
                        }
                    },
                    required: ["suggestions"],
                },
            },
        });
        
        const jsonResponse = JSON.parse(response.text);
        return jsonResponse.suggestions || [];

    } catch (error) {
        console.error("Error generating topic suggestions:", error);
        throw new Error("Failed to generate topic suggestions.");
    }
};
