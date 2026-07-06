import { useEffect, useMemo, useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';
import taskApi from '../services/task.api';
import TaskCard, { TaskFilters } from '../components/tasks/TaskCard';
import TaskFormModal from '../components/tasks/TaskFormModal';
import ConfirmModal from '../components/common/ConfirmModal';
import ErrorAlert from '../components/common/ErrorAlert';
import EmptyState from '../components/common/EmptyState';
import { SkeletonList } from '../components/common/SkeletonLoader';
import { getErrorMessage } from '../utils/helpers';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState('all');
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

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesPriority = priority === 'all' || task.priority === priority;
      const matchesSearch =
        !search.trim() ||
        [task.title, task.description].filter(Boolean).join(' ').toLowerCase().includes(search.toLowerCase());
      return matchesPriority && matchesSearch;
    });
  }, [tasks, search, priority]);

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
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h2 className="h4 fw-semibold mb-1">Tasks</h2>
          <p className="text-muted mb-0">Track and manage your work with priority-aware task cards</p>
        </div>
        <Button variant="primary" className="d-flex align-items-center gap-2" onClick={openCreateModal}>
          <FiPlus />
          Create Task
        </Button>
      </div>

      <ErrorAlert message={error} onRetry={fetchTasks} className="mb-4" />

      <TaskFilters
        search={search}
        priority={priority}
        onSearchChange={setSearch}
        onPriorityChange={setPriority}
      />

      {loading ? (
        <SkeletonList count={6} />
      ) : filteredTasks.length === 0 ? (
        <EmptyState title="No tasks found" description="Create a task or adjust your filters." />
      ) : (
        <Row className="g-3">
          {filteredTasks.map((task) => (
            <Col md={6} xl={4} key={task.id}>
              <TaskCard
                task={task}
                onEdit={openEditModal}
                onDelete={setDeleteTarget}
                onToggleComplete={handleToggleComplete}
              />
            </Col>
          ))}
        </Row>
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
