import supabase from "../../config/supabase.js";

class TokenService {

    async getGoogleTokens(userId) {

        const { data, error } = await supabase
            .from("google_tokens")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();

        
        return data;
    }

}

export default new TokenService();