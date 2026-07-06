import { FiInbox } from 'react-icons/fi';

export default function EmptyState({
  icon: Icon = FiInbox,
  title = 'Nothing here yet',
  description = '',
  action = null,
}) {
  return (
    <div className="wa-empty-state">
      <div className="mb-3">
        <Icon size={40} className="text-muted opacity-50" />
      </div>
      <h5 className="mb-2">{title}</h5>
      {description && <p className="mb-3">{description}</p>}
      {action}
    </div>
  );
}
