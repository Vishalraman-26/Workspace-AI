import { generateText } from "./gemini.js";

const SYSTEM_PROMPT = `
You are the planning engine for Workspace AI.

Your job is NOT to answer the user.

Your only job is to decide whether the user's request requires a backend tool.

Available tools:

getTasks
createTask
updateTask
deleteTask

fetchInbox

retrieveCalendar

scheduleMeeting

searchKnowledge

Rules:

If no backend tool is needed return

{
"action":"chat"
}

If a backend tool is required return

{
"action":"tool",
"tool":"tool_name",
"args":{}
}

Return ONLY JSON.

Never explain.

Never use markdown.
`;

export default async function plan(message){
    console.log("Planner Started");
    const prompt = `${SYSTEM_PROMPT}

User:

${message}
`;
    console.log("Calling Gemini...");
    const reply = await generateText(prompt);
    console.log("Planner Reply:", reply);
    return reply;

}