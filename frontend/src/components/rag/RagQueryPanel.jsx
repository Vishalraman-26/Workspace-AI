import { Form, Button } from 'react-bootstrap';
import { FiSend } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import LoadingSpinner from '../common/LoadingSpinner';

export default function RagQueryPanel({ question, onQuestionChange, onSubmit, loading, answer, sourceDocument }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!question.trim() || loading) return;
    onSubmit(question.trim());
  };

  return (
    <div className="d-flex flex-column gap-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Ask a question about your documents</Form.Label>
          <div className="d-flex gap-2">
            <Form.Control
              value={question}
              onChange={(e) => onQuestionChange(e.target.value)}
              placeholder="What does the document say about..."
              disabled={loading}
            />
            <Button type="submit" variant="primary" disabled={loading || !question.trim()}>
              {loading ? <LoadingSpinner size="sm" message="" /> : <FiSend />}
            </Button>
          </div>
        </Form.Group>
      </Form>

      {answer && (
        <div className="wa-card p-4">
          <h6 className="mb-3">Answer</h6>
          <ReactMarkdown>{answer}</ReactMarkdown>
          {sourceDocument && (
            <div className="mt-3 pt-3 border-top">
              <div className="small text-muted mb-1">Source document</div>
              <div className="fw-medium">{sourceDocument}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
