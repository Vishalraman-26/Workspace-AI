import { useEffect, useMemo, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';
import calendarApi from '../services/calendar.api';
import EventCard from '../components/calendar/EventCard';
import EventFormModal from '../components/calendar/EventFormModal';
import ConfirmModal from '../components/common/ConfirmModal';
import ConnectGoogleScreen from '../components/common/ConnectGoogleScreen';
import ErrorAlert from '../components/common/ErrorAlert';
import EmptyState from '../components/common/EmptyState';
import { SkeletonList } from '../components/common/SkeletonLoader';
import dayjs, { isToday } from '../utils/date';
import { getErrorMessage } from '../utils/helpers';
import { isGoogleNotConnectedError } from '../utils/auth';
import { useAuth } from '../context/AuthContext';

export default function Calendar() {
  const { setGoogleConnectionStatus } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notConnected, setNotConnected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    setNotConnected(false);
    try {
      const { data } = await calendarApi.getEvents();
      setEvents(data.events || []);
      setGoogleConnectionStatus(true);
    } catch (err) {
      if (isGoogleNotConnectedError(err)) {
        setNotConnected(true);
        setGoogleConnectionStatus(false);
      } else {
        setError(getErrorMessage(err, 'Failed to load calendar'));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const todayEvents = useMemo(
    () => events.filter((event) => isToday(event.start)).sort((a, b) => new Date(a.start) - new Date(b.start)),
    [events]
  );

  const upcomingEvents = useMemo(
    () =>
      events
        .filter((event) => dayjs(event.start).isAfter(dayjs(), 'day'))
        .sort((a, b) => new Date(a.start) - new Date(b.start)),
    [events]
  );

  const openCreateModal = () => {
    setSelectedEvent(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (modalMode === 'create') {
        await calendarApi.createEvent(payload);
      } else {
        await calendarApi.updateEvent(payload);
      }
      setModalOpen(false);
      await fetchEvents();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to save event'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await calendarApi.deleteEvent(deleteTarget.title);
      setDeleteTarget(null);
      await fetchEvents();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete event'));
    } finally {
      setDeleting(false);
    }
  };

  if (notConnected) {
    return (
      <div>
        <div className="mb-4">
          <h2 className="h4 fw-semibold mb-1">Calendar</h2>
          <p className="text-muted mb-0">Manage meetings and stay on top of your schedule</p>
        </div>
        <ConnectGoogleScreen service="calendar" />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2 className="h4 fw-semibold mb-1">Calendar</h2>
          <p className="text-muted mb-0">Manage meetings and stay on top of your schedule</p>
        </div>
        <Button variant="primary" className="d-flex align-items-center gap-2" onClick={openCreateModal}>
          <FiPlus />
          Create Meeting
        </Button>
      </div>

      <ErrorAlert message={error} onRetry={fetchEvents} className="mb-4" />

      {loading ? (
        <SkeletonList count={4} />
      ) : (
        <>
          <section className="mb-5">
            <h5 className="mb-3">Today's Meetings</h5>
            {todayEvents.length === 0 ? (
              <EmptyState title="No meetings today" description="Your schedule is clear for today." />
            ) : (
              <Row className="g-3">
                {todayEvents.map((event) => (
                  <Col md={6} xl={4} key={event.id}>
                    <EventCard event={event} onEdit={openEditModal} onDelete={setDeleteTarget} />
                  </Col>
                ))}
              </Row>
            )}
          </section>

          <section>
            <h5 className="mb-3">Upcoming Meetings</h5>
            {upcomingEvents.length === 0 ? (
              <EmptyState title="No upcoming meetings" description="Create a meeting to get started." />
            ) : (
              <Row className="g-3">
                {upcomingEvents.map((event) => (
                  <Col md={6} xl={4} key={event.id}>
                    <EventCard event={event} onEdit={openEditModal} onDelete={setDeleteTarget} />
                  </Col>
                ))}
              </Row>
            )}
          </section>
        </>
      )}

      <EventFormModal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedEvent}
        loading={saving}
        mode={modalMode}
      />

      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete Meeting"
        message={`Delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onHide={() => setDeleteTarget(null)}
      />
    </div>
  );
}
