import {
    IMPORTANT_SENDERS,
    SEARCH_LIMITS
} from "./gmail.constants.js";

class GmailSearchBuilder {

    buildQuery(filters = {}) {

        const query = [];

        // --------------------------------------------------
        // Sender
        // --------------------------------------------------

        if (filters.sender) {

            const sender =
                IMPORTANT_SENDERS[
                    filters.sender.toLowerCase()
                ];

            if (sender) {

                query.push(
                    sender
                        .map(domain => `from:${domain}`)
                        .join(" OR ")
                );

            } else {

                query.push(`from:${filters.sender}`);

            }

        }

        // --------------------------------------------------
        // Keyword
        // --------------------------------------------------

        if (filters.keyword) {

            query.push(filters.keyword);

        }

        // --------------------------------------------------
        // Subject
        // --------------------------------------------------

        if (filters.subject) {

            query.push(`subject:${filters.subject}`);

        }

        // --------------------------------------------------
        // Read / Unread
        // --------------------------------------------------

        if (filters.unread === true) {

            query.push("is:unread");

        }

        if (filters.read === true) {

            query.push("is:read");

        }

        // --------------------------------------------------
        // Attachments
        // --------------------------------------------------

        if (filters.hasAttachment) {

            query.push("has:attachment");

        }

        // --------------------------------------------------
        // Starred
        // --------------------------------------------------

        if (filters.starred) {

            query.push("is:starred");

        }

        // --------------------------------------------------
        // Date
        // --------------------------------------------------

        if (filters.lastDays) {

            query.push(`newer_than:${filters.lastDays}d`);

        }

        if (filters.after) {

            query.push(`after:${filters.after}`);

        }

        if (filters.before) {

            query.push(`before:${filters.before}`);

        }

        // --------------------------------------------------
        // Labels
        // --------------------------------------------------

        if (filters.label) {

            query.push(`label:${filters.label}`);

        }
        if (filters.primary) {
            query.push("category:primary");
        }
        //query.push("category:primary");
        return {
            query: query.join(" "),
            maxResults:filters.maxResults ?? 20,
            pageToken:filters.pageToken
        };

    }

}

export default new GmailSearchBuilder();