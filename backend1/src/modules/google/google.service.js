import { google } from "googleapis";
import oauth2Client from "../../integrations/google/oauth.js";
import env from "../../config/env.js";
import GmailService from "./gmail.service.js";
import supabase from "../../config/supabase.js";
class GoogleService {

    async getAuthUrl(userId) {

        const state = Buffer
            .from(userId)
            .toString("base64");

        const url = oauth2Client.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: [
                "https://www.googleapis.com/auth/gmail.readonly",
                "https://www.googleapis.com/auth/calendar",
                "https://www.googleapis.com/auth/calendar.events"
            ],
            state
        });
        return url;
    }

    async handleCallback(code, state) {

        const { tokens } = await oauth2Client.getToken(code);

        const userId = Buffer
            .from(state, "base64")
            .toString();

        const { error } = await supabase
            .from("google_tokens")
            .upsert({
                user_id: userId,
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expiry_date: tokens.expiry_date,
                scope: tokens.scope,
                token_type: tokens.token_type
            });
        console.log("SUPABASE ERROR:", error);

        if (error) {
            throw error;
        }

        return {
            success: true,
            message: "Google account connected successfully."
        };
    }
    async fetchInbox(userId){
        return await GmailService.fetchInbox(userId);
    }
    async summarizeInbox(userId){
        return await GmailService.summarizeInbox(userId);
    }
}

export default new GoogleService();