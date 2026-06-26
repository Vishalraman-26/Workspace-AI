
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { api } from '../services/api';

export default function InspectionInbox() {
  const { emails, fetchAllData } = useAppContext();
  const [selectedEmail, setSelectedEmail] = useState(null);

  const handleSelectEmail = async (email) => {
    setSelectedEmail(email);
    if (email.unread) {
      try {
        await api.markEmailRead(email.id);
        await fetchAllData();
      } catch (err) {
        console.error("Failed to mark email as read:", err);
      }
    }
  };

  return (
    <div className="d-flex h-100 bg-white overflow-hidden">
      {/* Email List Pane */}
      <div className={`col-12 col-md-5 col-lg-4 border-end d-flex flex-column h-100 ${selectedEmail ? 'd-none d-md-flex' : 'd-flex'}`}>
        <div className="p-3 border-bottom bg-light">
          <h2 className="h5 fw-bold mb-1">Inbox</h2>
          <p className="text-muted small mb-0">{emails.length} messages</p>
        </div>
        <div className="flex-grow-1 overflow-auto">
          <div className="list-group list-group-flush">
            {emails.length > 0 ? (
              emails.map(email => (
                <button
                  key={email.id}
                  onClick={() => handleSelectEmail(email)}
                  className={`list-group-item list-group-item-action border-0 border-bottom p-3 ${selectedEmail?.id === email.id ? 'bg-primary bg-opacity-10' : ''}`}
                >
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className={`small fw-bold ${email.unread ? 'text-dark' : 'text-secondary'}`}>
                      {email.sender}
                    </span>
                    <span className="text-muted extra-small" style={{ fontSize: '0.7rem' }}>
                      {new Date(email.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className={`small text-truncate ${email.unread ? 'fw-bold text-dark' : 'text-secondary'}`}>
                    {email.subject}
                  </div>
                  <div className="text-muted small text-truncate" style={{ fontSize: '0.8rem' }}>
                    {email.body}
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-muted">No messages</div>
            )}
          </div>
        </div>
      </div>

      {/* Email Content Pane */}
      <div className={`col-12 col-md-7 col-lg-8 d-flex flex-column h-100 bg-white ${!selectedEmail ? 'd-none d-md-flex' : 'd-flex'}`}>
        {selectedEmail ? (
          <div className="d-flex flex-column h-100">
            <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
              <button 
                className="btn btn-sm btn-outline-secondary d-md-none me-2" 
                onClick={() => setSelectedEmail(null)}
              >
                <i className="bi bi-arrow-left"></i>
              </button>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-light border"><i className="bi bi-archive text-secondary"></i></button>
                <button className="btn btn-sm btn-light border"><i className="bi bi-trash text-secondary"></i></button>
                <button className="btn btn-sm btn-light border"><i className="bi bi-envelope-open text-secondary"></i></button>
              </div>
              <div className="text-muted small">
                {emails.indexOf(selectedEmail) + 1} of {emails.length}
              </div>
            </div>

            <div className="flex-grow-1 overflow-auto p-4">
              <h1 className="h4 fw-bold mb-4">{selectedEmail.subject}</h1>
              
              <div className="d-flex align-items-center mb-4">
                <div className="bg-secondary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '48px', height: '48px' }}>
                  <i className="bi bi-person fs-4 text-secondary"></i>
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">{selectedEmail.sender}</span>
                    <span className="text-muted small">
                      {new Date(selectedEmail.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                  <div className="text-muted small">to me</div>
                </div>
              </div>

              <div className="mt-4 text-dark" style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {selectedEmail.body}
              </div>
              
              <hr className="my-5" />
              
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
            <i className="bi bi-envelope fs-1 mb-3 opacity-25"></i>
            <p>Select an email to read its content</p>
          </div>
        )}
      </div>
    </div>
  );
}
