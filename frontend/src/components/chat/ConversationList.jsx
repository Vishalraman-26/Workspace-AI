import { Button } from 'react-bootstrap';
import { FiMessageSquare, FiPlus, FiTrash2 } from 'react-icons/fi';
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
          className="wa-chat-overlay d-lg-none"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div className={`wa-chat-sidebar d-flex flex-column ${show ? 'show' : ''}`}>
        <div className="wa-chat-sidebar-header">
          <div className="wa-chat-sidebar-title">Conversations</div>
          <Button
            variant="primary"
            className="w-100 wa-chat-new-btn d-flex align-items-center justify-content-center gap-2"
            onClick={onCreate}
          >
            <FiPlus size={16} />
            New Chat
          </Button>
        </div>

        <div className="wa-chat-sessions">
          {sessions.length === 0 ? (
            <div className="wa-chat-sidebar-empty">
              <FiMessageSquare size={24} className="mb-2 opacity-50" />
              <div>No conversations yet</div>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;

              return (
                <div
                  key={session.id}
                  className={`wa-chat-session-item ${isActive ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    className="wa-chat-session-btn"
                    onClick={() => onSelect(session.id)}
                  >
                    <div className="wa-chat-session-title">{session.title}</div>
                    <div className="wa-chat-session-meta">
                      {formatRelative(session.updatedAt)}
                    </div>
                  </button>
                  <button
                    type="button"
                    className="wa-chat-session-delete"
                    onClick={() => onDelete(session.id)}
                    aria-label="Delete conversation"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
