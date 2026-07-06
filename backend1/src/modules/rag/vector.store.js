import supabase from "../../config/supabase.js";

class VectorStore {

    async insert(document) {

        const { data, error } = await supabase
            .from("documents")
            .insert(document)
            .select();

        if (error) throw error;

        return data;

    }

    async insertMany(documents) {

        const { data, error } = await supabase
            .from("documents")
            .insert(documents)
            .select();

        if (error) throw error;

        return data;

    }

    async search(userId, queryEmbedding, matchCount = 5) {

        const { data, error } = await supabase.rpc(
    
            "match_documents",
    
            {
    
                query_user_id: userId,
    
                query_embedding: queryEmbedding,
    
                match_count: matchCount,
    
                match_threshold: 0.00
    
            }
    
        );
    
        if (error) throw error;
    
        return data;
    
    }

    async clear(userId) {

        const { error } = await supabase
            .from("documents")
            .delete()
            .eq("user_id", userId);
    
        if (error) throw error;
    
    }
    async documentExists(userId, filename) {

        const { data, error } = await supabase
            .from("documents")
            .select("id")
            .eq("user_id", userId)
            .eq("title", filename)
            .limit(1);
    
        if (error) throw error;
    
        return data.length > 0;
    }

}

export default new VectorStore();