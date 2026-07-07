import { useCallback, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { formatTime } from '../../utils/date';
import { EVENT_COLORS, toFullCalendarEvents } from './eventUtils';

function EventTooltip({ event, position }) {
  if (!event) return null;
  const raw = event.extendedProps?.rawEvent || {};
  const timeLabel = raw.start
    ? `${formatTime(raw.start)}${raw.end ? ` – ${formatTime(raw.end)}` : ''}`
    : '';

  return (
    <div
      className="wa-event-tooltip"
      style={{ left: position.x + 12, top: position.y + 12 }}
    >
      <div className="wa-event-tooltip-title">{event.title}</div>
      {timeLabel && <div className="wa-event-tooltip-meta mb-1">{timeLabel}</div>}
      {raw.description && (
        <div className="wa-event-tooltip-meta text-truncate">{raw.description}</div>
      )}
    </div>
  );
}

const LEGEND_ITEMS = ['interview', 'meeting', 'deadline', 'reminder', 'birthday'];

const CalendarView = ({ events, onEventClick, calendarRef }) => {
  const internalRef = useRef(null);
  const ref = calendarRef || internalRef;
  const [tooltip, setTooltip] = useState({ event: null, position: { x: 0, y: 0 } });

  const fcEvents = useMemo(() => toFullCalendarEvents(events), [events]);

  const handleEventMouseEnter = useCallback((info) => {
    setTooltip({
      event: info.event,
      position: { x: info.jsEvent.clientX, y: info.jsEvent.clientY },
    });
  }, []);

  const handleEventMouseLeave = useCallback(() => {
    setTooltip({ event: null, position: { x: 0, y: 0 } });
  }, []);

  const handleEventClick = useCallback(
    (info) => {
      setTooltip({ event: null, position: { x: 0, y: 0 } });
      onEventClick?.(info.event.extendedProps.rawEvent);
    },
    [onEventClick]
  );

  return (
    <div className="wa-calendar-shell wa-fade-in">
      <FullCalendar
        ref={ref}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        events={fcEvents}
        height="auto"
        contentHeight={560}
        nowIndicator
        editable={false}
        selectable={false}
        dayMaxEvents={3}
        eventClick={handleEventClick}
        eventMouseEnter={handleEventMouseEnter}
        eventMouseLeave={handleEventMouseLeave}
        className="wa-fc"
      />

      <div className="wa-event-legend">
        {LEGEND_ITEMS.map((key) => (
          <span key={key} className="wa-event-legend-item">
            <span
              className="wa-event-legend-swatch"
              style={{ backgroundColor: EVENT_COLORS[key].bg }}
            />
            {EVENT_COLORS[key].label}
          </span>
        ))}
      </div>

      <EventTooltip event={tooltip.event} position={tooltip.position} />
    </div>
  );
};

export default CalendarView;
