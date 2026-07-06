import { Alert } from 'react-bootstrap';
import { FiAlertCircle } from 'react-icons/fi';

export default function ErrorAlert({ message, onRetry, className = '' }) {
  if (!message) return null;

  return (
    <Alert variant="danger" className={`d-flex align-items-start gap-2 ${className}`}>
      <FiAlertCircle className="mt-1 flex-shrink-0" />
      <div className="flex-grow-1">
        <div>{message}</div>
        {onRetry && (
          <button type="button" className="btn btn-link btn-sm p-0 mt-2 text-danger" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    </Alert>
  );
}
