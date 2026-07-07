import { useEffect, useRef } from 'react';
import { FiSend } from 'react-icons/fi';

export default function ChatInput({ value, onChange, onSubmit, disabled, placeholder }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!value.trim() || disabled) return;
      onSubmit(value.trim());
    }
  };

  return (
    <div className="wa-chat-input-area">
      <form onSubmit={handleSubmit} className="wa-chat-input-wrap">
        <div className="wa-chat-input-box">
          <textarea
            ref={textareaRef}
            className="wa-chat-textarea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder || 'Ask Workspace AI anything...'}
            disabled={disabled}
            rows={1}
            aria-label="Message input"
          />
          <button
            type="submit"
            className="wa-chat-send-btn"
            disabled={disabled || !value.trim()}
            aria-label="Send message"
          >
            <FiSend size={16} />
          </button>
        </div>
        <div className="wa-chat-input-hint">
          Enter to send · Shift+Enter for new line
        </div>
      </form>
    </div>
  );
}
