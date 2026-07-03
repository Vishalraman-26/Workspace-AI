class WorkspacePrompt {
    dailySummary(data){

        const importantEmails =
        (data.emails.emails ?? [])
        .filter(e=>e.priority>=70 || e.actionRequired)
        .slice(0,5);

        return `

        You are Workspace AI.

        Prepare a professional summary of today's work.

        Calendar

        ${JSON.stringify(data.calendar.events,null,2)}

        Tasks

        ${JSON.stringify(data.tasks,null,2)}

        Important Emails

        ${JSON.stringify(importantEmails,null,2)}

        Instructions

        • Mention interviews first.
        • Mention meetings next.
        • Mention pending tasks.
        • Mention only important emails.
        • Ignore newsletters.
        • Ignore social notifications.
        • Give priorities.
        • Maximum 200 words.

        `;

    }
    prepareInterview(data){

        const interviewEmails =
        (data.emails.emails ?? [])
        .filter(email=>email.category==="interview");

        const interviewEvents =
        (data.calendar.events ?? [])
        .filter(event=>event.category==="interview");

        const interviewTasks =
        (data.tasks ?? [])
        .filter(task=>
        (task.title+" "+task.description)
        .toLowerCase()
        .includes("interview")
        );

        return `

        You are Workspace AI.

        Prepare the user for their interview.

        Interview Events

        ${JSON.stringify(interviewEvents,null,2)}

        Interview Emails

        ${JSON.stringify(interviewEmails,null,2)}

        Preparation Tasks

        ${JSON.stringify(interviewTasks,null,2)}

        Instructions

        1. Focus ONLY on interview preparation.
        2. Ignore unrelated meetings.
        3. Ignore promotions.
        4. If no interview emails exist,
        say so.
        5. Suggest preparation steps.
        6. Under 200 words.

        `;

    }
    prepareTomorrow(data){

        return `

        You are Workspace AI.

        Help the user prepare for tomorrow.

        Tomorrow's Calendar

        ${JSON.stringify(data.calendar.events,null,2)}

        Pending Tasks

        ${JSON.stringify(data.tasks,null,2)}

        Important Emails

        ${JSON.stringify(
        (data.emails.emails??[])
        .filter(e=>e.priority>=70),
        null,
        2)}

        Instructions

        Summarize tomorrow's schedule.

        Mention preparation needed tonight.

        Highlight deadlines.

        Keep under 200 words.

        `;

    }
    urgentToday(data){

        const urgentEmails =
        (data.emails.emails??[])
        .filter(e=>e.actionRequired);

        const urgentTasks =
        (data.tasks??[])
        .filter(t=>!t.completed);

        return `

        You are Workspace AI.

        Show only urgent work.

        Today's Meetings

        ${JSON.stringify(data.calendar.events,null,2)}

        Urgent Tasks

        ${JSON.stringify(urgentTasks,null,2)}

        Urgent Emails

        ${JSON.stringify(urgentEmails,null,2)}

        Rules

        Ignore low priority items.

        Sort by urgency.

        `;

    }
    dailyBriefing(data){

        return `

        Good morning.

        Prepare today's briefing.

        Meetings

        ${JSON.stringify(data.calendar.stats,null,2)}

        Tasks

        ${JSON.stringify(data.tasks,null,2)}

        Emails

        ${JSON.stringify(data.emails.stats,null,2)}

        Give

        • today's schedule

        • priorities

        • reminders

        • action items

        Keep concise.

        `;

    }
    relatedEmails(data){

        return `

        Find emails related to these meetings.

        Meetings

        ${JSON.stringify(data.calendar.events,null,2)}

        Emails

        ${JSON.stringify(data.emails.emails,null,2)}

        Return matching emails only.

        `;

    }
    meetingTasks(data){

        return `

        Generate action items from meetings.

        Meetings

        ${JSON.stringify(data.calendar.events,null,2)}

        Create a task list.

        `;

    }
}

export default new WorkspacePrompt();