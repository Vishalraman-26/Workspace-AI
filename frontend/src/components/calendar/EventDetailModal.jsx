import { Modal, Button, Badge } from 'react-bootstrap';
import { FiEdit2, FiTrash2, FiMapPin, FiVideo } from 'react-icons/fi';
import { formatDateTime } from '../../utils/date';
import { getEventColor } from './eventUtils';
import PriorityBadge from '../common/PriorityBadge';

export default function EventDetailModal({
  show,
  event,
  onHide,
  onEdit,
  onDelete,
}) {
  if (!event) return null;

  const colors = getEventColor(event);

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="wa-modal-premium">
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2 flex-wrap">
          <span
            className="wa-event-legend-swatch"
            style={{ backgroundColor: colors.bg, width: 12, height: 12 }}
          />
          {event.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-wrap gap-2 mb-3">
          <Badge bg="light" text="dark" className="border">
            {colors.label}
          </Badge>
          {event.priority != null && <PriorityBadge priority={event.priority} />}
          {event.actionRequired && (
            <Badge bg="warning" text="dark">Action Required</Badge>
          )}
        </div>

        <div className="wa-detail-row">
          <span className="wa-detail-label">Start</span>
          <span className="wa-detail-value">{formatDateTime(event.start)}</span>
        </div>
        <div className="wa-detail-row">
          <span className="wa-detail-label">End</span>
          <span className="wa-detail-value">{formatDateTime(event.end)}</span>
        </div>
        {event.location && (
          <div className="wa-detail-row">
            <span className="wa-detail-label">Location</span>
            <span className="wa-detail-value d-flex align-items-center gap-1">
              <FiMapPin size={14} />
              {event.location}
            </span>
          </div>
        )}
        {event.description && (
          <div className="wa-detail-row">
            <span className="wa-detail-label">Details</span>
            <span className="wa-detail-value">{event.description}</span>
          </div>
        )}
        {event.meetLink && (
          <div className="wa-detail-row">
            <span className="wa-detail-label">Meeting</span>
            <span className="wa-detail-value">
              <a href={event.meetLink} target="_blank" rel="noreferrer">
                <FiVideo size={14} className="me-1" />
                Join Google Meet
              </a>
            </span>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        <Button
          variant="outline-primary"
          className="d-flex align-items-center gap-2"
          onClick={() => onEdit(event)}
        >
          <FiEdit2 size={14} />
          Edit
        </Button>
        <Button
          variant="outline-danger"
          className="d-flex align-items-center gap-2"
          onClick={() => onDelete(event)}
        >
          <FiTrash2 size={14} />
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
