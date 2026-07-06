import { Form, Button, InputGroup } from 'react-bootstrap';
import { FiSend } from 'react-icons/fi';

export default function ChatInput({ value, onChange, onSubmit, disabled, placeholder }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3 border-top bg-body">
      <InputGroup>
        <Form.Control
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || 'Ask Workspace AI anything...'}
          disabled={disabled}
        />
        <Button type="submit" variant="primary" disabled={disabled || !value.trim()}>
          <FiSend />
        </Button>
      </InputGroup>
    </Form>
  );
}
