class CalendarSearch {

    buildQuery(options = {}) {

        const now = new Date();

        let timeMin = now.toISOString();

        let timeMax = null;

        const startOfToday = () => {
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            return start;
        };

        const endOfToday = () => {
            const end = new Date();
            end.setHours(23, 59, 59, 999);
            return end;
        };

        // Today (full day, including events that already started)
        if (options.today) {

            timeMin = startOfToday().toISOString();
            timeMax = endOfToday().toISOString();

        }

        // Tomorrow
        else if (options.tomorrow) {

            const start = new Date();

            start.setDate(start.getDate() + 1);

            start.setHours(0, 0, 0, 0);

            const end = new Date(start);

            end.setHours(23, 59, 59, 999);

            timeMin = start.toISOString();

            timeMax = end.toISOString();

        }

        // This Week (from start of today)
        else if (options.thisWeek) {

            timeMin = startOfToday().toISOString();

            const end = new Date();

            end.setDate(end.getDate() + 7);
            end.setHours(23, 59, 59, 999);

            timeMax = end.toISOString();

        }

        // Upcoming range (e.g. next 30 days from start of today)
        else if (options.rangeDays) {

            timeMin = startOfToday().toISOString();

            const end = new Date();

            end.setDate(end.getDate() + options.rangeDays);
            end.setHours(23, 59, 59, 999);

            timeMax = end.toISOString();

        }

        return {

            timeMin,

            timeMax,

            maxResults:

                options.maxResults ?? 20

        };

    }

}

export default new CalendarSearch();