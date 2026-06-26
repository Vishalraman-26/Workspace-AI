import supabase from "../config/supabase.js";
import BaseService from "../shared/base.service.js";

class TaskService extends BaseService {

    async getTasks(userId) {

        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) {
            throw new Error(error.message);
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
            throw new Error(error.message);
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
            throw new Error(error.message);
        }

        return data;
    }

    async updateTask(userId, taskId, updates) {

        updates.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from("tasks")
            .update(updates)
            .eq("id", taskId)
            .eq("user_id", userId)
            .select()
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async deleteTask(userId, taskId) {

        const { error } = await supabase
            .from("tasks")
            .delete()
            .eq("id", taskId)
            .eq("user_id", userId);

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
            message: "Task deleted successfully."
        };
    }

}

export default new TaskService();