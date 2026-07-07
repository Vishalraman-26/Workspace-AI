import api from "./api";

const chatApi = {

    sendMessage: (sessionId, message) =>
        api.post("/chat", {
            sessionId,
            message
        }),

    getSessions: () =>
        api.get("/chat/sessions"),

    createSession: () =>
        api.post("/chat/sessions"),

    deleteSession: (id) =>
        api.delete(`/chat/sessions/${id}`),

    renameSession: (id, title) =>
        api.patch(`/chat/sessions/${id}`, {
            title
        }),

    getMessages: (sessionId) =>
        api.get(`/chat/${sessionId}/messages`)

};

export default chatApi;