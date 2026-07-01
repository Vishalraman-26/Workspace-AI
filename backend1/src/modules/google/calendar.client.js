import { google } from "googleapis";
import oauth2Client from "../../integrations/google/oauth.js";
import TokenService from "./token.service.js";

class CalendarClient {

    async getClient(userId) {
        //console.log("Calendar userId:", userId);

        const tokens = await TokenService.getGoogleTokens(userId);
        //console.log("Calendar Tokens:", tokens);
        oauth2Client.setCredentials({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expiry_date: tokens.expiry_date
        });
        //console.log("Calendar Client Initialized");
        return google.calendar({
            version: "v3",
            auth: oauth2Client
        });
    }
}

export default new CalendarClient();