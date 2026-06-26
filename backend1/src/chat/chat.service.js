import plan from "../ai/planner.js";
import { executeTool } from "../tools/toolExecutor.js";
import { generateText } from "../ai/gemini.js";

class ChatService {

    async chat(userId, message) {
        console.log("========== CHAT ==========");
        console.log("Message:", message);

        const planner = await plan(message);
        console.log("Planner Result:", planner);
        console.log("PLAN:", planner);
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