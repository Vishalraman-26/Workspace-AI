import plan from "../../ai/planner.js";
import { executeTool } from "../../tools/toolExecutor.js";
import { generateText } from "../../ai/gemini.js";

class ChatService {

    async chat(userId, message) {
        //console.log("========== CHAT ==========");
        //console.log("Message:", message);

        const planner = await plan(message);
        //console.log("Planner Result:", planner);
        //console.log("PLAN:", planner);
        if (planner.action === "chat") {
            console.log("Planner selected CHAT");
        }
        if (planner.action === "tool") {
            console.log("Planner selected TOOL");
        }

        if (planner.action === "chat") {

            return await generateText(message);

        }

        const toolResult = await executeTool(

            planner,

            userId

        );
      //  console.log("========== TOOL RESULT ==========");
    //console.log(toolResult);
    if (planner.tool === "searchEmails") {

    const emails = toolResult.emails || [];

    const urgent = emails.filter(e => e.priority >= 90);

    const important = emails.filter(
        e => e.priority >= 70 && e.priority < 90
    );

    const normal = emails.filter(
        e => e.priority < 70
    );

    const stats = {

        total: emails.length,

        unread: emails.filter(e => e.unread).length,

        urgent: urgent.length,

        important: important.length,

        actionRequired: emails.filter(
            e => e.actionRequired
        ).length

    };

    const finalPrompt = `

        You are Workspace AI.

        You are an executive assistant.

        The user asked:

        ${message}

        The backend has already analyzed the inbox.

        Statistics:

        ${JSON.stringify(stats, null, 2)}

        Urgent Emails:

        ${JSON.stringify(urgent, null, 2)}

        Important Emails:

        ${JSON.stringify(important, null, 2)}

        Other Emails:

        ${JSON.stringify(normal.slice(0,5), null, 2)}

        Rules:

        1. Show urgent emails first.
        2. Mention actionRequired emails first.
        3. Mention the unread count from Statistics.
        4. Do NOT recount unread emails yourself.
        5. Use the priority already provided.
        6. Use the category already provided.
        7. Ignore low-priority promotions unless the user asks for them.
        8. Keep the answer under 200 words.

        Return natural English only.

        `;

            return await generateText(finalPrompt);

}

        // Default prompt for every other tool
    const finalPrompt = `

        The user asked:

        ${message}

        Tool Result:

        ${JSON.stringify(toolResult, null, 2)}

        Answer naturally like an AI assistant.

        Do not output JSON.

    `;


        return await generateText(finalPrompt);

    }

}

export default new ChatService();