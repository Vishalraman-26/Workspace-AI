import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import chatApi from "../services/chat.api";

let loadSessionsPromise = null;
let createSessionPromise = null;

const DEFAULT_CHAT_TITLE = "New Chat";
const LOCAL_TITLE_MAX_LENGTH = 38;

export function deriveLocalChatTitle(message) {
    const normalized = message.trim().replace(/\s+/g, " ");
    if (!normalized) return DEFAULT_CHAT_TITLE;
    if (normalized.length <= LOCAL_TITLE_MAX_LENGTH) return normalized;
    return `${normalized.slice(0, LOCAL_TITLE_MAX_LENGTH).trimEnd()}...`;
}

function resolveSessionTitle(backendTitle, existingTitle) {
    if (
        existingTitle &&
        existingTitle !== DEFAULT_CHAT_TITLE &&
        backendTitle === DEFAULT_CHAT_TITLE
    ) {
        return existingTitle;
    }
    return backendTitle;
}

function mapSession(session, existingMessages = [], existingTitle) {
    return {
        id: session.id,
        title: resolveSessionTitle(session.title, existingTitle),
        createdAt: session.created_at,
        updatedAt: session.updated_at,
        messages: existingMessages,
    };
}

export default function useChatSessions() {

    const [sessions, setSessions] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [sessionsLoaded, setSessionsLoaded] = useState(false);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    const loadSessions = useCallback(async () => {

        if (loadSessionsPromise) {
            return loadSessionsPromise;
        }

        loadSessionsPromise = (async () => {
            try {
                const { data } = await chatApi.getSessions();

                const sorted = [...data].sort(
                    (a, b) =>
                        new Date(b.updated_at).getTime() -
                        new Date(a.updated_at).getTime()
                );

                if (!mountedRef.current) return;

                setSessions((prev) => {
                    const mapped = sorted.map((session) => {
                        const existing = prev.find((s) => s.id === session.id);
                        return mapSession(
                            session,
                            existing?.messages ?? [],
                            existing?.title
                        );
                    });

                    setActiveSessionId((currentId) => {
                        if (currentId && mapped.some((s) => s.id === currentId)) {
                            return currentId;
                        }
                        return mapped[0]?.id ?? null;
                    });

                    return mapped;
                });
            } catch (error) {
                console.error(error);
            } finally {
                if (mountedRef.current) {
                    setSessionsLoaded(true);
                }
                loadSessionsPromise = null;
            }
        })();

        return loadSessionsPromise;
    }, []);

    useEffect(() => {
        loadSessions();
    }, [loadSessions]);

    const createSession = useCallback(async () => {

        if (createSessionPromise) {
            return createSessionPromise;
        }

        createSessionPromise = (async () => {
            try {
                const { data } = await chatApi.createSession();
                const session = mapSession(data);

                if (!mountedRef.current) return session;

                setSessions((prev) => [session, ...prev]);
                setActiveSessionId(session.id);

                return session;
            } finally {
                createSessionPromise = null;
            }
        })();

        return createSessionPromise;
    }, []);

    const deleteSession = useCallback(async (sessionId) => {

        await chatApi.deleteSession(sessionId);

        setSessions((prev) => {
            const next = prev.filter((s) => s.id !== sessionId);

            setActiveSessionId((currentId) => {
                if (currentId && currentId !== sessionId) {
                    return currentId;
                }
                return next[0]?.id ?? null;
            });

            return next;
        });
    }, []);

    const loadMessages = useCallback(async (sessionId) => {

        try {
            const { data } = await chatApi.getMessages(sessionId);

            if (!mountedRef.current) return;

            setSessions((prev) =>
                prev.map((session) =>
                    session.id === sessionId
                        ? { ...session, messages: data }
                        : session
                )
            );
        } catch (error) {
            console.error(error);
        }
    }, []);

    const updateSession = useCallback((sessionId, updater) => {

        setSessions((prev) =>
            prev.map((session) =>
                session.id === sessionId
                    ? typeof updater === "function"
                        ? updater(session)
                        : { ...session, ...updater }
                    : session
            )
        );
    }, []);

    const addMessage = useCallback((sessionId, message) => {

        updateSession(sessionId, (session) => ({
            ...session,
            messages: [...session.messages, message],
        }));
    }, [updateSession]);

    const renameFromFirstMessage = useCallback((sessionId, messageText) => {

        updateSession(sessionId, (session) => {
            if (session.title !== DEFAULT_CHAT_TITLE) {
                return session;
            }

            if (session.messages.length > 0) {
                return session;
            }

            return {
                ...session,
                title: deriveLocalChatTitle(messageText),
                updatedAt: new Date().toISOString(),
            };
        });
    }, [updateSession]);

    const activeSession = useMemo(
        () => sessions.find((s) => s.id === activeSessionId) ?? null,
        [sessions, activeSessionId]
    );

    return {
        sessions,
        activeSession,
        activeSessionId,
        sessionsLoaded,
        setActiveSessionId,
        createSession,
        deleteSession,
        loadMessages,
        addMessage,
        renameFromFirstMessage,
        reloadSessions: loadSessions,
    };
}
