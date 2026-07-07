import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({

    apiKey: process.env.GEMINI_API_KEY

});

class Embedding {

    async generate(text) {

        try {

            if (!text?.trim()) {

                throw new Error(
                    "Cannot generate embedding for empty text."
                );

            }

            const response =
                await ai.models.embedContent({

                    model: "gemini-embedding-001",

                    contents: text

                });

            const embedding =
                response?.embeddings?.[0]?.values;

            if (!embedding) {

                throw new Error(
                    "Gemini returned an empty embedding."
                );

            }

            if (!Array.isArray(embedding)) {

                throw new Error(
                    "Invalid embedding format returned by Gemini."
                );

            }

            if (embedding.length !== 3072) {

                throw new Error(
                    `Unexpected embedding dimension: ${embedding.length}`
                );

            }

            return embedding;

        }

        catch (error) {

            console.error(
                "Embedding Generation Error:",
                error
            );

            throw new Error(
                "Failed to generate embeddings."
            );

        }

    }

}

export default new Embedding();