import React, { useState, useEffect } from 'react';

export default function ApprovalCenter({ fetchDashboardData }) {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/agent/approvals');
      const data = await res.json();
      setApprovals(data);
    } catch (err) {
      console.error("Failed to fetch approvals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/agent/approvals/${id}/approve`, {
        method: 'POST'
      });
      const data = await res.json();
      if (data.refreshRequired) {
        fetchDashboardData();
      }
      fetchApprovals();
    } catch (err) {
      console.error("Failed to approve:", err);
    }
  };

  const handleReject = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/agent/approvals/${id}/reject`, {
        method: 'POST'
      });
      fetchApprovals();
    } catch (err) {
      console.error("Failed to reject:", err);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  return (
    <div className="h-100 d-flex flex-column bg-light">
      <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white sticky-top">
        <h2 className="h6 mb-0 fw-bold text-secondary text-uppercase">
          <i className="bi bi-check-circle me-2"></i>Approval Center
        </h2>
        <button onClick={fetchApprovals} className="btn btn-sm btn-outline-secondary">
          <i className="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>

      <div className="p-3 flex-grow-1 overflow-auto">
        {loading ? (
          <div className="text-center py-5 text-muted">Loading approvals...</div>
        ) : approvals.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <i className="bi bi-check2-circle fs-1 mb-3 d-block"></i>
            No pending approvals
          </div>
        ) : (
          <div className="row g-3">
            {approvals.map((approval) => (
              <div key={approval.id} className="col-12">
                <div className="card shadow-sm border-0">
                  <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-primary">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Pending Action
                    </span>
                    <span className="small text-muted">
                      {new Date(approval.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <div className="small text-muted mb-1">User Request:</div>
                      <div className="fw-bold">{approval.userMessage}</div>
                    </div>
                    <div className="mb-3">
                      <div className="small text-muted mb-1">Proposed Action:</div>
                      <pre className="bg-light p-2 rounded small">
                        {JSON.stringify(approval.toolCalls, null, 2)}
                      </pre>
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => handleApprove(approval.id)}
                        className="btn btn-success btn-sm flex-grow-1"
                      >
                        <i className="bi bi-check me-1"></i>Approve
                      </button>
                      <button
                        onClick={() => handleReject(approval.id)}
                        className="btn btn-danger btn-sm flex-grow-1"
                      >
                        <i className="bi bi-x me-1"></i>Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
