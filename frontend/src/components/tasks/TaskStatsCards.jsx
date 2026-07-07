import { FiCheckSquare, FiClock, FiList, FiCalendar } from 'react-icons/fi';

function StatCard({ icon: Icon, label, value, color, loading }) {
  return (
    <div className="wa-stat-card wa-fade-in">
      <div className="d-flex align-items-center gap-3">
        <div className={`wa-stat-icon bg-${color} bg-opacity-10 text-${color}`}>
          <Icon />
        </div>
        <div>
          <div className="text-muted small">{label}</div>
          <div className="h3 mb-0 fw-bold">
            {loading ? (
              <span className="wa-skeleton d-inline-block" style={{ width: 48, height: 28 }} />
            ) : (
              value
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TaskStatsCards({ stats, loading }) {
  return (
    <div className="wa-task-stats row g-3 mb-4">
      <div className="col-sm-6 col-xl-3">
        <StatCard
          icon={FiList}
          label="Total Tasks"
          value={stats.total}
          color="primary"
          loading={loading}
        />
      </div>
      <div className="col-sm-6 col-xl-3">
        <StatCard
          icon={FiClock}
          label="Pending"
          value={stats.pending}
          color="warning"
          loading={loading}
        />
      </div>
      <div className="col-sm-6 col-xl-3">
        <StatCard
          icon={FiCheckSquare}
          label="Completed"
          value={stats.completed}
          color="success"
          loading={loading}
        />
      </div>
      <div className="col-sm-6 col-xl-3">
        <StatCard
          icon={FiCalendar}
          label="Today's Events"
          value={stats.todayEvents}
          color="info"
          loading={loading}
        />
      </div>
    </div>
  );
}
