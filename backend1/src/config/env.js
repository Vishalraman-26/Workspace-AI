
import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT || 5000,

    NODE_ENV: process.env.NODE_ENV,

    JWT_SECRET: process.env.JWT_SECRET,

    SUPABASE_URL: process.env.SUPABASE_URL,

    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,

    GEMINI_API_KEY: process.env.GEMINI_API_KEY,

    GEMINI_MODEL:
        process.env.GEMINI_MODEL || "gemini-2.5-flash",
};

export default env;