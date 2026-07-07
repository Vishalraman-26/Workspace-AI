import dayjs from '../../utils/date';

function parseEventDay(value) {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return dayjs(value, 'YYYY-MM-DD');
  }
  return dayjs(value);
}

export function extractCalendarEvents(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.events)) return data.events;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.data?.events)) return data.data.events;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

export function getEventStart(event) {
  if (!event?.start) return null;
  if (typeof event.start === 'string') return event.start;
  if (typeof event.start === 'object') {
    return event.start.dateTime || event.start.date || null;
  }
  return null;
}

export const EVENT_COLORS = {
  interview: { bg: '#7c3aed', border: '#6d28d9', label: 'Interview' },
  meeting: { bg: '#2563eb', border: '#1d4ed8', label: 'Meeting' },
  deadline: { bg: '#dc2626', border: '#b91c1c', label: 'Deadline' },
  reminder: { bg: '#f59e0b', border: '#d97706', label: 'Reminder' },
  birthday: { bg: '#ec4899', border: '#db2777', label: 'Birthday' },
  exam: { bg: '#8b5cf6', border: '#7c3aed', label: 'Exam' },
  general: { bg: '#64748b', border: '#475569', label: 'Event' },
};

export function getEventCategory(event) {
  const text = `${event.title || ''} ${event.description || ''}`.toLowerCase();
  if (text.includes('birthday')) return 'birthday';

  const category = String(event.category || 'general').toLowerCase();
  if (EVENT_COLORS[category]) return category;
  return 'general';
}

export function getEventColor(event) {
  const category = getEventCategory(event);
  return EVENT_COLORS[category] || EVENT_COLORS.general;
}

export function toFullCalendarEvents(events = []) {
  return events.map((event, index) => {
    const colors = getEventColor(event);
    return {
      id: event.id || `${event.title}-${index}`,
      title: event.title,
      start: event.start,
      end: event.end,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      extendedProps: { rawEvent: event, category: getEventCategory(event) },
    };
  });
}

export function getTodayEvents(events = []) {
  const today = dayjs().startOf('day');
  return events
    .filter((event) => {
      const start = getEventStart(event);
      const eventDay = parseEventDay(start);
      return eventDay?.isValid() && eventDay.isSame(today, 'day');
    })
    .sort((a, b) => new Date(getEventStart(a)) - new Date(getEventStart(b)));
}

export function getTomorrowEvents(events = []) {
  const tomorrow = dayjs().add(1, 'day').startOf('day');
  return events
    .filter((event) => {
      const start = getEventStart(event);
      const eventDay = parseEventDay(start);
      return eventDay?.isValid() && eventDay.isSame(tomorrow, 'day');
    })
    .sort((a, b) => new Date(getEventStart(a)) - new Date(getEventStart(b)));
}

export function getNextWeekEvents(events = []) {
  const weekStart = dayjs().add(1, 'day').endOf('day');
  const weekEnd = dayjs().add(7, 'day').endOf('day');
  return events
    .filter((event) => {
      const startValue = getEventStart(event);
      if (!startValue) return false;
      const start = parseEventDay(startValue);
      return start?.isValid() && start.isAfter(weekStart) && start.isBefore(weekEnd);
    })
    .sort((a, b) => new Date(getEventStart(a)) - new Date(getEventStart(b)));
}
