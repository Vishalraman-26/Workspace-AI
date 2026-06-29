class GmailAttachment {

    analyze(email) {

        const headers = email.payload?.headers || [];
        const parts = email.payload?.parts || [];

        let hasAttachment = false;
        let attachments = [];

        const traverse = (items = []) => {

            for (const part of items) {

                if (part.filename) {

                    hasAttachment = true;

                    attachments.push({
                        filename: part.filename,
                        mimeType: part.mimeType
                    });

                }

                if (part.parts) {
                    traverse(part.parts);
                }

            }

        };

        traverse(parts);

        return {

            hasAttachment,

            attachments

        };

    }

}

export default new GmailAttachment();