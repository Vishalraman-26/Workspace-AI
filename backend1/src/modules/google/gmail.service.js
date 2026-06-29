import GmailFetcher from "./gmail.fetcher.js";
import GmailSearchBuilder from "./gmail.search.js";
import GmailSummarizer from "./gmail.summarizer.js";
import GmailStatistics from "./gmail.statistics.js";
import GmailThread from "./gmail.thread.js";

class GmailService {

    async test(userId) {

        return await GmailFetcher.getProfile(userId);

    }

    async fetchInbox(userId, options = {}) {

        const search = GmailSearchBuilder.buildQuery({

            sender: options.sender,

            keyword: options.keyword,

            subject: options.subject,

            unread: options.unread,

            read: options.read,

            starred: options.starred,

            hasAttachment: options.hasAttachment,

            lastDays: options.lastDays ?? 7,

            after: options.after,

            before: options.before,

            label: options.label,

            maxResults: options.maxResults,

            pageToken: options.pageToken

        });
        console.log(search);

        const inbox = await GmailFetcher.fetch(
            userId,
            search
        );
        const emails = GmailThread.deduplicate(inbox.emails);

        const stats = GmailStatistics.build(
            emails
        );

        return {
            total: emails.length,
            emails,
            stats,
            nextPageToken: inbox.nextPageToken
        };

    }

    async summarizeInbox(userId) {

        const inbox = await this.fetchInbox(

            userId,

            {

                lastDays: 7,

                maxResults: 30

            }

        );

        return await GmailSummarizer.summarize(
            inbox.emails
        );

    }
    async searchEmails(userId,args){

        return await this.fetchInbox(

            userId,

            args

        );

    }

}

export default new GmailService();