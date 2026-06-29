export function buildToolPrompt(question, toolResult){

    return `
        User asked:
        ${question}
        Tool Result:
        ${JSON.stringify(toolResult,null,2)}
        Answer naturally.
        Do not output JSON.
    `;
}

export function buildEmailSummaryPrompt(emails) {

    return `
        You are Workspace AI.
        You are an executive assistant.
        Below are emails from the user's inbox.
        ${JSON.stringify(emails, null, 2)}
        Instructions:
        1. Summarize the inbox.
        2. Highlight emails requiring action.
        3. Ignore obvious promotions unless important.
        4. Group similar emails.
        5. Mention urgent emails first.
        6. Keep the answer under 200 words.
        Return natural English only.
    `;
}