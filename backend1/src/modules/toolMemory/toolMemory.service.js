import supabase from "../../config/supabase.js";

class ToolMemoryService {

    async save(userId, sessionId, tool, data) {

        await supabase
            .from("tool_memory")
            .insert({

                user_id: userId,

                session_id: sessionId,

                tool,

                data

            });

    }

    async latest(userId, sessionId) {

        const { data, error } = await supabase
            .from("tool_memory")
            .select("*")
            .eq("user_id", userId)
            .eq("session_id", sessionId)
            .order("created_at", {
                ascending: false
            })
            .limit(1)
            .single();

        if (error) return null;

        return data;

    }

    async clear(userId, sessionId) {

        await supabase
            .from("tool_memory")
            .delete()
            .eq("user_id", userId)
            .eq("session_id", sessionId);

    }

}

export default new ToolMemoryService();