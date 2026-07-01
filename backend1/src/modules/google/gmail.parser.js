import { getHeader } from "./google.utils.js";

class GmailParser {
    extractAttachments(payload, files = []) {
        if (!payload) {
            return files;
        }
        if (payload.filename) {
            files.push({
                filename: payload.filename,
                mimeType: payload.mimeType,
                size: payload.body?.size ?? 0
            });
        }
        if (payload.parts) {
            for (const part of payload.parts) {
                this.extractAttachments(part, files);
            }
        }
        return files;
    }

    parse(email) {

        const headers = email.payload.headers || [];
        const attachments = this.extractAttachments(email.payload);
        return {

            id: email.id,

            threadId: email.threadId,

            from: getHeader(headers, "From"),

            to: getHeader(headers, "To"),

            cc: getHeader(headers, "Cc"),

            subject: getHeader(headers, "Subject"),

            date: new Date(
                Number(email.internalDate)
            ),

            snippet: email.snippet,

            unread: email.labelIds.includes("UNREAD"),

            starred: email.labelIds.includes("STARRED"),

            important: email.labelIds.includes("IMPORTANT"),

            labels: email.labelIds,

            hasAttachment: attachments.length > 0,

            attachments
        };

    }
        hasAttachment(payload){

        if(!payload.parts){

            return false;

        }

        for(const part of payload.parts){

            if(part.filename){

                return true;

            }

        }

        return false;

    }

}

export default new GmailParser();
