import { google } from "googleapis";
import oauth2Client from "../../integrations/google/oauth.js";
import TokenService from "./token.service.js";

class GmailClient {

    async getClient(userId) {

        const tokens = await TokenService.getGoogleTokens(userId);
         console.log("Setting Credentials:", tokens);

        oauth2Client.setCredentials({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expiry_date: tokens.expiry_date

        });
        console.log("OAuth Credentials:", oauth2Client.credentials);
        return google.gmail({
            version: "v1",
            auth: oauth2Client
        });
    }
}
export default new GmailClient();