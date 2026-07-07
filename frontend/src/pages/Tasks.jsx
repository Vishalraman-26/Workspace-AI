import { useEffect, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';
import taskApi from '../services/task.api';
import useCalendarEvents from '../components/calendar/useCalendarEvents';
import TaskCard from '../components/tasks/TaskCard';
import TaskStatsCards from '../components/tasks/TaskStatsCards';
import TodayEventsPanel from '../components/tasks/TodayEventsPanel';
import CompletedTasksSection from '../components/tasks/CompletedTasksSection';
import TaskFormModal from '../components/tasks/TaskFormModal';
import ConfirmModal from '../components/common/ConfirmModal';
import ErrorAlert from '../components/common/ErrorAlert';
import EmptyState from '../components/common/EmptyState';
import { SkeletonList } from '../components/common/SkeletonLoader';
import { getTodayEvents } from '../components/calendar/eventUtils';
import { getErrorMessage } from '../utils/helpers';
import '../styles/productivity.css';

export default function Tasks() {
  const {
    events: calendarEvents,
    loading: eventsLoading,
    error: eventsError,
    notConnected: calendarNotConnected,
    fetchEvents: fetchCalendarEvents,
  } = useCalendarEvents();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await taskApi.getTasks();
      setTasks(data.data || []);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load tasks'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const pendingTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks]
  );

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed),
    [tasks]
  );

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: pendingTasks.length,
    completed: completedTasks.length,
    todayEvents: getTodayEvents(calendarEvents).length,
  }), [tasks, pendingTasks, completedTasks, calendarEvents]);

  const openCreateModal = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (selectedTask) {
        await taskApi.updateTask(selectedTask.id, payload);
      } else {
        await taskApi.createTask(payload);
      }
      setModalOpen(false);
      await fetchTasks();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to save task'));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await taskApi.updateTask(task.id, { completed: !task.completed });
      await fetchTasks();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to update task'));
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await taskApi.deleteTask(deleteTarget.id);
      setDeleteTarget(null);
      await fetchTasks();
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete task'));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4 wa-fade-in">
        <div>
          <h2 className="h4 fw-semibold mb-1">Tasks</h2>
          <p className="text-muted mb-0">
            Your work queue — calendar, active tasks, and completed work
          </p>
        </div>
      </div>

      <ErrorAlert message={error} onRetry={fetchTasks} className="mb-4" />

      <TaskStatsCards stats={stats} loading={loading || eventsLoading} />

      <TodayEventsPanel
        events={calendarEvents}
        loading={eventsLoading}
        error={eventsError}
        notConnected={calendarNotConnected}
        onRetry={fetchCalendarEvents}
      />

      <section className="wa-work-section wa-fade-in">
        <div className="wa-work-section-header">
          <div>
            <h3 className="wa-work-section-title">My Tasks</h3>
            <p className="text-muted small mb-0">Active items in your work queue</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            className="d-flex align-items-center gap-2"
            onClick={openCreateModal}
          >
            <FiPlus size={16} />
            Add Task
          </Button>
        </div>

        {loading ? (
          <SkeletonList count={4} />
        ) : pendingTasks.length === 0 ? (
          <EmptyState
            title="No pending tasks"
            description="Add a task to start building your work queue."
            action={
              <Button variant="primary" size="sm" onClick={openCreateModal}>
                Add Task
              </Button>
            }
          />
        ) : (
          <div className="d-flex flex-column gap-3">
            {pendingTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={openEditModal}
                onDelete={setDeleteTarget}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        )}
      </section>

      {!loading && (
        <CompletedTasksSection
          tasks={completedTasks}
          onEdit={openEditModal}
          onDelete={setDeleteTarget}
          onToggleComplete={handleToggleComplete}
        />
      )}

      <TaskFormModal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedTask}
        loading={saving}
      />

      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete Task"
        message={`Delete "${deleteTarget?.title}"?`}
        confirmLabel="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onHide={() => setDeleteTarget(null)}
      />
    </div>
  );
}
