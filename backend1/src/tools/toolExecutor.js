import toolRegistry from "./toolRegistry.js";

import taskService from "../tasks/task.service.js";
import * as emailService from "../services/email.service.js";
import * as calendarService from "../services/calendar.service.js";

const services = {
    task: taskService,
    email: emailService,
    calendar: calendarService
};

export async function executeTool(plan,userId){
    console.log("========== TOOL EXECUTOR ==========");
    console.log(plan);
    console.log("Executing Tool:", plan.tool);
    const tool = toolRegistry[plan.tool];
    console.log("Service:", tool.service);
    console.log("Method:", tool.method);
    console.log("User:", userId);
    if(!tool){
        throw new Error("Unknown Tool");
    }

    const service = services[tool.service];

    if(tool.requiresArgs){
        return service[tool.method](
            userId,
            plan.args
        );
    }
    return service[tool.method](userId);;
}