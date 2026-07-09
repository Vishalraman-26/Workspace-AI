import toolRegistry from "./toolRegistry.js";
import { ZodError } from "zod";
import taskService from "../modules/tasks/task.service.js";
import GmailService from "../modules/google/gmail.service.js";
import CalendarService from "../modules/google/calendar.service.js";
import RAGService from "../modules/rag/rag.service.js";
export const services = {
    task: taskService,
    gmail: GmailService,
    calendar: CalendarService,
    rag: RAGService
};
import QueryNormalizer from "./queryNormalizer.js";

export async function executeTool(plan,userId){
    try{
        const tool = toolRegistry[plan.tool];
        if(!tool){
            throw new Error("Unknown Tool");
        }
        if(tool.schema){
            tool.schema.parse(plan.args);
        }
        const service = services[tool.service];
        if (!service) {
            throw new Error(`Unknown service: ${tool.service}`);
        }
        const args = QueryNormalizer.normalize(plan.args || {});

        if(tool.requiresArgs){
            return service[tool.method](
                userId,
                args
            );
        }
        if(plan.tool==="searchKnowledge"){

            return{
                question:args.question
            };
        }
        return await  service[tool.method](userId);
    }catch(error){
        if(error instanceof ZodError){
            throw new Error(error.errors[0].message);
        }
        throw error;
    }
}