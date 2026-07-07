import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import dayjs from '../../utils/date';

const defaultForm = {
  title: '',
  description: '',
  priority: 'medium',
  due_date: '',
};

export default function TaskFormModal({ show, onHide, onSubmit, initialData, loading }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        priority: initialData.priority || 'medium',
        due_date: initialData.due_date ? dayjs(initialData.due_date).format('YYYY-MM-DD') : '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData, show]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      due_date: form.due_date || null,
    });
  };

  return (
    <Modal show={show} onHide={onHide} centered className="wa-modal-premium">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{initialData ? 'Edit Task' : 'Create Task'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control value={form.title} onChange={handleChange('title')} required />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} value={form.description} onChange={handleChange('description')} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Priority</Form.Label>
                <Form.Select value={form.priority} onChange={handleChange('priority')}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Due Date</Form.Label>
                <Form.Control type="date" value={form.due_date} onChange={handleChange('due_date')} />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Task'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
