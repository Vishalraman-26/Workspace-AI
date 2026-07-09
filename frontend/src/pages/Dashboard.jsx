import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import {
  FiMail,
  FiCalendar,
  FiCheckSquare,
  FiBookOpen,
  FiMessageSquare,
  FiUpload,
} from 'react-icons/fi';
import gmailApi from '../services/gmail.api';
import calendarApi from '../services/calendar.api';
import taskApi from '../services/task.api';
import { ConnectGoogleCard } from '../components/common/ConnectGoogleScreen';
import ErrorAlert from '../components/common/ErrorAlert';
import { SkeletonList } from '../components/common/SkeletonLoader';
import { formatRelative } from '../utils/date';
import { extractCalendarEvents, getTodayEvents } from '../components/calendar/eventUtils';
import { isGoogleNotConnectedError } from '../utils/auth';
import { useAuth } from '../context/AuthContext';
import ragApi from '../services/rag.api';
function StatCard({ icon: Icon, label, value, color, loading }) {
  return (
    <div className="wa-card wa-card-hover p-4 h-100">
      <div className="d-flex align-items-center gap-3">
        <div className={`wa-stat-icon bg-${color} bg-opacity-10 text-${color}`}>
          <Icon />
        </div>
        <div>
          <div className="text-muted small">{label}</div>
          <div className="h3 mb-0 fw-bold">
            {loading ? <span className="wa-skeleton d-inline-block" style={{ width: 48, height: 28 }} /> : value}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const { googleConnected, setGoogleConnectionStatus } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [googleNotConnected, setGoogleNotConnected] = useState(false);
  const [stats, setStats] = useState({
    unreadEmails: 0,
    todayMeetings: 0,
    pendingTasks: 0,
    documents: 0,
  });
  const [activity, setActivity] = useState([]);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    setGoogleNotConnected(false);

    try {
      const [docsRes, inboxRes, calendarRes, tasksRes] = await Promise.allSettled([
        ragApi.getDocuments(),
        gmailApi.getInbox(),
        calendarApi.getEvents(),
        taskApi.getTasks(),
      ]);

      let googleDisconnected = false;

      if (
        inboxRes.status === 'rejected' && isGoogleNotConnectedError(inboxRes.reason)
      ) {
        googleDisconnected = true;
      }

      if (
        calendarRes.status === 'rejected' && isGoogleNotConnectedError(calendarRes.reason)
      ) {
        googleDisconnected = true;
      }

      if (googleDisconnected) {
        setGoogleNotConnected(true);
        setGoogleConnectionStatus(false);
      } else if (
        inboxRes.status === 'fulfilled' ||
        calendarRes.status === 'fulfilled'
      ) {
        setGoogleConnectionStatus(true);
      }
      let documentCount = 0;

      if (docsRes.status === "fulfilled") {
        setDocuments(docsRes.value.data);
        documentCount = docsRes.value.data.length;
      }else{
        documentCount = 0;
      }
      let unreadEmails = 0;
      let emailActivity = [];
      if (inboxRes.status === 'fulfilled') {
        unreadEmails = inboxRes.value.data?.stats?.unread ?? inboxRes.value.data?.emails?.filter((e) => e.unread).length ?? 0;
        emailActivity = (inboxRes.value.data?.emails || []).slice(0, 3).map((email) => ({
          id: email.id,
          type: 'email',
          title: email.subject,
          subtitle:email.sender?.raw ||email.from?.raw ||email.sender?.email ||email.from?.email ||"Unknown sender",
          time: email.date,
        }));
      }

      let todayMeetings = 0;
      let meetingActivity = [];
      if (calendarRes.status === 'fulfilled') {
        const events = extractCalendarEvents(calendarRes.value.data);
        todayMeetings = getTodayEvents(events).length;
        meetingActivity = events.slice(0, 3).map((event) => ({
          id: event.id,
          type: 'Calendar Event',
          title: event.title,
          subtitle: 'Calendar event',
          time: event.start,
        }));
      }

      let pendingTasks = 0;
      let taskActivity = [];
      if (tasksRes.status === 'fulfilled') {
        const tasks = tasksRes.value.data?.data || [];
        pendingTasks = tasks.filter((task) => !task.completed).length;
        taskActivity = tasks.slice(0, 3).map((task) => ({
          id: task.id,
          type: 'task',
          title: task.title,
          subtitle: task.priority,
          time: task.updated_at || task.created_at,
        }));
      }

      setStats({
        unreadEmails,
        todayMeetings,
        pendingTasks,
        documents: documentCount,
      });

      setActivity(
        [...emailActivity, ...meetingActivity, ...taskActivity]
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 6)
      );
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
}, []);

  const showConnectCard = googleNotConnected || !googleConnected;

  const quickActions = useMemo(
    () => [
      { label: 'Open Assistant', to: '/assistant', icon: FiMessageSquare, variant: 'primary' },
      { label: 'Upload Document', to: '/knowledge', icon: FiUpload, variant: 'outline-primary' },
      { label: 'View Inbox', to: '/gmail', icon: FiMail, variant: 'outline-primary' },
      { label: 'Manage Tasks', to: '/tasks', icon: FiCheckSquare, variant: 'outline-primary' },
    ],
    []
  );

  return (
    <div>
      <div className="mb-4">
        <h2 className="h4 fw-semibold mb-1">Welcome back</h2>
        <p className="text-muted mb-0">Your AI workspace at a glance</p>
      </div>

      {showConnectCard && (
        <div className="mb-4">
          <ConnectGoogleCard />
        </div>
      )}

      <ErrorAlert message={error} onRetry={fetchDashboard} className="mb-4" />

      <Row className="g-4 mb-4">
        <Col md={6} xl={3}>
          <StatCard icon={FiMail} label="Unread Emails" value={stats.unreadEmails} color="primary" loading={loading} />
        </Col>
        <Col md={6} xl={3}>
          <StatCard icon={FiCalendar} label="Today's Meetings" value={stats.todayMeetings} color="info" loading={loading} />
        </Col>
        <Col md={6} xl={3}>
          <StatCard icon={FiCheckSquare} label="Pending Tasks" value={stats.pendingTasks} color="warning" loading={loading} />
        </Col>
        <Col md={6} xl={3}>
          <StatCard icon={FiBookOpen} label="Uploaded Documents" value={stats.documents} color="success" loading={loading} />
        </Col>
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <div className="wa-card p-4 h-100">
            <h5 className="mb-4">Recent Activity</h5>
            {loading ? (
              <SkeletonList count={3} />
            ) : activity.length === 0 ? (
              <div className="text-muted">No recent activity yet.</div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {activity.map((item) => (
                  <div key={`${item.type}-${item.id}`} className="d-flex justify-content-between align-items-start gap-3 pb-3 border-bottom">
                    <div>
                      <div className="fw-medium">{item.title}{" "}
                        <span className="text-muted small">
                          ({item.type})
                        </span>
                      </div>
                      <div className="small text-muted">{item.subtitle}</div>
                    </div>
                    <small className="text-muted flex-shrink-0">{formatRelative(item.time)}</small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>

        <Col lg={4}>
          <div className="wa-card p-4 h-100">
            <h5 className="mb-4">Quick Actions</h5>
            <div className="d-grid gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  as={Link}
                  to={action.to}
                  variant={action.variant}
                  className="d-flex align-items-center justify-content-center gap-2"
                >
                  <action.icon />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
