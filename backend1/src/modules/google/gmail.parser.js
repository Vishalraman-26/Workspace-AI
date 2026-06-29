import { getHeader } from "./google.utils.js";

class GmailParser {

    parse(email) {

        const headers = email.payload.headers || [];

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

            hasAttachment:
                this.hasAttachment(email.payload)

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
