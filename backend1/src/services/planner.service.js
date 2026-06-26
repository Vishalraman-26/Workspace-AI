import  plan  from "../ai/planner.js";
import { parsePlannerResponse } from "../ai/parser.js";
export async function chatService(message) {

    if (!message || message.trim() === "") {
        throw new Error("Message is required.");
    }
    console.log("Planner Service Started");
    const rawReply = await plan(message);
    const parsedReply = parsePlannerResponse(rawReply);
    return {
        success:true,
        plan: parsedReply
    };
}
