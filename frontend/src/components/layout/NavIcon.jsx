import {
  FiGrid,
  FiMessageSquare,
  FiBookOpen,
  FiMail,
  FiCalendar,
  FiCheckSquare,
  FiSettings,
} from 'react-icons/fi';

const ICON_MAP = {
  dashboard: FiGrid,
  assistant: FiMessageSquare,
  knowledge: FiBookOpen,
  gmail: FiMail,
  calendar: FiCalendar,
  tasks: FiCheckSquare,
  settings: FiSettings,
};

export default function NavIcon({ name, size = 18 }) {
  const Icon = ICON_MAP[name] || FiGrid;
  return <Icon size={size} />;
}
