import toolRegistry from "./toolRegistry.js";

import * as taskService from "../tasks/task.service.js";
import * as emailService from "../services/email.service.js";
import * as calendarService from "../services/calendar.service.js";

const services = {
    task: taskService,
    email: emailService,
    calendar: calendarService
};

export async function executeTool(plan){
    console.log("Executing Tool:", plan.tool);
    const tool = toolRegistry[plan.tool];

    if(!tool){
        throw new Error("Unknown Tool");
    }

    const service = services[tool.service];

    return await service[tool.method](plan.args || {});
}