import fs from "fs/promises";
import RAGService from "./rag.service.js";

export async function upload(req, res) {
    
    console.log("UPLOAD REQUEST RECEIVED");
    let uploadedFile = null;

    try {

        if (!req.user) {

            return res.status(401).json({

                success: false,

                message: "Unauthorized."

            });

        }

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "No document uploaded."

            });

        }

        uploadedFile = req.file.path;
        console.log("INDEX DOCUMENT START");
        const result = await RAGService.indexDocument(

            req.user.id,

            req.user.email,

            uploadedFile,

            {

                source: "manual",

                documentType: "document",

                filename: req.file.originalname,

                uploadedAt: new Date().toISOString()

            }

        );

        if (!result.success) {

            return res.status(409).json(result);

        }

        return res.status(200).json(result);

    }

    catch (error) {

        console.error("RAG Upload Error:", error);

        return res.status(500).json({

            success: false,

            message: error.message || "Failed to upload document."

        });

    }

    finally {

        if (uploadedFile) {

            await fs.unlink(uploadedFile).catch(() => {});

        }

    }

}

export async function ask(req, res) {

    try {

        if (!req.user) {

            return res.status(401).json({

                success: false,

                message: "Unauthorized."

            });

        }

        const { question } = req.body;

        if (!question?.trim()) {

            return res.status(400).json({

                success: false,

                message: "Question is required."

            });

        }

        const answer = await RAGService.answer(

            req.user.id,

            req.body

        );

        return res.json({

            success: true,

            answer

        });

    }

    catch (error) {

        console.error("RAG Question Error:", error);

        return res.status(500).json({

            success: false,

            message: error.message || "Failed to answer question."

        });

    }
    

}
export async function listDocuments(req, res) {

    try {

        const docs =
            await RAGService.listDocuments(req.user.id);

        return res.json(docs);

    }catch (error) {

        console.error("RAG List Documents Error:", error);

        return res.status(500).json({

            success: false,

            message: error.message || "Failed to list documents."

        });

    }


}
export async function deleteDocument(req, res) {

    try {

        const { title } = req.params;

        await RAGService.deleteDocument(title);

        res.json({

            success: true,

            message: "Document deleted successfully."

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
