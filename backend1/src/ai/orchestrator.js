import GmailService from "../modules/google/gmail.service.js";
import CalendarService from "../modules/google/calendar.service.js";
import TaskService from "../modules/tasks/task.service.js";
import { generateText } from "./gemini.js";
import WorkspacePrompt from "./workspacePrompt.js";
import ContextBuilder from "./contextBuilder.js";
class Orchestrator {

    async execute(userId, intent) {

        switch(intent){

            case "daily_summary":
                return this.dailySummary(userId);

            case "prepare_tomorrow":
                return this.prepareTomorrow(userId);

            case "urgent_today":
                return this.urgentToday(userId);

            case "daily_briefing":
                return this.dailyBriefing(userId);

            case "prepare_interview":
                return this.prepareInterview(userId);

            case "meeting_tasks":
                return this.meetingTasks(userId);

            case "related_emails":
                return this.relatedEmails(userId);

            default:
                throw new Error("Unknown orchestrator intent.");

            }
        

    }
    async dailySummary(userId){

        const context =
            await ContextBuilder.build(
                userId,
                {
                    tasks:true,

                    calendar:{
                        today:true
                    },

                    emails:{
                        unread:true,
                        maxResults:10
                    }
                }
            );

        const prompt =
            WorkspacePrompt.dailySummary(context)

        return await generateText(prompt);

    }

    async prepareTomorrow(userId){

        const context =
            await ContextBuilder.build(
                userId,
                {
                    tasks:true,

                    calendar:{
                        tomorrow:true
                    },

                    emails:{
                        unread:true,
                        maxResults:10
                    }
                }
            );

        const prompt =
            WorkspacePrompt.prepareTomorrow(context)

        return await generateText(prompt);

    }
    async urgentToday(userId){

        const context =
            await ContextBuilder.build(
                userId,
                {
                    tasks:true,

                    calendar:{
                        today:true
                    },

                    emails:{
                        unread:true,
                        maxResults:10
                    }
                }
            );

        const prompt =
            WorkspacePrompt.urgentToday(context)

        return await generateText(prompt);

    }
    async prepareInterview(userId) {

        const context = await ContextBuilder.build(userId, {

            tasks: true,

            calendar: {
                thisWeek: true
            },

            emails: {
                category: "interview",
                unread: true,
                maxResults: 10
            }

        });

        const prompt = WorkspacePrompt.prepareInterview(context);

        return await generateText(prompt);

    }
    async meetingTasks(userId) {

        const context = await ContextBuilder.build(userId, {

            calendar: {
                today: true
            }

        });

        const prompt = WorkspacePrompt.meetingTasks(context);
        return await generateText(prompt);

    }
    async relatedEmails(userId){

        const context = await ContextBuilder.build(userId,{

            calendar:{
                today:true
            },

            emails:{
                unread:true,
                maxResults:20
            }

        });

        const prompt = WorkspacePrompt.relatedEmails(context);

        return await generateText(prompt);

    }
    async dailyBriefing(userId){

        const context = await ContextBuilder.build(userId,{

            tasks:true,

            calendar:{
                today:true
            },

            emails:{
                unread:true,
                maxResults:10
            }

        });

        const prompt = WorkspacePrompt.dailyBriefing(context);

        return await generateText(prompt);

    }

}

export default new Orchestrator();