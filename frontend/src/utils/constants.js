export const PRIORITY_COLORS = {
  high: 'danger',
  medium: 'warning',
  low: 'secondary',
};

export function getPriorityBadge(priority) {
  const normalized = String(priority || 'medium').toLowerCase();
  if (normalized === 'high' || priority >= 80) return 'danger';
  if (normalized === 'medium' || (priority >= 50 && priority < 80)) return 'warning';
  return 'secondary';
}

export function getPriorityLabel(priority) {
  if (typeof priority === 'number') {
    if (priority >= 80) return 'High';
    if (priority >= 50) return 'Medium';
    return 'Low';
  }
  const normalized = String(priority || 'medium').toLowerCase();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export const SUGGESTED_PROMPTS = [
  'Summarize my unread emails from today',
  'What meetings do I have this week?',
  'Show my pending high-priority tasks',
  'Help me prepare for tomorrow',
  'Draft a reply to my latest important email',
];

export const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: 'dashboard' },
  { path: '/assistant', label: 'Assistant', icon: 'assistant' },
  { path: '/knowledge', label: 'Knowledge', icon: 'knowledge' },
  { path: '/gmail', label: 'Gmail', icon: 'gmail' },
  { path: '/calendar', label: 'Calendar', icon: 'calendar' },
  { path: '/tasks', label: 'Tasks', icon: 'tasks' },
  { path: '/settings', label: 'Settings', icon: 'settings' },
];

export const PAGE_TITLES = {
  '/': 'Dashboard',
  '/assistant': 'Assistant',
  '/knowledge': 'Knowledge Base',
  '/gmail': 'Gmail',
  '/calendar': 'Calendar',
  '/tasks': 'Tasks',
  '/settings': 'Settings',
};
