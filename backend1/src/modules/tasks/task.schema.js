import { z } from "zod";

export const CreateTaskSchema = z.object({

    title: z.string().min(1, "Title is required"),

    description: z.string().optional(),

    priority: z.enum([
        "low",
        "medium",
        "high"
    ]).optional(),

    due_date: z.string().optional()

});

export const UpdateTaskSchema = z.object({

    title: z.string().optional(),

    description: z.string().optional(),

    priority: z.enum([
        "low",
        "medium",
        "high"
    ]).optional(),

    completed: z.boolean().optional(),

    due_date: z.string().optional()

});