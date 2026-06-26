export const toolRegistry = {
    getTasks: {
        service: "task",
        method: "getTasks"
    },

    createTask: {
        service: "task",
        method: "createTask"
    },

    updateTask: {
        service: "task",
        method: "updateTask"
    },

    deleteTask: {
        service: "task",
        method: "deleteTask"
    },

    fetchInbox: {
        service: "email",
        method: "fetchInbox"
    },

    retrieveCalendar: {
        service: "calendar",
        method: "retrieveCalendar"
    },

    scheduleMeeting: {
        service: "calendar",
        method: "scheduleMeeting"
    },

    searchKnowledge: {
        service: "rag",
        method: "searchKnowledge"
    }
};

export default toolRegistry;