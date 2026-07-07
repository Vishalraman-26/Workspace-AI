import DocumentLoader from "./document.loader.js";
import Chunker from "./chunker.js";
import Embedding from "./embedding.js";
import VectorStore from "./vector.store.js";
import Retriever from "./retriever.js";
import { generateText } from "../../ai/gemini.js";

const SIMILARITY_THRESHOLD = 0.35;
const MAX_CONTEXT_CHUNKS = 5;

class RAGService {

    async indexDocument(userId, email, filePath, metadata = {}) {

        try {

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
                console.log("DOCUMENT LOADED");
                console.log("Text Length:", document.text.length);
            if (!document.text?.trim()) {

                throw new Error(
                    "The uploaded document contains no readable text."
                );

            }

            const  chunks = (await Chunker.chunk(document.text)).filter(chunk => chunk.text?.trim());
            console.log("Chunks:", chunks.length);
            console.log("Chunks:", chunks);
            if (!chunks.length) {

                throw new Error(
                    "No readable content found after processing the document."
                );

            }

            const vectors = [];

            for (const chunk of chunks) {

                try {

                    const embedding =
                        await Embedding.generate(chunk.text);

                    vectors.push({

                        user_id: userId,

                        email,

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

                catch (error) {

                    console.error(
                        `Embedding failed for chunk ${chunk.index}:`,
                        error
                    );

                    throw new Error(
                        "Failed to generate document embeddings."
                    );

                }

            }

            if (!vectors.length) {

                throw new Error(
                    "No embeddings were generated."
                );

            }

            try {
                console.log("Vectors to insert:", vectors.length);
                await VectorStore.insertMany(vectors);

            }

            catch (error) {

                console.error(
                    "Vector Store Error:",
                    error
                );

                throw new Error(
                    "Failed to save document to the knowledge base."
                );

            }

            return {

                success: true,

                chunks: vectors.length,

                message: "Document indexed successfully."

            };

        }

        catch (error) {

            console.error(
                "Document Indexing Error:",
                error
            );

            throw error;

        }

    }

    async searchKnowledge(userId, question) {

        try {

            return await Retriever.retrieve(
                userId,
                question
            );

        }

        catch (error) {

            console.error(
                "Knowledge Search Error:",
                error
            );

            throw new Error(
                "Failed to search knowledge base."
            );

        }

    }

    async answer(userId, args) {

        try {

            const question = args.question;

            if (!question?.trim()) {

                throw new Error(
                    "Question is required."
                );

            }

            const chunks =
                await Retriever.retrieve(
                    userId,
                    question
                );

            if (!chunks.length) {

                return "I couldn't find that information in your uploaded knowledge.";

            }

            chunks.sort(

                (a, b) =>

                    (a.metadata?.chunk ?? 0)

                    -

                    (b.metadata?.chunk ?? 0)

            );

            const relevant = chunks.filter(

                c => c.similarity >= SIMILARITY_THRESHOLD

            );

            const finalChunks =

                relevant.length

                    ? relevant.slice(0, MAX_CONTEXT_CHUNKS)

                    : chunks.slice(0, MAX_CONTEXT_CHUNKS);

            const context = finalChunks

                .map(chunk => `

Document: ${chunk.title}

Chunk: ${chunk.metadata?.chunk ?? 0}

Content:

${chunk.chunk}

`)

                .join("\n----------------------------\n");

            const prompt = `

You are Workspace AI, an AI assistant that answers ONLY using the retrieved documents.

Rules:

1. Answer ONLY using the retrieved context.
2. Never invent facts.
3. If the answer isn't present, reply exactly:
"I couldn't find that information in the retrieved documents."
4. Ignore unrelated chunks.
5. Combine multiple relevant chunks.
6. Mention the document title whenever possible.

Formatting:

Resume:
- Projects
- Skills
- Experience
- Education
- Certifications

Job Description:
- Role
- Responsibilities
- Required Qualifications
- Preferred Qualifications
- Benefits
- Work Style
- Company Information

Policies:
- Use headings and bullet points.

Retrieved Context:

${context}

User Question:

${question}

Answer:

`;

            return await generateText(prompt);

        }

        catch (error) {

            console.error(
                "RAG Answer Error:",
                error
            );

            throw new Error(
                "Unable to answer using the knowledge base."
            );

        }

    }
    async listDocuments(userId){

        try {

            return await VectorStore.listDocuments(userId);

        }catch (error) {

            console.error("RAG List Documents Error:", error);

            throw new Error("Failed to list documents.");

        }
    
    }
    async deleteDocument(title) {

        await VectorStore.deleteDocument(title);
    
    }

}

export default new RAGService();