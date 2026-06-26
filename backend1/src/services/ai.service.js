import { generateText } from "../ai/gemini.js";

export async function chatService(message) {

    if (!message || message.trim() === "") {
        throw new Error("Message is required.");
    }

    const reply = await generateText(message);

    return {
        success: true,
        reply,
    };
}