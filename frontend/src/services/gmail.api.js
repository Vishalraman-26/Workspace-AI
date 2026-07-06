import api from './api';

const gmailApi = {
  getInbox: () => api.get('/google/gmail/inbox'),

  summarize: () => api.get('/google/gmail/summary'),

  search: (filters) => {
    const emails = filters?.emails || [];
    const query = (filters?.query || '').toLowerCase().trim();

    if (!query) return Promise.resolve({ data: emails });

    const filtered = emails.filter((email) => {
      const haystack = [
        email.subject,
        email.from,
        email.sender,
        email.snippet,
        email.category,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });

    return Promise.resolve({ data: filtered });
  },
};

export default gmailApi;
