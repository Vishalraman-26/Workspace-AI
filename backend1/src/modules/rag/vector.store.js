import supabase from "../../config/supabase.js";

class VectorStore {

    async insert(document) {

        try {

            const { data, error } =
                await supabase

                    .from("documents")

                    .insert(document)

                    .select();

            if (error) throw error;

            return data;

        }

        catch (error) {

            console.error(
                "Vector Insert Error:",
                error
            );

            throw new Error(
                "Failed to insert document."
            );

        }

    }

    async insertMany(documents) {

        try {

            if (!documents.length) {

                throw new Error(
                    "No documents to insert."
                );

            }

            const { data, error } =
                await supabase

                    .from("documents")

                    .insert(documents)

                    .select();

            if (error) throw error;

            return data;

        }

        catch (error) {

            console.error(
                "Bulk Insert Error:",
                error
            );

            throw new Error(
                "Failed to save document vectors."
            );

        }

    }

    async search(userId, queryEmbedding, matchCount = 5) {

        try {

            const { data, error } =
                await supabase.rpc(

                    "match_documents",

                    {

                        query_user_id: userId,

                        query_embedding: queryEmbedding,

                        match_count: matchCount,

                        match_threshold: 0.00

                    }

                );

            if (error) throw error;

            return data ?? [];

        }

        catch (error) {

            console.error(
                "Vector Search Error:",
                error
            );

            throw new Error(
                "Knowledge search failed."
            );

        }

    }

    async clear(userId) {

        try {

            const { error } =
                await supabase

                    .from("documents")

                    .delete()

                    .eq("user_id", userId);

            if (error) throw error;

        }

        catch (error) {

            console.error(
                "Clear Documents Error:",
                error
            );

            throw new Error(
                "Failed to delete documents."
            );

        }

    }

    async documentExists(userId, filename) {

        try {

            const { data, error } =
                await supabase

                    .from("documents")

                    .select("id")

                    .eq("user_id", userId)

                    .eq("title", filename)

                    .limit(1);

            if (error) throw error;

            return (data?.length ?? 0) > 0;

        }

        catch (error) {

            console.error(
                "Document Exists Error:",
                error
            );

            throw new Error(
                "Failed to verify existing document."
            );

        }

    }
    async listDocuments(userId){

    const { data, error } = await supabase

        .from("documents")

        .select("title,metadata")

        .eq("user_id", userId);

    if(error) throw error;

    const unique = [];

    const seen = new Set();

    for(const doc of data){

        if(!seen.has(doc.title)){

            seen.add(doc.title);

            unique.push({

                id: doc.title,

                name: doc.title,

                uploadedAt: doc.metadata?.uploadedAt

            });

        }

    }

    return unique;

}
async deleteDocument(title) {

    const { error } = await supabase

        .from("documents")

        .delete()

        .eq("title", title);

    if (error) throw error;

}

}

export default new VectorStore();