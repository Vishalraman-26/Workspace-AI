import { Badge } from 'react-bootstrap';
import { FiPaperclip, FiStar } from 'react-icons/fi';
import { formatRelative } from '../../utils/date';
import { truncate } from '../../utils/helpers';
import PriorityBadge from '../common/PriorityBadge';

export default function EmailListItem({ email, active, onClick }) {
  return (
    <button
      type="button"
      className={`wa-email-item w-100 border-0 bg-transparent text-start p-3 border-bottom ${
        active ? 'active' : ''
      }`}
      onClick={onClick}
    >
      <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
        <div className="fw-semibold text-truncate">{email.sender?.raw || email.from?.raw ||   email.sender?.email ||   email.from?.email ||   "Unknown Sender" }</div>
        <small className="text-muted flex-shrink-0">{formatRelative(email.date)}</small>
      </div>

      <div className={`mb-1 text-truncate ${email.unread ? 'fw-semibold' : ''}`}>{email.subject}</div>
      <div className="small text-muted mb-2">{truncate(email.snippet, 90)}</div>

      <div className="d-flex flex-wrap gap-1 align-items-center">
        {email.unread && <Badge bg="primary">Unread</Badge>}
        {email.category && (
          <Badge bg="light" text="dark" className="border">
            {email.category}
          </Badge>
        )}
        <PriorityBadge priority={email.priority} />
        {email.hasAttachment && (
          <Badge bg="secondary" className="d-inline-flex align-items-center gap-1">
            <FiPaperclip size={12} />
            Attachment
          </Badge>
        )}
        {email.starred && <FiStar size={14} className="text-warning" />}
      </div>
    </button>
  );
}
