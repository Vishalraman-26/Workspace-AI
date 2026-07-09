class EntityResolver {

    resolve(message, memory) {

        if (!memory) return null;

        const text = message.toLowerCase();
        const data = memory.data;

        // Emails
        if (memory.tool === "searchEmails") {

            const emails = data.emails || [];

            if (text.includes("first"))
                return {
                    tool: memory.tool,
                    type: "email",
                    index: 0,
                    entity: emails[0]
                };

            if (text.includes("second"))
                return {
                    tool: memory.tool,
                    type: "email",
                    index: 1,
                    entity: emails[1]
                };

            if (text.includes("third"))
                return {
                    tool: memory.tool,
                    type: "email",
                    index: 2,
                    entity: emails[2]
                };

            if (text.includes("last"))
                return {
                    tool: memory.tool,
                    type: "email",
                    index: emails.length - 1,
                    entity: emails[emails.length - 1]
                };

            if (text.includes("them") || text.includes("these"))
                return {
                    tool: memory.tool,
                    type: "email",
                    entity: emails
                };
        }

        // Calendar
        if (memory.tool === "retrieveCalendar"  || memory.tool === "scheduleMeeting" ||  memory.tool === "updateMeeting") {

            const events = Array.isArray(data.events) ? data.events    : [data];

            if (text.includes("first"))
                return {
                    tool: memory.tool,
                    type: "meeting",
                    index: 0,
                    entity: events[0]
                };

            if (text.includes("second"))
                return {
                    tool: memory.tool,
                    type: "meeting",
                    index: 1,
                    entity: events[1]
                };

            if (text.includes("third"))
                return {
                    tool: memory.tool,
                    type: "meeting",
                    index: 2,
                    entity: events[2]
                };

            if (text.includes("last"))
                return {
                    tool: memory.tool,
                    type: "meeting",
                    index: events.length - 1,
                    entity: events[events.length - 1]
                };

            if (
                text.includes("it") ||
                text.includes("meeting") ||
                text.includes("time") ||
                text.includes("timing") ||
                text.includes("reschedule") ||
                text.includes("move")
            )
                return {
                    tool: memory.tool,
                    type: "meeting",
                    index: 0,
                    entity: events[0]
                };
        }

        return null;
    }

}

export default new EntityResolver();