// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
    // Health Check
    health: async () => {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.json();
    },

    // Emails
    getEmails: async (params = {}) => {
        const query = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/emails${query ? `?${query}` : ''}`);
        if (!response.ok) throw new Error('Failed to get emails');
        return response.json();
    },
    markEmailRead: async (emailId) => {
        const response = await fetch(`${API_BASE_URL}/emails/${emailId}/read`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to mark email as read');
        return response.json();
    },

    // Calendar Events
    getEvents: async () => {
        const response = await fetch(`${API_BASE_URL}/calendar`);
        if (!response.ok) throw new Error('Failed to get events');
        return response.json();
    },
    createEvent: async (eventData) => {
        const response = await fetch(`${API_BASE_URL}/calendar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData)
        });
        if (!response.ok) throw new Error('Failed to create event');
        return response.json();
    },
    deleteEvent: async (eventId) => {
        const response = await fetch(`${API_BASE_URL}/calendar/${eventId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete event');
        return response.json();
    },

    // Tasks
    getTasks: async () => {
        const response = await fetch(`${API_BASE_URL}/tasks`);
        if (!response.ok) throw new Error('Failed to get tasks');
        return response.json();
    },
    createTask: async (taskData) => {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        if (!response.ok) throw new Error('Failed to create task');
        return response.json();
    },
    updateTaskStatus: async (taskId, status) => {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update task status');
        return response.json();
    },

    // Approvals
    getApprovals: async () => {
        const response = await fetch(`${API_BASE_URL}/agent/approvals`);
        if (!response.ok) throw new Error('Failed to get approvals');
        return response.json();
    },
    approve: async (approvalId) => {
        const response = await fetch(`${API_BASE_URL}/agent/approvals/${approvalId}/approve`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error('Failed to approve action');
        return response.json();
    },
    reject: async (approvalId) => {
        const response = await fetch(`${API_BASE_URL}/agent/approvals/${approvalId}/reject`, {
            method: 'POST'
        });
        if (!response.ok) throw new Error('Failed to reject action');
        return response.json();
    },

    // Agent Chat
    chat: async (messages) => {
        const response = await fetch(`${API_BASE_URL}/agent/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages })
        });
        if (!response.ok) throw new Error('Failed to send message to agent');
        return response.json();
    }
};

export default api;