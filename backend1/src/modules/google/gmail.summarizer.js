import { generateText } from "../../ai/gemini.js";

class GmailSummarizer {

    async summarize(inbox) {

        const { stats, emails } = inbox;

        // Only send important emails to Gemini
        const importantEmails = emails
            .filter(email =>
                email.priority >= 60 ||
                email.actionRequired ||
                email.unread
            )
            .slice(0, 15)
            .map(email => ({
                from: email.from,
                subject: email.subject,
                category: email.category,
                priority: email.priority,
                unread: email.unread,
                actionRequired: email.actionRequired,
                snippet: email.snippet
            }));

        const prompt = `
You are Workspace AI.

You are an executive executive assistant.

Below are inbox statistics.

${JSON.stringify(stats, null, 2)}

Below are the important emails.

${JSON.stringify(importantEmails, null, 2)}

Instructions:

1. Never guess numbers.
2. Use the statistics exactly as provided.
3. Mention unread email count.
4. Mention action required count.
5. Mention urgent emails first.
6. Group similar emails together.
7. Ignore low priority promotions unless important.
8. Highlight interviews, meetings, exams and deadlines.
9. Keep the answer under 200 words.
10. Return natural English only.
`;

        return await generateText(prompt);

    }

}

export default new GmailSummarizer();