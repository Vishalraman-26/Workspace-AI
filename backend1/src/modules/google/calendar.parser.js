class CalendarParser {

    parse(event) {

        const meetLink =
            event.conferenceData?.entryPoints?.find(
                entry => entry.entryPointType === "video"
            )?.uri ?? null;

        return {

            id: event.id,

            title: event.summary ?? "Untitled Event",

            description: event.description ?? "",

            organizer: event.organizer?.email ?? "",

            attendees:
                event.attendees?.map(a => ({

                    email: a.email,

                    responseStatus: a.responseStatus,

                    organizer: a.organizer ?? false,

                    self: a.self ?? false

                })) ?? [],

            start:

                event.start?.dateTime ||

                event.start?.date ||

                null,

            end:

                event.end?.dateTime ||

                event.end?.date ||

                null,

            location: event.location ?? "",

            meetLink,

            status: event.status ?? "confirmed",

            recurring:

                Boolean(event.recurringEventId),

            allDay:

                Boolean(event.start?.date)

        };

    }

}

export default new CalendarParser();