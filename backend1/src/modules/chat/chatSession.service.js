import supabase from "../../config/supabase.js";

class ChatSessionService {

    async create(userId, title = "New Chat") {

        const { data, error } = await supabase
            .from("chat_sessions")
            .insert({
                user_id: userId,
                title
            })
            .select()
            .single();

        if (error) throw error;

        return data;
    }
    async get(userId, sessionId) {

        const { data, error } = await supabase
            .from("chat_sessions")
            .select("*")
            .eq("id", sessionId)
            .eq("user_id", userId)
            .single();

        if (error) throw error;

        return data;

    }

    async list(userId) {

        const { data, error } = await supabase
            .from("chat_sessions")
            .select("*")
            .eq("user_id", userId)
            .order("updated_at", { ascending: false });

        if (error) throw error;

        return data;
    }

    async rename(userId, sessionId, title) {

        const { data, error } = await supabase
            .from("chat_sessions")
            .update({
                title,
                updated_at: new Date().toISOString()
            })
            .eq("id", sessionId)
            .eq("user_id", userId)
            .select()
            .single();

        if (error) throw error;

        return data;
    }

    async touch(userId, sessionId) {

        const { error } = await supabase
            .from("chat_sessions")
            .update({
                updated_at: new Date().toISOString()
            })
            .eq("id", sessionId)
            .eq("user_id", userId);

        if (error) throw error;
    }

    async delete(userId, sessionId) {

        const { error } = await supabase
            .from("chat_sessions")
            .delete()
            .eq("id", sessionId)
            .eq("user_id", userId);

        if (error) throw error;

        await supabase
            .from("conversations")
            .delete()
            .eq("user_id", userId)
            .eq("session_id", sessionId);

        await supabase
            .from("tool_memory")
            .delete()
            .eq("user_id", userId)
            .eq("session_id", sessionId);
    }

}

export default new ChatSessionService();