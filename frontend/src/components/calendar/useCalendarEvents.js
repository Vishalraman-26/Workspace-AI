import { useCallback, useEffect, useState } from 'react';
import calendarApi from '../../services/calendar.api';
import { extractCalendarEvents } from './eventUtils';
import { getErrorMessage } from '../../utils/helpers';
import { isGoogleNotConnectedError } from '../../utils/auth';
import { useAuth } from '../../context/AuthContext';

export default function useCalendarEvents() {
  const { setGoogleConnectionStatus } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notConnected, setNotConnected] = useState(false);

  const fetchEvents = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setLoading(true);
    }
    setError(null);
    setNotConnected(false);

    try {
      const { data } = await calendarApi.getEvents();

      if (data?.success === false) {
        throw new Error(data.message || 'Failed to load calendar events');
      }

      const parsedEvents = extractCalendarEvents(data);
      setEvents(parsedEvents);
      setGoogleConnectionStatus(true);
    } catch (err) {
      if (isGoogleNotConnectedError(err)) {
        setEvents([]);
        setNotConnected(true);
        setGoogleConnectionStatus(false);
      } else {
        setEvents([]);
        setError(getErrorMessage(err, 'Failed to load calendar events'));
      }
    } finally {
      setLoading(false);
    }
  }, [setGoogleConnectionStatus]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    notConnected,
    fetchEvents,
    refetch: () => fetchEvents({ silent: true }),
  };
}
