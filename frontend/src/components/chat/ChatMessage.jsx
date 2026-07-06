import ReactMarkdown from 'react-markdown';
import { formatTime } from '../../utils/date';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`d-flex flex-column mb-3 ${isUser ? 'align-items-end' : 'align-items-start'}`}>
      <div className={isUser ? 'wa-message-user' : 'wa-message-assistant'}>
        {isUser ? (
          <div>{message.content}</div>
        ) : (
          <ReactMarkdown>{message.content}</ReactMarkdown>
        )}
      </div>
      <small className="text-muted mt-1 px-1">{formatTime(message.timestamp)}</small>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="wa-message-assistant mb-3">
      <div className="wa-typing-dots">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
