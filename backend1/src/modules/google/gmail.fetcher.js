import GmailClient from "./gmail.client.js";
import GmailParser from "./gmail.parser.js";
import GmailRanker from "./gmail.ranker.js";

class GmailFetcher {

    async getProfile(userId) {

        const gmail = await GmailClient.getClient(userId);

        const { data } = await gmail.users.getProfile({
            userId: "me"
        });

        return data;
    }

    async search(gmail, searchOptions) {

        const { data } = await gmail.users.messages.list({

            userId: "me",

            q: searchOptions.query,

            maxResults: searchOptions.maxResults,

            pageToken: searchOptions.pageToken

        });
        return {

            messages: data.messages || [],

            nextPageToken: data.nextPageToken ?? null

        };

    }
    async getEmail(gmail, id) {

        const { data } = await gmail.users.messages.get({
            userId: "me",
            id
        });

        return data;
    }


    async getEmails(gmail, messages) {

        const emails = await Promise.all(

            messages.map(async (message) => {

                const rawEmail = await this.getEmail(
                    gmail,
                    message.id
                );

                const parsedEmail = GmailParser.parse(rawEmail);


                return GmailRanker.rank(parsedEmail);

            })

        );

        emails.sort(
            (a, b) =>
                b.priority - a.priority ||
                new Date(b.date) - new Date(a.date)
        );
        return emails;
    }


    async fetch(userId, searchOptions) {

        const gmail = await GmailClient.getClient(userId);

        const searchResult = await this.search(
            gmail,
            searchOptions
        );

        const emails =

            await this.getEmails(

                gmail,

                searchResult.messages

            );

        return {

            total: emails.length,

            emails,

            nextPageToken:
                searchResult.nextPageToken

        };

    }

}

export default new GmailFetcher();