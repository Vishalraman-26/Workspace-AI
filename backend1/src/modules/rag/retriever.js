import Embedding from "./embedding.js";
import VectorStore from "./vector.store.js";

class Retriever {

    async retrieve(question, filters = {}, topK = 5) {

        const embedding =
            await Embedding.generate(question);
  
            const results =
                await VectorStore.search(
                    embedding,
                    topK
                );

            console.log("RAG Results");
            console.table(
                results.map(r => ({
                    title: r.title,
                    similarity: r.similarity
                }))
            );

            return results;


    }

}

export default new Retriever();