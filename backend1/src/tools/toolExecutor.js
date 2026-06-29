import toolRegistry from "./toolRegistry.js";
import { ZodError } from "zod";
import taskService from "../modules/tasks/task.service.js";
import GmailService from "../modules/google/gmail.service.js";
export const services = {
    task: taskService,
    gmail: GmailService
};
import QueryNormalizer from "./queryNormalizer.js";

export async function executeTool(plan,userId){
    try{
        console.log(plan);
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
        return await  service[tool.method](userId);
    }catch(error){
        if(error instanceof ZodError){
            throw new Error(error.errors[0].message);
        }
        throw error;
    }
}