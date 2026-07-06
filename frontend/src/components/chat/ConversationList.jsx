import { Button } from 'react-bootstrap';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { formatRelative } from '../../utils/date';

export default function ConversationList({
  sessions,
  activeSessionId,
  onSelect,
  onCreate,
  onDelete,
  show,
  onClose,
}) {
  return (
    <>
      {show && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1025 }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div className={`wa-chat-sidebar d-flex flex-column ${show ? 'show' : ''}`}>
        <div className="p-3 border-bottom">
          <Button variant="primary" className="w-100 d-flex align-items-center justify-content-center gap-2" onClick={onCreate}>
            <FiPlus />
            New Chat
          </Button>
        </div>

        <div className="flex-grow-1 overflow-auto p-2">
          {sessions.length === 0 ? (
            <div className="text-muted small text-center p-3">No conversations yet</div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className={`d-flex align-items-center gap-2 p-2 rounded mb-1 ${
                  session.id === activeSessionId ? 'bg-primary bg-opacity-10' : ''
                }`}
              >
                <button
                  type="button"
                  className="btn btn-link text-start flex-grow-1 p-0 text-decoration-none text-body"
                  onClick={() => onSelect(session.id)}
                >
                  <div className="fw-medium text-truncate">{session.title}</div>
                  <div className="small text-muted">{formatRelative(session.updatedAt)}</div>
                </button>
                <button
                  type="button"
                  className="btn btn-link btn-sm text-muted p-1"
                  onClick={() => onDelete(session.id)}
                  aria-label="Delete conversation"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
