import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'workspace_ai_sessions';

function loadSessions() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSessions(sessions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export default function useChatSessions() {
  const [sessions, setSessions] = useState(loadSessions);
  const [activeSessionId, setActiveSessionId] = useState(() => {
    const stored = loadSessions();
    return stored[0]?.id || null;
  });

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  const createSession = useCallback((title = 'New Chat') => {
    const session = {
      id: generateSessionId(),
      title,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setSessions((prev) => [session, ...prev]);
    setActiveSessionId(session.id);
    return session;
  }, []);

  const deleteSession = useCallback((sessionId) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== sessionId);
      setActiveSessionId((current) => {
        if (current !== sessionId) return current;
        return next[0]?.id || null;
      });
      return next;
    });
  }, []);

  const updateSession = useCallback((sessionId, updater) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;
        const updated =
          typeof updater === 'function' ? updater(session) : { ...session, ...updater };
        return { ...updated, updatedAt: new Date().toISOString() };
      })
    );
  }, []);

  const addMessage = useCallback((sessionId, message) => {
    updateSession(sessionId, (session) => ({
      ...session,
      messages: [...session.messages, message],
      title:
        session.messages.length === 0 && message.role === 'user'
          ? message.content.slice(0, 40)
          : session.title,
    }));
  }, [updateSession]);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  return {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession,
    updateSession,
    addMessage,
  };
}
