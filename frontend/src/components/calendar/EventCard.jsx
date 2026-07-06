import { Badge, Button } from 'react-bootstrap';
import { FiMapPin, FiVideo, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatDateTime, formatTime, isToday } from '../../utils/date';
import PriorityBadge from '../common/PriorityBadge';

export default function EventCard({ event, onEdit, onDelete }) {
  const startLabel = isToday(event.start)
    ? `Today, ${formatTime(event.start)}`
    : formatDateTime(event.start);

  return (
    <div className="wa-card wa-card-hover p-3 h-100">
      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
        <h6 className="mb-0">{event.title}</h6>
        <PriorityBadge priority={event.priority} />
      </div>

      <div className="small text-muted mb-2">{startLabel}</div>

      {event.location && (
        <div className="small d-flex align-items-center gap-1 text-muted mb-1">
          <FiMapPin size={14} />
          {event.location}
        </div>
      )}

      {event.meetLink && (
        <div className="small d-flex align-items-center gap-1 mb-2">
          <FiVideo size={14} />
          <a href={event.meetLink} target="_blank" rel="noreferrer">
            Join meeting
          </a>
        </div>
      )}

      <div className="d-flex flex-wrap gap-1 mb-3">
        {event.category && <Badge bg="light" text="dark" className="border">{event.category}</Badge>}
        {event.actionRequired && <Badge bg="warning" text="dark">Action Required</Badge>}
      </div>

      {event.description && (
        <p className="small text-muted mb-3">{event.description}</p>
      )}

      <div className="d-flex gap-2 mt-auto">
        <Button variant="outline-primary" size="sm" onClick={() => onEdit(event)}>
          <FiEdit2 size={14} />
        </Button>
        <Button variant="outline-danger" size="sm" onClick={() => onDelete(event)}>
          <FiTrash2 size={14} />
        </Button>
      </div>
    </div>
  );
}
