import { useEffect, useState } from "react";
import { FiMenu, FiMessageSquare } from "react-icons/fi";
import { Button } from "react-bootstrap";

import chatApi from "../services/chat.api";
import useChatSessions from "../hooks/useChatSessions";
import useAutoScroll from "../hooks/useAutoScroll";

import ConversationList from "../components/chat/ConversationList";
import ChatMessage, { TypingIndicator } from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";
import SuggestedPrompts from "../components/chat/SuggestedPrompts";

import ErrorAlert from "../components/common/ErrorAlert";

import { getErrorMessage } from "../utils/helpers";

import "../styles/chat.css";

function createOptimisticUserMessage(content) {
    return {
        id: `optimistic-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        role: "user",
        content,
        timestamp: new Date().toISOString(),
    };
}

export default function Assistant() {

    const {
        sessions,
        activeSession,
        activeSessionId,
        setActiveSessionId,
        createSession,
        deleteSession,
        addMessage,
        loadMessages,
        reloadSessions,
        renameFromFirstMessage,
    } = useChatSessions();

    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const messages = activeSession?.messages ?? [];

    const messagesRef = useAutoScroll([messages, sending]);

    useEffect(() => {
        if (activeSessionId) {
            loadMessages(activeSessionId);
        }
    }, [activeSessionId, loadMessages]);

    const submitMessage = async (sessionId, text) => {
        const trimmed = text.trim();
        if (!trimmed) return;

        setInput("");
        setError(null);

        renameFromFirstMessage(sessionId, trimmed);
        addMessage(sessionId, createOptimisticUserMessage(trimmed));
        setSending(true);

        try {
            await chatApi.sendMessage(sessionId, trimmed);
            await loadMessages(sessionId);
            await reloadSessions();
        } catch (err) {
            setError(
                getErrorMessage(err, "Failed to send message.")
            );
        } finally {
            setSending(false);
        }
    };

    const sendMessage = async (text) => {
        const trimmed = text.trim();
        if (!trimmed || sending) return;

        if (!activeSessionId) {
            const session = await createSession();
            if (!session) return;
            await submitMessage(session.id, trimmed);
            return;
        }

        await submitMessage(activeSessionId, trimmed);
    };

    const handleNewChat = async () => {
        await createSession();
        setSidebarOpen(false);
    };

    const showSuggestions =
        messages.length === 0 && !sending;

    return (
        <div className="wa-assistant-page">
            <div className="wa-card wa-chat-layout d-flex overflow-hidden">
                <ConversationList
                    sessions={sessions}
                    activeSessionId={activeSessionId}
                    onSelect={async (id) => {
                        setActiveSessionId(id);
                        await loadMessages(id);
                        setSidebarOpen(false);
                    }}
                    onCreate={handleNewChat}
                    onDelete={deleteSession}
                    show={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />

                <div className="wa-chat-main flex-grow-1">
                    <div className="wa-chat-header">
                        <Button
                            variant="outline-secondary"
                            size="sm"
                            className="d-lg-none flex-shrink-0"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open conversations"
                        >
                            <FiMenu size={16} />
                        </Button>

                        <div className="wa-chat-header-icon d-none d-sm-flex">
                            <FiMessageSquare size={16} />
                        </div>

                        <div className="min-w-0">
                            <div className="wa-chat-header-title">
                                {activeSession?.title ?? "Assistant"}
                            </div>
                            <div className="wa-chat-header-sub">
                                Workspace AI · Gmail, Calendar, Tasks &amp; Knowledge
                            </div>
                        </div>
                    </div>

                    <div className="wa-messages" ref={messagesRef}>
                        <div className="wa-messages-inner">
                            {error && (
                                <ErrorAlert
                                    message={error}
                                    onRetry={() => setError(null)}
                                    className="mb-3"
                                />
                            )}

                            {showSuggestions ? (
                                <div className="wa-chat-empty">
                                    <div className="wa-chat-empty-icon">
                                        <FiMessageSquare />
                                    </div>
                                    <h2 className="wa-chat-empty-title">
                                        How can I help you today?
                                    </h2>
                                    <p className="wa-chat-empty-desc">
                                        Ask about emails, calendar, tasks or uploaded documents.
                                    </p>
                                    <SuggestedPrompts onSelect={sendMessage} />
                                </div>
                            ) : (
                                <>
                                    {messages.map((message) => (
                                        <ChatMessage
                                            key={message.id}
                                            message={message}
                                        />
                                    ))}

                                    {sending && <TypingIndicator />}
                                </>
                            )}
                        </div>
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
