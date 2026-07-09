import GmailService from "../modules/google/gmail.service.js";
import CalendarService from "../modules/google/calendar.service.js";
import TaskService from "../modules/tasks/task.service.js";
import { generateText } from "./gemini.js";
import WorkspacePrompt from "./workspacePrompt.js";
import ContextBuilder from "./contextBuilder.js";
import ConversationService from "../modules/conversation/conversation.service.js";
class Orchestrator {

    async execute(userId, sessionId, intent) {

        switch(intent){

            case "daily_summary":
                return this.dailySummary(userId, sessionId);

            case "prepare_tomorrow":
                return this.prepareTomorrow(userId, sessionId);

            case "urgent_today":
                return this.urgentToday(userId, sessionId);

            case "daily_briefing":
                return this.dailyBriefing(userId, sessionId);

            case "prepare_interview":
                return this.prepareInterview(userId, sessionId);

            case "meeting_tasks":
                return this.meetingTasks(userId, sessionId);

            case "related_emails":
                return this.relatedEmails(userId, sessionId);

            default:
                throw new Error("Unknown orchestrator intent.");

            }
        

    }
    async dailySummary(userId, sessionId){

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

        const reply = await generateText(prompt);

        await ConversationService.save(userId,sessionId,"assistant",reply,"daily_summary");

        return reply;

    }

    async prepareTomorrow(userId, sessionId){

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

        const reply = await generateText(prompt);

        await ConversationService.save(userId,sessionId,"assistant",reply,"prepare_tomorrow");

        return reply;

    }
    async urgentToday(userId, sessionId){

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

        const reply = await generateText(prompt);

        await ConversationService.save(userId,sessionId,"assistant",reply,"urgentToday");

        return reply;

        

    }
    async prepareInterview(userId, sessionId) {

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

        const reply = await generateText(prompt);

        await ConversationService.save(userId,sessionId,"assistant",reply,"prepare_interview");

        return reply;

    }
    async meetingTasks(userId, sessionId) {

        const context = await ContextBuilder.build(userId, {

            calendar: {
                today: true
            }

        });

        const prompt = WorkspacePrompt.meetingTasks(context);
        const reply = await generateText(prompt);

        await ConversationService.save(userId,sessionId,"assistant",reply,"meeting_tasks");

        return reply;

        

    }
    async relatedEmails(userId, sessionId){

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

        const reply = await generateText(prompt);

        await ConversationService.save(userId,sessionId,"assistant",reply,"related_emails");

        return reply;

    }
    async dailyBriefing(userId, sessionId){

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

        const reply = await generateText(prompt);

        await ConversationService.save(userId,sessionId,"assistant",reply,"daily_briefing");

        return reply;

        

    }

}

export default new Orchestrator();