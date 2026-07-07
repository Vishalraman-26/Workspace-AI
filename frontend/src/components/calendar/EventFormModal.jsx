import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import dayjs from '../../utils/date';

const defaultForm = {
  title: '',
  description: '',
  location: '',
  start: '',
  end: '',
  attendees: '',
  meetLink: false,
};

export default function EventFormModal({ show, onHide, onSubmit, initialData, loading, mode = 'create' }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        location: initialData.location || '',
        start: initialData.start ? dayjs(initialData.start).format('YYYY-MM-DDTHH:mm') : '',
        end: initialData.end ? dayjs(initialData.end).format('YYYY-MM-DDTHH:mm') : '',
        attendees: (initialData.attendees || []).map((a) => a.email || a).join(', '),
        meetLink: Boolean(initialData.meetLink),
        newTitle: '',
      });
    } else {
      setForm(defaultForm);
    }
  }, [initialData, show]);

  const handleChange = (field) => (event) => {
    const value = field === 'meetLink' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      location: form.location,
      start: new Date(form.start).toISOString(),
      end: new Date(form.end).toISOString(),
      attendees: form.attendees
        ? form.attendees.split(',').map((email) => email.trim()).filter(Boolean)
        : [],
      meetLink: form.meetLink,
    };

    if (mode === 'edit') {
      payload.newTitle = form.newTitle || form.title;
    }

    onSubmit(payload);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="wa-modal-premium">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{mode === 'edit' ? 'Update Meeting' : 'Create Meeting'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={mode === 'edit' ? 6 : 12}>
              <Form.Group>
                <Form.Label>Title</Form.Label>
                <Form.Control value={form.title} onChange={handleChange('title')} required />
              </Form.Group>
            </Col>
            {mode === 'edit' && (
              <Col md={6}>
                <Form.Group>
                  <Form.Label>New Title (optional)</Form.Label>
                  <Form.Control value={form.newTitle} onChange={handleChange('newTitle')} />
                </Form.Group>
              </Col>
            )}
            <Col md={12}>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} value={form.description} onChange={handleChange('description')} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Start</Form.Label>
                <Form.Control type="datetime-local" value={form.start} onChange={handleChange('start')} required />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>End</Form.Label>
                <Form.Control type="datetime-local" value={form.end} onChange={handleChange('end')} required />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Location</Form.Label>
                <Form.Control value={form.location} onChange={handleChange('location')} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Attendees (comma-separated emails)</Form.Label>
                <Form.Control value={form.attendees} onChange={handleChange('attendees')} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Check
                type="checkbox"
                label="Add Google Meet link"
                checked={form.meetLink}
                onChange={handleChange('meetLink')}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
