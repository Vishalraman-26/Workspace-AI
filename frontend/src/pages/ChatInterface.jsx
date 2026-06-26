
import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';

const CONVERSATIONS_KEY = 'inboxintel_conversations';
const ACTIVE_CONVERSATION_KEY = 'inboxintel_active_conversation';

export default function ChatInterface() {
  // Conversations state
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = localStorage.getItem(CONVERSATIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load conversations:", e);
    }
    return [];
  });

  const [activeConversationId, setActiveConversationId] = useState(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_CONVERSATION_KEY);
      const savedConversations = localStorage.getItem(CONVERSATIONS_KEY);
      if (saved && savedConversations) {
        const parsedSaved = JSON.parse(savedConversations);
        if (Array.isArray(parsedSaved) && parsedSaved.some(c => c.id === saved)) {
          return saved;
        }
      }
    } catch (e) {
      console.error('Failed to parse saved conversations');
    }
    return null;
  });

  // Current conversation messages
  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const messages = activeConversation?.messages || [];
  
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(null);
  const { fetchAllData } = useAppContext();
  const chatEndRef = useRef(null);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem(ACTIVE_CONVERSATION_KEY, activeConversationId);
    } else {
      localStorage.removeItem(ACTIVE_CONVERSATION_KEY);
    }
  }, [activeConversationId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversationId, messages]);

  // Helper: Create new conversation
  const createNewConversation = () => {
    const newId = Date.now().toString();
    const newConversation = {
      id: newId,
      title: 'New Conversation',
      messages: [{
        id: Date.now(),
        sender: 'ai',
        text: 'Hi there! I\'m your InboxIntel AI Assistant. How can I help you today? You can ask me about your emails, schedule meetings, or manage your tasks.'
      }],
      createdAt: new Date().toISOString()
    };

    setConversations(prev => {
      // Check for duplicates just in case
      const exists = prev.some(c => c.id === newId);
      if (!exists) {
        return [newConversation, ...prev];
      }
      return prev;
    });

    setActiveConversationId(newId);
    setPendingApproval(null);
    setInputValue('');
  };

  // Initialize conversations if empty
  useEffect(() => {
    if (conversations.length === 0 && !activeConversationId) {
      createNewConversation();
    } else if (activeConversationId && !conversations.some(c => c.id === activeConversationId)) {
      // If active conversation is not found, switch to first
      if (conversations.length > 0) {
        setActiveConversationId(conversations[0].id);
      } else {
        createNewConversation();
      }
    }
  }, [conversations, activeConversationId]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing || !activeConversationId) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputValue.trim()
    };

    // Update conversation optimistically
    let currentMsgs = [];
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id === activeConversationId) {
          currentMsgs = [...conv.messages, userMsg];
          return { 
            ...conv, 
            messages: currentMsgs, 
            title: conv.title === 'New Conversation' ? userMsg.text.slice(0, 30) : conv.title 
          };
        }
        return conv;
      });
      return updated;
    });

    setInputValue('');
    setIsProcessing(true);
    setPendingApproval(null);

    try {
      const response = await api.chat(currentMsgs);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.text,
        ...response
      };

      setConversations(prev => prev.map(conv =>
        conv.id === activeConversationId
          ? { ...conv, messages: [...conv.messages, aiMsg] }
          : conv
      ));

      if (response.pendingApproval) {
        setPendingApproval(response.approvalId);
      }

      if (response.refreshRequired) {
        await fetchAllData();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'Sorry, I encountered an error. Please try again.'
      };

      setConversations(prev => prev.map(conv =>
        conv.id === activeConversationId
          ? { ...conv, messages: [...conv.messages, errorMsg] }
          : conv
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  // Approve/Reject
  const handleApprove = async () => {
    if (!pendingApproval || !activeConversationId) return;
    try {
      const response = await api.approve(pendingApproval);
      const aiMsg = {
        id: Date.now(),
        sender: 'ai',
        text: 'Action approved and executed successfully!'
      };

      setConversations(prev => prev.map(conv =>
        conv.id === activeConversationId
          ? { ...conv, messages: [...conv.messages, aiMsg] }
          : conv
      ));

      setPendingApproval(null);
      await fetchAllData();
    } catch (err) {
      console.error('Failed to approve:', err);
    }
  };

  const handleReject = async () => {
    if (!pendingApproval || !activeConversationId) return;
    try {
      await api.reject(pendingApproval);
      const aiMsg = {
        id: Date.now(),
        sender: 'ai',
        text: 'Action rejected.'
      };

      setConversations(prev => prev.map(conv =>
        conv.id === activeConversationId
          ? { ...conv, messages: [...conv.messages, aiMsg] }
          : conv
      ));

      setPendingApproval(null);
      await fetchAllData();
    } catch (err) {
      console.error('Failed to reject:', err);
    }
  };

  // Delete conversation
  const deleteConversation = (convId, e) => {
    e.stopPropagation();
    setConversations(prev => {
      const newConversations = prev.filter(c => c.id !== convId);
      if (activeConversationId === convId) {
        if (newConversations.length > 0) {
          setActiveConversationId(newConversations[0].id);
        } else {
          setActiveConversationId(null);
        }
      }
      return newConversations;
    });
  };

  return (
    <div className="d-flex h-100 overflow-hidden">
      {/* Internal Conversations Sidebar */}
      <div className="d-flex flex-column bg-light border-end" style={{ width: '240px' }}>
        <div className="p-3 border-bottom">
          <button 
            onClick={createNewConversation} 
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <i className="bi bi-plus-lg"></i> New Chat
          </button>
        </div>

        <div className="flex-grow-1 overflow-auto p-2">
          {conversations.map(conv => (
            <div
              key={conv.id}
              onClick={() => {
                setActiveConversationId(conv.id);
                setPendingApproval(null);
              }}
              className={`d-flex align-items-center justify-content-between p-2 rounded-3 mb-1 cursor-pointer ${conv.id === activeConversationId ? 'bg-white shadow-sm' : 'hover:bg-white'}`}
            >
              <div className="overflow-hidden text-truncate me-2" style={{ maxWidth: '170px' }}>
                <i className="bi bi-chat me-2 text-secondary"></i>
                {conv.title}
              </div>
              <button
                onClick={(e) => deleteConversation(conv.id, e)}
                className="btn btn-link text-secondary text-decoration-none p-0"
                style={{ fontSize: '0.85rem' }}
              >
                <i className="bi bi-trash"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Main: Chat Area */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Chat Header */}
        <div className="bg-white border-bottom shadow-sm px-4 py-3">
          <h2 className="h4 mb-0 d-flex align-items-center gap-2">
            <i className="bi bi-lightning-charge-fill text-primary"></i>
            InboxIntel AI Assistant
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-grow-1 overflow-auto p-4">
          <div className="container" style={{ maxWidth: '850px' }}>
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`d-flex mb-4 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
              >
                <div className="d-flex align-items-start gap-3">
                  {msg.sender === 'ai' && (
                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white" style={{ width: '36px', height: '36px', flexShrink: 0 }}>
                      <i className="bi bi-robot"></i>
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-3 ${msg.sender === 'user'
                      ? 'bg-primary text-white rounded-end-0'
                      : 'bg-white border shadow-sm rounded-start-0'
                    }`}
                    style={{ maxWidth: '70%' }}
                  >
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                  </div>
                  {msg.sender === 'user' && (
                    <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: '36px', height: '36px', flexShrink: 0 }}>
                      <i className="bi bi-person"></i>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Pending Approval */}
            {pendingApproval && (
              <div className="bg-warning bg-opacity-10 border border-warning rounded-3 p-4 mb-3 mx-auto" style={{ maxWidth: '750px' }}>
                <h5 className="h6 mb-3 text-warning-emphasis">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Needs Your Approval
                </h5>
                <p className="mb-3">The AI assistant wants to perform the following action:</p>
                <div className="d-flex gap-2">
                  <button onClick={handleApprove} className="btn btn-success">
                    <i className="bi bi-check-lg me-2"></i> Approve
                  </button>
                  <button onClick={handleReject} className="btn btn-danger">
                    <i className="bi bi-x-lg me-2"></i> Reject
                  </button>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-top shadow-sm p-4">
          <form onSubmit={handleSendMessage} className="container" style={{ maxWidth: '850px' }}>
            <div className="input-group">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isProcessing}
              />
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={!inputValue.trim() || isProcessing}
              >
                {isProcessing ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <i className="bi bi-send"></i>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
