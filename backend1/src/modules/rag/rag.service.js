import DocumentLoader from "./document.loader.js";
import Chunker from "./chunker.js";
import Embedding from "./embedding.js";
import VectorStore from "./vector.store.js";
import Retriever from "./retriever.js";
import { generateText } from "../../ai/gemini.js";

class RAGService {

    async indexDocument(userId, email, filePath,metadata = {}) {
        const exists = await VectorStore.documentExists(
            userId,
            metadata.filename
        );
        
        if (exists) {
            return {
                success: false,
                message: "Document already uploaded."
            };
        }
        const document =
            await DocumentLoader.load(filePath);

        const chunks =
            Chunker.chunk(document.text);

        const vectors = [];

        for (const chunk of chunks) {

            const embedding =
                await Embedding.generate(chunk.text);

            vectors.push({

                    user_id: userId,
                
                    email: email,
                
                    title: metadata.filename,
                
                    chunk: chunk.text,
                
                    embedding,
                
                    metadata: {
                
                        ...metadata,
                
                        chunk: chunk.index,
                
                        indexedAt: new Date().toISOString()
                
                    }
                
            });

        }


        await VectorStore.insertMany(vectors);

        return {

            success: true,

            chunks: vectors.length

        };

    }

    async searchKnowledge(userId,question) {

        return await Retriever.retrieve(userId,question);

    }

    async answer(userId,args){

        const question=args.question;

        const chunks=
            await Retriever.retrieve(userId,question);
        chunks.sort((a, b) => a.metadata.chunk - b.metadata.chunk);
        if (!chunks.length) {

            return "I couldn't find that information in your uploaded knowledge.";

        }
        const relevant = chunks.filter(c => c.similarity > 0.35);

        const finalChunks = relevant.length ? relevant : chunks.slice(0, 3);
        console.log(finalChunks);
        const context = finalChunks.map(chunk => `
                Document: ${chunk.title}
                Chunk: ${chunk.metadata.chunk}
                Content:
                ${chunk.chunk}
                `).join("\n\n----------------------------\n\n");

        const prompt=`


You are Workspace AI, an AI assistant that answers questions ONLY using the retrieved documents.

Rules:

1. Answer ONLY from the provided context.
2. Never invent or assume information.
3. If the answer is not found in the context, reply exactly:
   "I couldn't find that information in the retrieved documents."
4. Ignore chunks that are unrelated to the user's question.
5. If multiple chunks contain relevant information, combine them into one answer.
6. Mention the document title whenever possible.
7. Prefer complete, well-structured answers over one-line summaries.

Formatting Rules:

• For Job Descriptions:
  - Role
  - Responsibilities
  - Required Qualifications
  - Preferred Qualifications (if available)
  - Benefits
  - Work Style
  - Company Information

• For Resume:
  - Projects
  - Skills
  - Experience
  - Education
  - Certifications

• For Policies or Manuals:
  - Use headings and bullet points.

Retrieved Context:

${context}

User Question:

${question}

Answer:
`;
        return await generateText(prompt);

    }
}

export default new RAGService();