import Embedding from "./embedding.js";
import VectorStore from "./vector.store.js";

const DEFAULT_TOP_K = 5;
const MAX_TOP_K = 20;

class Retriever {

    async retrieve(userId, question, filters = {}, topK = DEFAULT_TOP_K) {

        try {

            if (!userId) {

                throw new Error(
                    "User ID is required."
                );

            }

            if (!question?.trim()) {

                throw new Error(
                    "Question is required."
                );

            }

            topK = Math.min(
                Math.max(1, topK),
                MAX_TOP_K
            );

            const embedding =
                await Embedding.generate(question);

            if (!embedding?.length) {

                throw new Error(
                    "Failed to generate query embedding."
                );

            }

            const results =
                await VectorStore.search(

                    userId,

                    embedding,

                    topK

                );

            if (process.env.NODE_ENV === "development") {

                console.log("========== RAG RESULTS ==========");

                console.table(

                    results.map(result => ({

                        title: result.title,

                        similarity: result.similarity.toFixed(4)

                    }))

                );

            }

            return results ?? [];

        }

        catch (error) {

            console.error(

                "Retriever Error:",

                error

            );

            throw new Error(

                "Failed to retrieve relevant documents."

            );

        }

    }

}

export default new Retriever();