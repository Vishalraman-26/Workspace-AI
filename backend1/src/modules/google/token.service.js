import supabase from "../../config/supabase.js";

class TokenService {

    async getGoogleTokens(userId) {

        const { data, error } = await supabase
            .from("google_tokens")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();
        if (data) {
            // console.log("Google Tokens:", data);
        }
        if (error) {
            console.log("Error:", error);
            throw error;
        }
        
        return data;
    }

}

export default new TokenService();