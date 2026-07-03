import fs from "fs/promises";
import path from "path";
import GmailClient from "./gmail.client.js";
class AttachmentFetcher {

    async download(userId, messageId, attachment) {

        const gmail =
            await GmailClient.getClient(userId);

        const { data } =
            await gmail.users.messages.attachments.get({

                userId: "me",

                messageId,

                id: attachment.id

            });

        const buffer = Buffer.from(

            data.data,

            "base64"

        );

        const uploadDir = path.join(

            process.cwd(),

            "uploads"

        );

        await fs.mkdir(uploadDir, {

            recursive: true

        });

        const filePath = path.join(

            uploadDir,

            attachment.filename

        );

        await fs.writeFile(

            filePath,

            buffer

        );

        return filePath;

    }

    async cleanup(filePath) {

        try {

            await fs.unlink(filePath);

        }

        catch {

        }

    }

}

export default new AttachmentFetcher();