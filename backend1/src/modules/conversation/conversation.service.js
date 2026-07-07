import supabase from "../../config/supabase.js";

class ConversationService {

    async save(userId, sessionId, role, message, tool = null) {

        const { error } = await supabase
            .from("conversations")
            .insert({

                user_id: userId,

                session_id: sessionId,

                role,

                message,

                tool

            });

        if (error) throw error;

    }

    async history(userId, sessionId, limit = 1000) {

        const { data, error } = await supabase
            .from("conversations")
            .select("id, role, message, created_at")
            .eq("user_id", userId)
            .eq("session_id", sessionId)
            .order("created_at", {
                ascending: true
            })
            .limit(limit);
    
        if (error) throw error;
    
        return data.map(message => ({
    
            id: message.id,
    
            role: message.role,
    
            content: message.message,
    
            timestamp: message.created_at
    
        }));
    
    }
    async clear(userId, sessionId) {

        await supabase
            .from("conversations")
            .delete()
            .eq("user_id", userId)
            .eq("session_id", sessionId);

    }
    buildContext(history) {
            return history
                .map(item => `${item.role.toUpperCase()}: ${item.message}`)
                .join("\n\n");
    }
    async trim(userId, sessionId) {

        const { data } = await supabase
            .from("conversations")
            .select("id")
            .eq("user_id", userId)
            .eq("session_id", sessionId)
            .order("created_at", { ascending: false });

        if (!data || data.length <= 50) return;

        const removeIds = data.slice(50).map(x => x.id);

        await supabase
            .from("conversations")
            .delete()
            .in("id", removeIds);

    }
}

export default new ConversationService();