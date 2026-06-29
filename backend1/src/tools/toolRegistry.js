import { CreateTaskSchema, UpdateTaskSchema } from "../modules/tasks/task.schema.js";
export const toolRegistry = {

    getTasks: {

        service: "task",

        method: "getTasks",

        description: "Fetch all tasks for the authenticated user.",

        requiresUser: true,

        requiresArgs: false

    },

    createTask: {

        service: "task",

        method: "createTask",

        description: "Create a new task.",
        schema: CreateTaskSchema,

        requiresUser: true,

        requiresArgs: true

    },

    updateTask: {

        service: "task",

        method: "updateTask",

        description: "Update an existing task.",

        schema:UpdateTaskSchema,

        requiresUser: true,

        requiresArgs: true

    },

    deleteTask: {

        service: "task",

        method: "deleteTask",

        description: "Delete a task.",

        requiresUser: true,

        requiresArgs: true

    },

    searchEmails: {

        tool: "searchEmails",

        service: "gmail",

        method: "searchEmails",

        requiresArgs: true

    },

    summarizeInbox: {

        tool: "summarizeInbox",

        service: "gmail",

        method: "summarizeInbox",

        requiresArgs: false

    },

    retrieveCalendar: {

        service: "calendar",

        method: "retrieveCalendar",

        description: "Fetch calendar events.",

        requiresUser: true,

        requiresArgs: false

    },

    scheduleMeeting: {

        service: "calendar",

        method: "scheduleMeeting",

        description: "Schedule a meeting.",

        requiresUser: true,

        requiresArgs: true

    },

    deleteMeeting: {

        service: "calendar",

        method: "deleteMeeting",

        description: "Delete a calendar event.",

        requiresUser: true,

        requiresArgs: true

    },

    searchKnowledge: {

        service: "rag",

        method: "searchKnowledge",

        description: "Search the knowledge base.",

        requiresUser: true,

        requiresArgs: true

    }

};

export default toolRegistry;