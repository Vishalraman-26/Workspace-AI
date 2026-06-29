class QueryNormalizer {

    normalize(args = {}) {

        const normalized = { ...args };

        // -------- Time --------

        if (args.time) {

            switch (args.time.toLowerCase()) {

                case "today":
                    normalized.lastDays = 1;
                    break;

                case "yesterday":
                    normalized.lastDays = 2;
                    break;

                case "last week":
                    normalized.lastDays = 7;
                    break;

                case "this week":
                    normalized.lastDays = 7;
                    break;

                case "last month":
                    normalized.lastDays = 30;
                    break;

                case "this month":
                    normalized.lastDays = 30;
                    break;

            }

            delete normalized.time;

        }

        return normalized;

    }

}

export default new QueryNormalizer();