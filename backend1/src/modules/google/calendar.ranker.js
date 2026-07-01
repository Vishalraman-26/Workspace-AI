import { CALENDAR_RULES } from "./calendar.rules.js";
import  CalendarPriority  from "./calendar.priority.js";

class CalendarRanker {

    rank(event) {

        const text = (

            event.title +

            " " +

            event.description

        ).toLowerCase();

        let category = "general";

        let bestScore = 0;

        for (

            const [name, keywords]

            of Object.entries(CALENDAR_RULES)

        ) {

            let score = 0;

            for (

                const keyword of keywords

            ) {

                if (

                    text.includes(

                        keyword.toLowerCase()

                    )

                ) {

                    score++;

                }

            }

            if (

                score > bestScore

            ) {

                bestScore = score;

                category = name;

            }

        }

        const priority = CalendarPriority.calculate({

            ...event,

            category

        });

        const actionRequired =

            priority >= 80;

        return {

            ...event,

            category,

            priority,

            actionRequired

        };

    }

}

export default new CalendarRanker();