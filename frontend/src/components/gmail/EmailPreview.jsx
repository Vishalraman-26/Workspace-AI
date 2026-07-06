import { Badge, Button } from 'react-bootstrap';
import { FiPaperclip, FiRefreshCw } from 'react-icons/fi';
import { formatDateTime } from '../../utils/date';
import PriorityBadge from '../common/PriorityBadge';
import LoadingSpinner from '../common/LoadingSpinner';

export default function EmailPreview({ email, summary, summaryLoading, onSummarize }) {
  if (!email) {
    return (
      <div className="wa-empty-state h-100 d-flex flex-column justify-content-center">
        <p>Select an email to preview</p>
      </div>
    );
  }

  return (
    <div className="p-4 h-100 overflow-auto">
      <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
        <div>
          <h4 className="mb-2">{email.subject}</h4>
          <div className="text-muted small">
            From: {email.from || email.sender}
          </div>
          <div className="text-muted small">{formatDateTime(email.date)}</div>
        </div>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={onSummarize}
          disabled={summaryLoading}
          className="d-flex align-items-center gap-2 flex-shrink-0"
        >
          {summaryLoading ? <LoadingSpinner size="sm" message="" /> : <FiRefreshCw />}
          AI Summary
        </Button>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {email.unread && <Badge bg="primary">Unread</Badge>}
        {email.category && <Badge bg="info">{email.category}</Badge>}
        <PriorityBadge priority={email.priority} />
        {email.actionRequired && <Badge bg="warning" text="dark">Action Required</Badge>}
        {email.hasAttachment && (
          <Badge bg="secondary" className="d-inline-flex align-items-center gap-1">
            <FiPaperclip size={12} />
            Has attachment
          </Badge>
        )}
      </div>

      {summary && (
        <div className="wa-card p-3 mb-4 border-primary border-opacity-25">
          <div className="small text-primary fw-semibold mb-2">AI Summary</div>
          <p className="mb-0">{summary}</p>
        </div>
      )}

      <div className="wa-card p-3">
        <p className="mb-0">{email.snippet}</p>
      </div>

      {email.attachments?.length > 0 && (
        <div className="mt-4">
          <h6 className="mb-2">Attachments</h6>
          <div className="d-flex flex-wrap gap-2">
            {email.attachments.map((attachment) => (
              <Badge key={attachment.id} bg="light" text="dark" className="border py-2 px-3">
                {attachment.filename}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
