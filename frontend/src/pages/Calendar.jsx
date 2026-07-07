import { useEffect, useRef, useState } from 'react';
import calendarApi from '../services/calendar.api';
import CalendarView from '../components/calendar/CalendarView';
import CalendarSidebar from '../components/calendar/CalendarSidebar';
import EventDetailModal from '../components/calendar/EventDetailModal';
import EventFormModal from '../components/calendar/EventFormModal';
import ConfirmModal from '../components/common/ConfirmModal';
import ConnectGoogleScreen from '../components/common/ConnectGoogleScreen';
import ErrorAlert from '../components/common/ErrorAlert';
import { SkeletonList } from '../components/common/SkeletonLoader';
import { extractCalendarEvents } from '../components/calendar/eventUtils';
import { getErrorMessage } from '../utils/helpers';
import { isGoogleNotConnectedError } from '../utils/auth';
import { useAuth } from '../context/AuthContext';
import '../styles/productivity.css';

export default function Calendar() {
  const { setGoogleConnectionStatus } = useAuth();
  const calendarRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [notConnected, setNotConnected] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEvents = async ({ silent = false } = {}) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    setNotConnected(false);
    try {
      const { data } = await calendarApi.getEvents();
      if (data?.success === false) {
        throw new Error(data.message || 'Failed to load calendar');
      }
      setEvents(extractCalendarEvents(data));
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
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openCreateModal = () => {
    setSelectedEvent(null);
    setFormMode('create');
    setDetailModalOpen(false);
    setFormModalOpen(true);
  };

  const openDetailModal = (event) => {
    setSelectedEvent(event);
    setDetailModalOpen(true);
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setFormMode('edit');
    setDetailModalOpen(false);
    setFormModalOpen(true);
  };

  const handleGoToToday = () => {
    const api = calendarRef.current?.getApi?.();
    api?.today();
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (formMode === 'create') {
        await calendarApi.createEvent(payload);
      } else {
        await calendarApi.updateEvent(payload);
      }
      setFormModalOpen(false);
      await fetchEvents();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to save event'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRequest = (event) => {
    setDetailModalOpen(false);
    setDeleteTarget(event);
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
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4 wa-fade-in">
        <div>
          <h2 className="h4 fw-semibold mb-1">Calendar</h2>
          <p className="text-muted mb-0">
            Plan your week with month, week, and day views
          </p>
        </div>
      </div>

      <ErrorAlert message={error} onRetry={fetchEvents} className="mb-4" />

      {loading ? (
        <div className="wa-calendar-layout">
          <div className="wa-calendar-main">
            <div className="wa-calendar-shell">
              <SkeletonList count={1} />
            </div>
          </div>
          <div className="wa-calendar-sidebar">
            <SkeletonList count={3} />
          </div>
        </div>
      ) : (
        <div className="wa-calendar-layout">
          <div className="wa-calendar-main">
            <CalendarView
              events={events}
              onEventClick={openDetailModal}
              calendarRef={calendarRef}
            />
          </div>
          <div className="wa-calendar-sidebar">
            <CalendarSidebar
              events={events}
              onCreateEvent={openCreateModal}
              onRefresh={() => fetchEvents({ silent: true })}
              onGoToToday={handleGoToToday}
              onEventClick={openDetailModal}
              refreshing={refreshing}
            />
          </div>
        </div>
      )}

      <EventDetailModal
        show={detailModalOpen}
        event={selectedEvent}
        onHide={() => setDetailModalOpen(false)}
        onEdit={openEditModal}
        onDelete={handleDeleteRequest}
      />

      <EventFormModal
        show={formModalOpen}
        onHide={() => setFormModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedEvent}
        loading={saving}
        mode={formMode}
      />

      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete Event"
        message={`Delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onHide={() => setDeleteTarget(null)}
      />
    </div>
  );
}
