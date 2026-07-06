import { useEffect, useMemo, useState } from 'react';
import { Row, Col, Form, Badge, Button } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';
import gmailApi from '../services/gmail.api';
import EmailListItem from '../components/gmail/EmailListItem';
import EmailPreview from '../components/gmail/EmailPreview';
import ConnectGoogleScreen from '../components/common/ConnectGoogleScreen';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorAlert from '../components/common/ErrorAlert';
import EmptyState from '../components/common/EmptyState';
import { getErrorMessage } from '../utils/helpers';
import { isGoogleNotConnectedError } from '../utils/auth';
import { useAuth } from '../context/AuthContext';

export default function Gmail() {
  const { setGoogleConnectionStatus } = useAuth();
  const [inbox, setInbox] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notConnected, setNotConnected] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);

  const fetchInbox = async () => {
    setLoading(true);
    setError(null);
    setNotConnected(false);
    try {
      const { data } = await gmailApi.getInbox();
      setInbox(data);
      setSelectedEmail(data.emails?.[0] || null);
      setGoogleConnectionStatus(true);
    } catch (err) {
      if (isGoogleNotConnectedError(err)) {
        setNotConnected(true);
        setGoogleConnectionStatus(false);
      } else {
        setError(getErrorMessage(err, 'Failed to load inbox'));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const filteredEmails = useMemo(() => {
    let emails = inbox?.emails || [];

    if (filter === 'unread') {
      emails = emails.filter((email) => email.unread);
    } else if (filter === 'important') {
      emails = emails.filter((email) => email.important || email.priority >= 80);
    } else if (filter === 'attachments') {
      emails = emails.filter((email) => email.hasAttachment);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      emails = emails.filter((email) =>
        [email.subject, email.from, email.sender, email.snippet, email.category]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query)
      );
    }

    return emails;
  }, [inbox, search, filter]);

  const handleSummarize = async () => {
    setSummaryLoading(true);
    try {
      const { data } = await gmailApi.summarize();
      setSummary(data.summary || 'No summary available.');
    } catch (err) {
      setSummary(getErrorMessage(err, 'Failed to generate summary'));
    } finally {
      setSummaryLoading(false);
    }
  };

  if (notConnected) {
    return (
      <div>
        <div className="mb-4">
          <h2 className="h4 fw-semibold mb-1">Gmail Inbox</h2>
          <p className="text-muted mb-0">Smart inbox with AI summaries and priority insights</p>
        </div>
        <ConnectGoogleScreen service="gmail" />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2 className="h4 fw-semibold mb-1">Gmail Inbox</h2>
          <p className="text-muted mb-0">Smart inbox with AI summaries and priority insights</p>
        </div>
        {inbox?.stats && (
          <div className="d-flex flex-wrap gap-2">
            <Badge bg="primary">{inbox.stats.unread} unread</Badge>
            <Badge bg="warning" text="dark">{inbox.stats.urgent || 0} urgent</Badge>
            <Badge bg="secondary">{inbox.stats.total} total</Badge>
          </div>
        )}
      </div>

      <ErrorAlert message={error} onRetry={fetchInbox} className="mb-4" />

      <div className="wa-card overflow-hidden">
        <div className="p-3 border-bottom">
          <Row className="g-3 align-items-center">
            <Col md={6}>
              <div className="position-relative">
                <FiSearch className="position-absolute top-50 translate-middle-y ms-3 text-muted" />
                <Form.Control
                  className="ps-5"
                  placeholder="Search emails..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All' },
                  { key: 'unread', label: 'Unread' },
                  { key: 'important', label: 'Important' },
                  { key: 'attachments', label: 'Attachments' },
                ].map((item) => (
                  <Button
                    key={item.key}
                    size="sm"
                    variant={filter === item.key ? 'primary' : 'outline-secondary'}
                    onClick={() => setFilter(item.key)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </Col>
          </Row>
        </div>

        <Row className="g-0">
          <Col lg={5} className="border-end" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {loading ? (
              <div className="p-3">
                <LoadingSpinner centered message="Loading inbox..." />
              </div>
            ) : filteredEmails.length === 0 ? (
              <EmptyState title="No emails found" description="Try adjusting your search or filters." />
            ) : (
              filteredEmails.map((email) => (
                <EmailListItem
                  key={email.id}
                  email={email}
                  active={selectedEmail?.id === email.id}
                  onClick={() => {
                    setSelectedEmail(email);
                    setSummary('');
                  }}
                />
              ))
            )}
          </Col>
          <Col lg={7} style={{ minHeight: '70vh' }}>
            <EmailPreview
              email={selectedEmail}
              summary={summary}
              summaryLoading={summaryLoading}
              onSummarize={handleSummarize}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}
