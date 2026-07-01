import CalendarClient from "./calendar.client.js";
import CalendarParser from "./calendar.parser.js";
import CalendarRanker from "./calendar.ranker.js";
class CalendarFetcher {

    async getProfile(userId) {

        const calendar = await CalendarClient.getClient(userId);

        const { data } = await calendar.calendarList.list();

        return data;

    }

    async search(userId, searchOptions) {
        //console.log("Search Options:", searchOptions);
        

        const calendar = await CalendarClient.getClient(userId);

        const request = {
            calendarId: "primary",
            timeMin: searchOptions.timeMin,
            maxResults: searchOptions.maxResults,
            singleEvents: true,
            orderBy: "startTime"
        };

        if (searchOptions.timeMax) {
            request.timeMax = searchOptions.timeMax;
        }

        const { data } = await calendar.events.list(request);

        return {

            events: data.items || []

        };

    }

    async getEvent(userId, id) {

        const calendar = await CalendarClient.getClient(userId);

        const { data } = await calendar.events.get({

            calendarId: "primary",

            eventId: id

        });

        return data;

    }

    async getEvents(userId, events) {

        const calendarEvents = [];
        for (
            const event of events
        ) {
            const rawEvent =
                await this.getEvent(
                    userId,
                    event.id
                );
            const parsedEvent =
                CalendarParser.parse(
                    rawEvent
                );
            const rankedEvent =
                CalendarRanker.rank(
                    parsedEvent
                );
            calendarEvents.push(
                rankedEvent
            );
        }
        calendarEvents.sort(
            (a, b) =>
                b.priority -
                a.priority ||
                new Date(a.start) -
                new Date(b.start)
        );
        return calendarEvents;
    }

    async fetch(userId, searchOptions) {

        const searchResult = await this.search(
            userId,
            searchOptions
        );

        const events = await this.getEvents(
            userId,
            searchResult.events
        );

        return {

            total: events.length,

            events

        };

    }
    async createEvent(userId, eventData) {

        const calendar = await CalendarClient.getClient(userId);
        const { data } = await calendar.events.insert({
            calendarId: "primary",
            requestBody: {
                summary: eventData.title,
                description: eventData.description,
                location: eventData.location,
                start: {
                    dateTime: eventData.start,
                    timeZone: "Asia/Kolkata"
                },
                end: {
                    dateTime: eventData.end,
                    timeZone: "Asia/Kolkata"
                },
                attendees:
                    (eventData.attendees || []).map(email => ({
                        email
                    })),
                conferenceData: eventData.meetLink
                    ? {
                        createRequest: {
                            requestId:
                                Date.now().toString()
                        }
                    }
                    : undefined
            },
            conferenceDataVersion: 1
        });
        return data;
    }

    async updateEvent(userId, eventData) {

        const calendar = await CalendarClient.getClient(userId);

        const { data } = await calendar.events.patch({

            calendarId: "primary",

            eventId: eventData.id,

            requestBody: {

                summary: eventData.title,

                description: eventData.description,

                location: eventData.location,

                start: {
                    dateTime: eventData.start,
                    timeZone: "Asia/Kolkata"
                },

                end: {
                    dateTime: eventData.end,
                    timeZone: "Asia/Kolkata"
                }

            }

        });

        return data;

    }    

    async deleteEvent(userId, eventData) {

        const calendar = await CalendarClient.getClient(userId);

        await calendar.events.delete({

            calendarId: "primary",

            eventId: eventData.id

        });

        return {

            success: true,

            message: "Event deleted successfully."

        };

    }
    async findEvent(userId, options = {}) {

        const search = await this.search(userId, {
            timeMin: options.timeMin ?? new Date().toISOString(),
            maxResults: 50
        });

        const events = await this.getEvents(
            userId,
            search.events
        );

        const period = options.period?.toLowerCase();

        const filtered = events.filter(event => {

            if (options.title &&
                !event.title.toLowerCase().includes(options.title.toLowerCase())) {
                return false;
            }

            if (options.date) {

                const eventDate =
                    new Date(event.start).toISOString().slice(0, 10);

                if (eventDate !== options.date) {
                    return false;
                }
            }

            if (period) {

                const hour = new Date(event.start).getHours();

                if (period === "morning" && hour >= 12)
                    return false;

                if (period === "afternoon" && (hour < 12 || hour >= 17))
                    return false;

                if (period === "evening" && hour < 17)
                    return false;
            }

            return true;

        });

        if (filtered.length === 0)
            return null;

        return filtered[0];

    }

}
export default new CalendarFetcher();