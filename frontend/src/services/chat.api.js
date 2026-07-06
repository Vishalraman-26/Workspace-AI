import api from './api';

const chatApi = {
  sendMessage: (sessionId, message) =>
    api.post('/chat', { sessionId, message }),
};

export default chatApi;
