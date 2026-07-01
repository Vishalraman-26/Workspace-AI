const EVENT_PRIORITY = {

    interview: 100,

    deadline: 95,

    exam: 90,

    meeting: 80,

    project: 75,

    travel: 70,

    healthcare: 70,

    reminder: 60,

    personal: 50,

    general: 40

};

class CalendarPriority {

    calculate(event) {

        let score = EVENT_PRIORITY[event.category] ?? 40;

        if (event.attendees.length > 3) {

            score += 10;

        }

        if (event.meetLink) {

            score += 5;

        }

        if (event.recurring) {

            score -= 5;

        }

        return Math.min(score, 100);

    }

}

export default new CalendarPriority();