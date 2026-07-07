import he from "he";
import { getHeader } from "./google.utils.js";

class GmailParser {

    extractAttachments(payload, files = []) {

        if (!payload) return files;

        if (payload.filename && payload.body?.attachmentId) {
            files.push({
                id: payload.body.attachmentId,
                filename: payload.filename,
                mimeType: payload.mimeType,
                size: payload.body.size
            });
        }

        if (payload.parts) {
            for (const part of payload.parts) {
                this.extractAttachments(part, files);
            }
        }

        return files;
    }

    decodeBase64(data) {

        if (!data) return "";

        return Buffer.from(
            data.replace(/-/g, "+").replace(/_/g, "/"),
            "base64"
        ).toString("utf8");

    }

    stripHtml(html) {

        return html
            .replace(/<style[\s\S]*?<\/style>/gi, "")
            .replace(/<script[\s\S]*?<\/script>/gi, "")
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();

    }

    extractBody(payload) {

        if (!payload) return "";

        // Prefer plain text
        if (
            payload.mimeType === "text/plain" &&
            payload.body?.data
        ) {
            return he.decode(
                this.decodeBase64(payload.body.data)
            );
        }

        // Fallback to HTML
        if (
            payload.mimeType === "text/html" &&
            payload.body?.data
        ) {
            const html = this.decodeBase64(payload.body.data);

            return he.decode(
                this.stripHtml(html)
            );
        }

        if (payload.parts) {

            for (const part of payload.parts) {

                const text = this.extractBody(part);

                if (text) return text;

            }

        }

        return "";

    }

    cleanPreview(text, maxLength = 220) {

        text = text
            .replace(/\s+/g, " ")
            .trim();

        if (text.length <= maxLength) {
            return text;
        }

        let preview = text.substring(0, maxLength);

        const lastSpace = preview.lastIndexOf(" ");

        if (lastSpace > 0) {
            preview = preview.substring(0, lastSpace);
        }

        return preview + "...";

    }

    parse(email) {

        const headers = email.payload.headers || [];
        const attachments = this.extractAttachments(email.payload);

        const body =
            this.extractBody(email.payload) ||
            he.decode(email.snippet || "");

        return {

            id: email.id,

            threadId: email.threadId,

            from: getHeader(headers, "From"),

            to: getHeader(headers, "To"),

            cc: getHeader(headers, "Cc"),

            subject: getHeader(headers, "Subject"),

            date: new Date(Number(email.internalDate)),

            snippet: this.cleanPreview(body),

            unread: email.labelIds.includes("UNREAD"),

            starred: email.labelIds.includes("STARRED"),

            important: email.labelIds.includes("IMPORTANT"),

            labels: email.labelIds,

            hasAttachment: attachments.length > 0,

            attachments

        };

    }

}

export default new GmailParser();