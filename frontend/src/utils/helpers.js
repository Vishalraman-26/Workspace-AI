export function getInitials(nameOrEmail = '') {
  const value = String(nameOrEmail).trim();
  if (!value) return 'U';

  if (value.includes('@')) {
    return value.charAt(0).toUpperCase();
  }

  const parts = value.split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

export function truncate(text, max = 120) {
  if (!text) return '';
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export function classNames(...args) {
  return args.filter(Boolean).join(' ');
}

export function getErrorMessage(error, fallback = 'Something went wrong') {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}
