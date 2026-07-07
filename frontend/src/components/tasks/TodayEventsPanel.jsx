import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { FiCalendar, FiExternalLink } from 'react-icons/fi';
import EmptyState from '../common/EmptyState';
import { ConnectGoogleCard } from '../common/ConnectGoogleScreen';
import ErrorAlert from '../common/ErrorAlert';
import PriorityBadge from '../common/PriorityBadge';
import { SkeletonList } from '../common/SkeletonLoader';
import { formatTime } from '../../utils/date';
import { getEventStart, getTodayEvents } from '../calendar/eventUtils';

export default function TodayEventsPanel({
  events,
  loading,
  error,
  notConnected = false,
  onRetry,
}) {
  const todayEvents = getTodayEvents(events);

  const emptyDescription = (() => {
    if (events.length === 0) {
      return 'No upcoming calendar events were returned from your Google Calendar.';
    }
    return `You have ${events.length} upcoming event(s), but none are scheduled for today.`;
  })();

  return (
    <section className="wa-work-section wa-fade-in">
      <div className="wa-work-section-header">
        <div>
          <h3 className="wa-work-section-title">Today&apos;s Calendar Events</h3>
          <p className="text-muted small mb-0">Read-only view of your schedule</p>
        </div>
        <Link to="/calendar" className="text-decoration-none">
          <Button
            variant="outline-primary"
            size="sm"
            className="d-flex align-items-center gap-2"
          >
            <FiExternalLink size={14} />
            Open Calendar
          </Button>
        </Link>
      </div>

      {notConnected ? (
        <ConnectGoogleCard service="calendar" />
      ) : (
        <>
          {error && !loading && (
            <ErrorAlert message={error} onRetry={onRetry} className="mb-3" />
          )}

          {loading ? (
            <SkeletonList count={2} />
          ) : todayEvents.length === 0 ? (
            <EmptyState
              icon={FiCalendar}
              title="No events today"
              description={emptyDescription}
            />
          ) : (
            <div className="d-flex flex-column gap-2">
              {todayEvents.map((event) => (
                <div
                  key={event.id || `${event.title}-${getEventStart(event)}`}
                  className="wa-event-readonly-item"
                >
                  <span className="wa-event-readonly-time">
                    {formatTime(getEventStart(event))}
                  </span>
                  <div className="flex-grow-1 min-w-0">
                    <div className="fw-semibold text-truncate">{event.title}</div>
                  </div>
                  <PriorityBadge priority={event.priority} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
