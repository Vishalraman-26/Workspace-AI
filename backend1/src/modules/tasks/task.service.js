import supabase from "../../config/supabase.js";
import BaseService from "../../shared/base.service.js";

class TaskService extends BaseService {

    async getTasks(userId) {
        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            this.handleError(error);
        }

        return data;
    }

    async getTaskById(userId, taskId) {

        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("id", taskId)
            .eq("user_id", userId)
            .single();

        if (error) {
            this.handleError(error);
        }

        return data;
    }

    async createTask(userId, task) {

        const payload = {

            user_id: userId,

            title: task.title,

            description: task.description ?? null,

            priority: task.priority ?? "medium",

            due_date: task.due_date ?? null,

            completed: false

        };

        const { data, error } = await supabase
            .from("tasks")
            .insert(payload)
            .select()
            .single();

        if (error) {
            this.handleError(error);
        }

        return data;
    }

async updateTask(userId, args) {

    let task;
    if (args.status) {
        const status = args.status.toLowerCase();
        if (status === "completed" || status === "complete" || status === "done") {
            args.completed = true;
        }
        if (status === "pending" || status === "incomplete") {
            args.completed = false;
        }
        delete args.status;
    }

    if (args.id) {

        task = await this.getTaskById(userId, args.id);

    } else if (args.title) {

        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", userId)
            .ilike("title", args.title)
            .limit(1)
            .single();

        if (error || !data) {
            throw new Error(`Task "${args.title}" not found.`);
        }

        task = data;

    } else {

        throw new Error("Task identifier is required.");

    }

    const updates = {

        ...(args.newTitle && { title: args.newTitle }),
        ...(args.description && { description: args.description }),
        ...(args.priority && { priority: args.priority }),
        ...(typeof args.completed === "boolean" && {
            completed: args.completed
        }),
        ...(args.due_date && { due_date: args.due_date }),

        updated_at: new Date().toISOString()

    };

    const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", task.id)
        .eq("user_id", userId)
        .select()
        .single();

    if (error) this.handleError(error);

    return data;
}
    async deleteTask(userId, taskRef) {

    let taskId = taskRef;

    // If AI passes an object instead of UUID
    if (typeof taskRef === "object") {

        if (taskRef.id) {

            taskId = taskRef.id;

        } else if (taskRef.title) {

            const { data, error } = await supabase
                .from("tasks")
                .select("id")
                .eq("user_id", userId)
                .ilike("title", taskRef.title)
                .limit(1)
                .single();

            if (error || !data) {
                throw new Error(`Task "${taskRef.title}" not found.`);
            }

            taskId = data.id;

        } else {

            throw new Error("Task identifier is missing.");

        }

    }

    const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId)
        .eq("user_id", userId);

    if (error) {
        this.handleError(error);
    }

    return {
        success: true,
        message: "Task deleted successfully."
    };

}

}

export default new TaskService();