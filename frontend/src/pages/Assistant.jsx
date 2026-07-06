import { useEffect, useState } from 'react';
import { FiMenu } from 'react-icons/fi';
import { Button } from 'react-bootstrap';
import chatApi from '../services/chat.api';
import useChatSessions from '../hooks/useChatSessions';
import useAutoScroll from '../hooks/useAutoScroll';
import ConversationList from '../components/chat/ConversationList';
import ChatMessage, { TypingIndicator } from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import SuggestedPrompts from '../components/chat/SuggestedPrompts';
import EmptyState from '../components/common/EmptyState';
import ErrorAlert from '../components/common/ErrorAlert';
import { FiMessageSquare } from 'react-icons/fi';
import { getErrorMessage } from '../utils/helpers';

export default function Assistant() {
  const {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession,
    addMessage,
  } = useChatSessions();

  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesRef = useAutoScroll([activeSession?.messages, sending]);

  useEffect(() => {
    if (sessions.length === 0) {
      createSession();
    }
  }, [sessions.length, createSession]);

  const sendMessage = async (text) => {
    if (!activeSessionId) {
      const session = createSession();
      await submitMessage(session.id, text);
      return;
    }
    await submitMessage(activeSessionId, text);
  };

  const submitMessage = async (sessionId, text) => {
    setInput('');
    setError(null);
    setSending(true);

    const userMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    addMessage(sessionId, userMessage);

    try {
      const { data } = await chatApi.sendMessage(sessionId, text);
      const reply = data.reply || data.message || 'No response received.';

      addMessage(sessionId, {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to send message'));
    } finally {
      setSending(false);
    }
  };

  const handleNewChat = () => {
    createSession();
    setSidebarOpen(false);
  };

  const messages = activeSession?.messages || [];
  const showSuggestions = messages.length === 0 && !sending;

  return (
    <div className="wa-assistant-page">
      <div className="wa-card wa-chat-layout d-flex overflow-hidden">
      <ConversationList
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelect={(id) => {
          setActiveSessionId(id);
          setSidebarOpen(false);
        }}
        onCreate={handleNewChat}
        onDelete={deleteSession}
        show={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="wa-chat-main flex-grow-1">
        <div className="border-bottom p-3 d-flex align-items-center gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            className="d-lg-none"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu />
          </Button>
          <div className="fw-semibold">{activeSession?.title || 'Assistant'}</div>
        </div>

        <div className="wa-messages" ref={messagesRef}>
          {error && <ErrorAlert message={error} onRetry={() => setError(null)} className="mb-3" />}

          {showSuggestions ? (
            <EmptyState
              icon={FiMessageSquare}
              title="How can I help you today?"
              description="Ask about emails, calendar, tasks, or your uploaded documents."
              action={<SuggestedPrompts onSelect={sendMessage} />}
            />
          ) : (
            <>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {sending && <TypingIndicator />}
            </>
          )}
        </div>

        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={sendMessage}
          disabled={sending}
        />
      </div>
      </div>
    </div>
  );
}
