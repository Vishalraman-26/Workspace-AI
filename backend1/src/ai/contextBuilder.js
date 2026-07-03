import GmailService from "../modules/google/gmail.service.js";
import CalendarService from "../modules/google/calendar.service.js";
import TaskService from "../modules/tasks/task.service.js";

class ContextBuilder {

    async build(userId, options = {}) {

        const context = {};

        if (options.tasks) {

            context.tasks =
                await TaskService.getTasks(userId);

        }

        if (options.calendar) {

            context.calendar =
                await CalendarService.retrieveCalendar(
                    userId,
                    options.calendar
                );

        }

        if (options.emails) {

            context.emails =
                await GmailService.fetchInbox(
                    userId,
                    options.emails
                );

        }

        return context;

    }

}

export default new ContextBuilder();