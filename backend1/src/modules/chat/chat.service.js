import plan from "../../ai/planner.js";
import { executeTool } from "../../tools/toolExecutor.js";
import { generateText } from "../../ai/gemini.js";
import Orchestrator from "../../ai/orchestrator.js";
import ConversationService from "../conversation/conversation.service.js";
import ToolMemoryService from "../toolMemory/toolMemory.service.js";
import EntityResolver from "../entity/entityResolver.js";
import ErrorHandler from "../../utils/errorHandler.js";
import ResponseFormatter from "../../ai/responseFormatter.js";
import ChatSessionService from "./chatSession.service.js";
class ChatService {

    async chat(userId, sessionId, message) {
        try{
            const history = await ConversationService.history(userId, sessionId);
            const conversationContext = ConversationService.buildContext(history);
            await ConversationService.save(userId, sessionId, "user", message);
            const session =
                await ChatSessionService.get(
                    userId,
                    sessionId
                );

            if (session.title === "New Chat") {

                const title=message.trim().split(/\s+/).slice(0, 6).join(" ") + "...";

                await ChatSessionService.rename(
                    userId,
                    sessionId,
                    title
                );

            }
            // Auto rename "New Chat" after the first message

            if (history.length === 1) {
                await ChatSessionService.rename(
                    userId,
                    sessionId,
                    message.substring(0, 50)
                );
            }

            // Update chat ordering
            await ChatSessionService.touch(userId, sessionId);
            const memory =await ToolMemoryService.latest(userId,sessionId);
            const entity =EntityResolver.resolve(message,memory);

            const planner = await plan(
                `Previous Conversation:
                ${conversationContext}
                Resolved Entity:
                ${entity ? JSON.stringify(entity, null, 2) : "None"}
                Current User Message:
                ${message}
            If the current request contains words like:

                - it
                - them
                - this
                - that
                - first
                - second
                - last

                use the conversation history to determine what the user is referring to.`);

            if (planner.action === "chat") {
                console.log("Planner selected CHAT");
            }
            if (planner.action === "tool") {
                console.log("Planner selected TOOL");
            }

            if (planner.action === "chat") {

                const reply = await generateText(message);

                await ConversationService.save(userId,sessionId,"assistant",reply,planner.tool);
                await ChatSessionService.touch(userId, sessionId);
                return reply;

            }
            if (planner.action === "orchestrate") {
                return await Orchestrator.execute(
                    userId,
                    sessionId,
                    planner.intent
                );
            }

            const toolResult = await executeTool(

                planner,

                userId

            );
            await ToolMemoryService.save(userId,sessionId,planner.tool,toolResult);
            
            // ==============================
            // Calendar CRUD (No Gemini)
            // ==============================

            if (planner.tool === "scheduleMeeting") {

                const start = new Date(toolResult.start.dateTime);
                const end = new Date(toolResult.end.dateTime);

                const reply =
            `✅ Meeting "${toolResult.summary}" has been scheduled successfully.

            📅 ${start.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric"
            })}

            🕒 ${start.toLocaleTimeString("en-IN", {
                hour: "numeric",
                minute: "2-digit"
            })} - ${end.toLocaleTimeString("en-IN", {
                hour: "numeric",
                minute: "2-digit"
            })}`;

                await ConversationService.save(
                    userId,
                    sessionId,
                    "assistant",
                    reply,
                    planner.tool
                );

                return reply;
            }

            if (planner.tool === "updateMeeting") {

                const start = new Date(toolResult.start.dateTime);
                const end = new Date(toolResult.end.dateTime);

                const reply =
            `✅ Meeting "${toolResult.summary}" has been updated successfully.

            📅 ${start.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric"
            })}

            🕒 ${start.toLocaleTimeString("en-IN", {
                hour: "numeric",
                minute: "2-digit"
            })} - ${end.toLocaleTimeString("en-IN", {
                hour: "numeric",
                minute: "2-digit"
            })}`;

                await ConversationService.save(
                    userId,
                    sessionId,
                    "assistant",
                    reply,
                    planner.tool
                );

                return reply;
            }

            if (planner.tool === "deleteMeeting") {

                const reply = "✅ Meeting deleted successfully.";

                await ConversationService.save(
                    userId,
                    sessionId,
                    "assistant",
                    reply,
                    planner.tool
                );

                return reply;
            }

            // ==============================
            // Task CRUD (No Gemini)
            // ==============================

            if (planner.tool === "createTask") {

                const reply =
            `✅ Task "${toolResult.title}" has been created successfully.

            ${toolResult.priority ? `🔥 Priority: ${toolResult.priority}\n` : ""}${toolResult.due_date ? `📅 Due: ${new Date(toolResult.due_date).toLocaleDateString("en-IN")}` : ""}`;

                await ConversationService.save(
                    userId,
                    sessionId,
                    "assistant",
                    reply,
                    planner.tool
                );

                return reply;
            }

            if (planner.tool === "updateTask") {

                const reply =
            `✅ Task "${toolResult.title}" has been updated successfully.

            ${toolResult.priority ? `🔥 Priority: ${toolResult.priority}\n` : ""}${toolResult.status ? `📌 Status: ${toolResult.status}\n` : ""}${toolResult.due_date ? `📅 Due: ${new Date(toolResult.due_date).toLocaleDateString("en-IN")}` : ""}`;

                await ConversationService.save(
                    userId,
                    sessionId,
                    "assistant",
                    reply,
                    planner.tool
                );

                return reply;
            }

            if (planner.tool === "deleteTask") {

                const reply = `✅ Task deleted successfully.`;

                await ConversationService.save(
                    userId,
                    sessionId,
                    "assistant",
                    reply,
                    planner.tool
                );

                return reply;
            }



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

                        const reply = await generateText(finalPrompt);

                    await ConversationService.save(userId,sessionId,"assistant",reply,planner.tool);
                    await ChatSessionService.touch(userId, sessionId);
                    return reply;

            }
            if (planner.tool === "retrieveCalendar") {

                const events = toolResult.events || [];

                const stats = toolResult.stats || {};

                const important = events.filter(

                    e => e.priority >= 80

                );

                const prompt = `

            You are Workspace AI.

            The user asked:

            ${message}

            The calendar has already been analyzed.

            Statistics:

            ${JSON.stringify(stats,null,2)}

            Important Events:

            ${JSON.stringify(important,null,2)}

            Other Events:

            ${JSON.stringify(events.slice(0,5),null,2)}

            Instructions:

            1. Never invent events.

            2. Use the statistics exactly.

            3. Mention interviews first.

            4. Mention meetings second.

            5. Mention deadlines.

            6. Mention actionRequired events.

            7. Keep under 200 words.

            Return natural English only.

            `;
            const reply = await generateText(prompt);

            await ConversationService.save(userId,sessionId,"assistant",reply,planner.tool);
            await ChatSessionService.touch(userId, sessionId);
            return reply;

            }

                // Default prompt for every other tool
            const finalPrompt =
                ResponseFormatter.build(

                    message,

                    planner.tool,

                    toolResult,

                    conversationContext

                );
                const reply = await generateText(finalPrompt);

                await ConversationService.save(userId,sessionId,"assistant",reply,planner.tool);
                await ChatSessionService.touch(userId, sessionId);
                await ConversationService.trim(userId,sessionId);
                return reply;


        
        }
        catch(error){

            console.error(error);

            const errorMessage = ErrorHandler.format(error);

            try {

                await ConversationService.save(
                    userId,
                    sessionId,
                    "assistant",
                    `⚠️ ${errorMessage}`
                );

            } catch {}

            throw new Error(errorMessage);

        }

    }
}

export default new ChatService();