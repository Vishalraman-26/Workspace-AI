class ResponseFormatter {

    build(message, toolName, toolResult, conversation = "") {

        return `
You are Workspace AI.

Previous Conversation:

${conversation}

User Request:

${message}

Tool Used:

${toolName}

Tool Result:

${JSON.stringify(toolResult, null, 2)}

Instructions:

• Answer naturally.
• Never output JSON.
• Keep formatting clean.
• Use bullet points when listing items.
• Highlight urgent or important information first.
• If no data exists, politely tell the user.

`;

    }

}

export default new ResponseFormatter();