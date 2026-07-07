import ReactMarkdown from 'react-markdown';
import { FiCpu, FiUser } from 'react-icons/fi';
import { formatTime } from '../../utils/date';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`wa-chat-message-row ${isUser ? 'user' : 'assistant'}`}>
      <div className={`wa-chat-avatar ${isUser ? 'user' : 'assistant'}`}>
        {isUser ? <FiUser size={15} /> : <FiCpu size={15} />}
      </div>

      <div className="wa-chat-message-body">
        <div className={isUser ? 'wa-message-user' : 'wa-message-assistant'}>
          {isUser ? (
            <div>{message.content}</div>
          ) : (
            <div className="wa-markdown">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
        <div className="wa-chat-message-time">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="wa-typing-wrap">
      <div className="wa-chat-avatar assistant">
        <FiCpu size={15} />
      </div>
      <div className="wa-typing-bubble">
        <div className="wa-typing-label">Assistant is thinking</div>
        <div className="wa-typing-dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
