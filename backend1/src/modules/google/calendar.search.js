class CalendarSearch {

    buildQuery(options = {}) {

        const now = new Date();

        let timeMin = now.toISOString();

        let timeMax = null;

        // Today
        if (options.today) {

            const end = new Date();

            end.setHours(23, 59, 59, 999);

            timeMax = end.toISOString();

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

        // This Week
        else if (options.thisWeek) {

            const end = new Date();

            end.setDate(end.getDate() + 7);

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