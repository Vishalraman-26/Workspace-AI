class CalendarStatistics {

    build(events) {

        return {

            total: events.length,

            interviews:

                events.filter(

                    e =>

                    e.category === "interview"

                ).length,

            meetings:

                events.filter(

                    e =>

                    e.category === "meeting"

                ).length,

            deadlines:

                events.filter(

                    e =>

                    e.category === "deadline"

                ).length,

            exams:

                events.filter(

                    e =>

                    e.category === "exam"

                ).length,

            online:

                events.filter(

                    e =>

                    e.meetLink

                ).length,

            offline:

                events.filter(

                    e =>

                    !e.meetLink

                ).length,

            actionRequired:

                events.filter(

                    e =>

                    e.actionRequired

                ).length

        };

    }

}

export default new CalendarStatistics();