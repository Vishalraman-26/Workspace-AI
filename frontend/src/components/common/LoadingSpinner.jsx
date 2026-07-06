import { Spinner } from 'react-bootstrap';

export default function LoadingSpinner({ size = 'sm', message = 'Loading...', centered = false }) {
  const content = (
    <div className={`d-flex align-items-center gap-2 ${centered ? 'justify-content-center' : ''}`}>
      <Spinner animation="border" size={size} role="status" variant="primary">
        <span className="visually-hidden">{message}</span>
      </Spinner>
      {message && <span className="text-muted small">{message}</span>}
    </div>
  );

  if (centered) {
    return <div className="d-flex justify-content-center align-items-center py-5">{content}</div>;
  }

  return content;
}
