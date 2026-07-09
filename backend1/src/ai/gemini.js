import gemini from "../config/gemini.js";
import env from "../config/env.js";

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateText(message) {

    console.log("========== GEMINI ==========");

    const MAX_RETRIES = 2;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {

        try {

            const response = await gemini.models.generateContent({
                model: env.GEMINI_MODEL,
                contents: message,
            });

            return response.text;

        } catch (error) {

            console.error("Gemini Error:", error);

            const status = error.status || error.code;

            // Retry only for temporary server errors
            if (status === 503 && attempt < MAX_RETRIES) {

                console.log(`Gemini busy. Retrying (${attempt + 1}/${MAX_RETRIES})...`);

                await sleep(2000);

                continue;
            }

            // Quota exceeded
            if (status === 429) {
                throw new Error(
                    "AI service quota exceeded. Please try again later."
                );
            }

            // Gemini temporarily unavailable
            if (status === 503) {
                throw new Error(
                    "AI service is temporarily busy. Please try again in a few moments."
                );
            }

            throw new Error(
                "Unable to generate AI response."
            );
        }

    }

}