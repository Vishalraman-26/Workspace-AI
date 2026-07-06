import api from './api';

const calendarApi = {
  getEvents: () => api.get('/calendar/test'),

  createEvent: (payload) => api.post('/calendar/create', payload),

  updateEvent: (payload) => api.put('/calendar/update', payload),

  deleteEvent: (title) => api.delete('/calendar/delete', { data: { title } }),
};

export default calendarApi;
