class GmailStatistics {

    build(emails = []) {

        const stats = {

            total: emails.length,

            unread: 0,

            read: 0,

            urgent: 0,

            actionRequired: 0,

            attachments: 0,

            categories: {}

        };

        for (const email of emails) {

            // Read / Unread
            if (email.unread) {
                stats.unread++;
            } else {
                stats.read++;
            }

            // Priority
            if (email.priority >= 70) {
                stats.urgent++;
            }

            // Action Required
            if (email.actionRequired) {
                stats.actionRequired++;
            }

            // Attachments
            if (email.hasAttachment) {
                stats.attachments++;
            }

            // Categories
            stats.categories[email.category] ??= 0;
            stats.categories[email.category]++;

        }

        return stats;

    }

}

export default new GmailStatistics();