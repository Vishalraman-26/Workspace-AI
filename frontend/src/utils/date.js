import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatDate(date, format = 'MMM D, YYYY') {
  if (!date) return '';
  return dayjs(date).format(format);
}

export function formatTime(date, format = 'h:mm A') {
  if (!date) return '';
  return dayjs(date).format(format);
}

export function formatDateTime(date) {
  if (!date) return '';
  return dayjs(date).format('MMM D, YYYY h:mm A');
}

export function formatRelative(date) {
  if (!date) return '';
  return dayjs(date).fromNow();
}

export function isToday(date) {
  return dayjs(date).isSame(dayjs(), 'day');
}

export function isSameDay(a, b) {
  return dayjs(a).isSame(dayjs(b), 'day');
}

export default dayjs;
