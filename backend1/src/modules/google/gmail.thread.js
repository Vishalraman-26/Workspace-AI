class GmailThread {

    deduplicate(emails = []) {

        const threads = new Map();

        for (const email of emails) {

            const existing = threads.get(email.threadId);

            if (!existing) {

                threads.set(email.threadId, email);
                continue;

            }

            if (new Date(email.date) > new Date(existing.date)) {

                threads.set(email.threadId, email);

            }

        }

        return [...threads.values()];

    }

}

export default new GmailThread();