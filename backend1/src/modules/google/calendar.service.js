import CalendarFetcher from "./calendar.fetcher.js";
import CalendarSearch from "./calendar.search.js";
import CalendarStatistics from "./calendar.statistics.js";

class CalendarService {

    async test(userId) {

        return await this.retrieveCalendar(userId, {
            rangeDays: 30,
            maxResults: 100
        });

    }

    async retrieveCalendar(userId, options = {}) {

        const search = CalendarSearch.buildQuery({

            today: options.today,

            tomorrow: options.tomorrow,

            thisWeek: options.thisWeek,

            maxResults: options.maxResults

        });

        const result = await CalendarFetcher.fetch(
            userId,
            search
        );

        const events = result.events;

        const stats = CalendarStatistics.build(events);

        return {

            total: events.length,

            events,

            stats

        };

    }

    async scheduleMeeting(userId, args) {

        return await CalendarFetcher.createEvent(
            userId,
            args
        );

    }

    async updateMeeting(userId, args) {

        const event = await CalendarFetcher.findEvent(

            userId,

            {

                title: args.title

            }

        );

        if (!event) {

            throw new Error("Event not found.");

        }

        return await CalendarFetcher.updateEvent(

            userId,

            {

                id: event.id,

                title: args.newTitle ?? event.title,

                description: args.description ?? event.description,

                location: args.location ?? event.location,

                start:
                    args.start ??
                    event.start?.dateTime ??
                    event.start?.date,

                end:
                    args.end ??
                    event.end?.dateTime ??
                    event.end?.date


            }

        );

    }

    async deleteMeeting(userId, args) {

        const event = await CalendarFetcher.findEvent(

            userId,

            {

                title: args.title

            }

        );

        if (!event) {

            throw new Error("Event not found.");

        }

        return await CalendarFetcher.deleteEvent(

            userId,

            {

                id: event.id

            }

        );

    }

}

export default new CalendarService();