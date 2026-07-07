import { Button } from 'react-bootstrap';
import {
  FiCalendar,
  FiPlus,
  FiRefreshCw,
} from 'react-icons/fi';
import { formatTime } from '../../utils/date';
import {
  getEventColor,
  getEventStart,
  getNextWeekEvents,
  getTodayEvents,
  getTomorrowEvents,
} from './eventUtils';

function ScheduleList({ items, onEventClick }) {
  if (items.length === 0) {
    return (
      <p className="small text-muted mb-0">No events scheduled.</p>
    );
  }

  return (
    <div className="d-flex flex-column gap-1">
      {items.map((event) => {
        const colors = getEventColor(event);
        return (
          <div
            key={event.id || event.title}
            className="wa-schedule-item"
            onClick={() => onEventClick?.(event)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onEventClick?.(event)}
          >
            <span className="wa-schedule-time">{formatTime(getEventStart(event))}</span>
            <span
              className="wa-schedule-dot"
              style={{ backgroundColor: colors.bg }}
            />
            <span className="small fw-medium text-truncate">{event.title}</span>
          </div>
        );
      })}
    </div>
  );
}

function UpcomingGroup({ title, events, onEventClick }) {
  if (events.length === 0) return null;

  return (
    <div>
      <div className="wa-upcoming-group-title">{title}</div>
      <ScheduleList items={events.slice(0, 4)} onEventClick={onEventClick} />
    </div>
  );
}

export default function CalendarSidebar({
  events,
  onCreateEvent,
  onRefresh,
  onGoToToday,
  onEventClick,
  refreshing = false,
}) {
  const todayEvents = getTodayEvents(events);
  const tomorrowEvents = getTomorrowEvents(events);
  const nextWeekEvents = getNextWeekEvents(events);

  return (
    <aside className="wa-calendar-sidebar-panel wa-fade-in">
      <div className="wa-sidebar-section">
        <div className="wa-sidebar-section-title">Today&apos;s Schedule</div>
        {todayEvents.length === 0 ? (
          <p className="small text-muted mb-0">Your schedule is clear for today.</p>
        ) : (
          <ScheduleList items={todayEvents} onEventClick={onEventClick} />
        )}
      </div>

      <div className="wa-sidebar-section">
        <div className="wa-sidebar-section-title">Upcoming</div>
        {tomorrowEvents.length === 0 && nextWeekEvents.length === 0 ? (
          <p className="small text-muted mb-0">Nothing upcoming this week.</p>
        ) : (
          <>
            <UpcomingGroup
              title="Tomorrow"
              events={tomorrowEvents}
              onEventClick={onEventClick}
            />
            <UpcomingGroup
              title="Next Week"
              events={nextWeekEvents}
              onEventClick={onEventClick}
            />
          </>
        )}
      </div>

      <div className="wa-sidebar-section">
        <div className="wa-sidebar-section-title">Quick Actions</div>
        <div className="d-grid gap-2">
          <Button
            variant="primary"
            className="wa-quick-action-btn d-flex align-items-center justify-content-center gap-2"
            onClick={onCreateEvent}
          >
            <FiPlus size={16} />
            Create Event
          </Button>
          <Button
            variant="outline-secondary"
            className="wa-quick-action-btn d-flex align-items-center justify-content-center gap-2"
            onClick={onRefresh}
            disabled={refreshing}
          >
            <FiRefreshCw size={16} className={refreshing ? 'spin' : ''} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button
            variant="outline-primary"
            className="wa-quick-action-btn d-flex align-items-center justify-content-center gap-2"
            onClick={onGoToToday}
          >
            <FiCalendar size={16} />
            Today
          </Button>
        </div>
      </div>
    </aside>
  );
}
