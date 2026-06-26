import gemini from "../config/gemini.js";
import env from "../config/env.js";

export async function generateText(message) {
    console.log("========== GEMINI ==========");
    console.log(message);
    try {
        console.log("Sending request to Gemini...");
        const response = await gemini.models.generateContent({
            model: env.GEMINI_MODEL,
            contents: message,
        });
        console.log("Gemini Response Received");
        console.log("Gemini Response:", response.text);
        return response.text;
    } catch (error) {
        console.error("Gemini Error:", error);
        console.log(process.env.GEMINI_API_KEY);

        throw new Error("Failed to generate AI response.");
    }
}