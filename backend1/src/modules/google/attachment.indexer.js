import AttachmentFetcher from "./attachment.fetcher.js";
import RAGService from "../rag/rag.service.js";
import { SUPPORTED_ATTACHMENTS } from "./attachment.constants.js";
import AttachmentDatabase from "./attachment.database.js";
class AttachmentIndexer {

    async indexEmailAttachments(userId, email) {

        if (!email.attachments?.length) {

            return;

        }

        for (const attachment of email.attachments) {

            const indexed =

                await AttachmentDatabase.exists(

                    attachment.id

                );

            if (indexed) {

                continue;

            }

            if (

                !SUPPORTED_ATTACHMENTS.includes(

                    attachment.mimeType

                )

            ) {

                continue;

            }

            const filePath =

                await AttachmentFetcher.download(

                    userId,

                    email.id,

                    attachment

                );
            console.log("Found attachment:", attachment.filename);
            console.log("Downloaded:", filePath);
            await RAGService.indexDocument(

                filePath,

                {
                    source: "gmail",

                    documentType: "job_description",

                    filename: attachment.filename,

                    sender: email.from,

                    subject: email.subject,

                    emailId: email.id,

                    category: email.category,

                    indexedAt: new Date().toISOString()
                }

            );
            console.log("Indexed:", attachment.filename);

            await AttachmentDatabase.save({

                id: attachment.id,

                messageId: email.id,

                filename: attachment.filename

            });
            await AttachmentFetcher.cleanup(

                filePath

            );
            console.log("Deleted temp file");

        }

    }

}

export default new AttachmentIndexer();