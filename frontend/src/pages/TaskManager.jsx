
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      const createdTask = await api.createTask(newTask);
      setTasks([...tasks, createdTask]);
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    } catch (err) {
      console.error("Failed to create task:", err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const updatedTask = await api.updateTaskStatus(id, status);
      setTasks(tasks.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="h-100 d-flex flex-column bg-light">
      <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-white sticky-top">
        <h2 className="h6 mb-0 fw-bold text-secondary text-uppercase">
          <i className="bi bi-list-check me-2"></i>Tasks
        </h2>
        <button onClick={fetchTasks} className="btn btn-sm btn-outline-secondary">
          <i className="bi bi-arrow-clockwise"></i> Refresh
        </button>
      </div>

      <div className="p-3 flex-grow-1 overflow-auto">
        {/* Create Task Form */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-white border-bottom">
            <span className="fw-bold small">Create New Task</span>
          </div>
          <div className="card-body">
            <form onSubmit={handleCreateTask}>
              <div className="mb-3">
                <label className="form-label small">Title</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title..."
                />
              </div>
              <div className="mb-3">
                <label className="form-label small">Description</label>
                <textarea
                  className="form-control form-control-sm"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task description..."
                  rows="2"
                />
              </div>
              <div className="mb-3">
                <label className="form-label small">Priority</label>
                <select
                  className="form-select form-select-sm"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary btn-sm w-100">
                <i className="bi bi-plus-lg me-1"></i>Add Task
              </button>
            </form>
          </div>
        </div>

        {/* Tasks Lists */}
        <div className="row g-3">
          {/* Pending Tasks */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
                <span className="fw-bold small text-primary">
                  <i className="bi bi-hourglass-split me-2"></i>
                  Pending ({pendingTasks.length})
                </span>
              </div>
              <div className="card-body p-0">
                {loading ? (
                  <div className="p-4 text-center text-muted small">Loading tasks...</div>
                ) : pendingTasks.length === 0 ? (
                  <div className="p-4 text-center text-muted small">No pending tasks</div>
                ) : (
                  <div className="list-group list-group-flush">
                    {pendingTasks.map((task) => (
                      <div key={task.id} className="list-group-item border-0 border-bottom">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <span className="fw-bold small text-dark">{task.title}</span>
                          <span className={`badge ${
                            task.priority === 'high' ? 'bg-danger' :
                            task.priority === 'medium' ? 'bg-warning text-dark' : 'bg-secondary'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        {task.description && (
                          <div className="text-muted small mb-2">{task.description}</div>
                        )}
                        <button
                          onClick={() => handleUpdateStatus(task.id, 'completed')}
                          className="btn btn-outline-success btn-sm w-100"
                        >
                          <i className="bi bi-check2 me-1"></i>Mark Complete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center">
                <span className="fw-bold small text-success">
                  <i className="bi bi-check2-circle me-2"></i>
                  Completed ({completedTasks.length})
                </span>
              </div>
              <div className="card-body p-0">
                {loading ? (
                  <div className="p-4 text-center text-muted small">Loading tasks...</div>
                ) : completedTasks.length === 0 ? (
                  <div className="p-4 text-center text-muted small">No completed tasks</div>
                ) : (
                  <div className="list-group list-group-flush">
                    {completedTasks.map((task) => (
                      <div key={task.id} className="list-group-item border-0 border-bottom">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <span className="fw-bold small text-muted text-decoration-line-through">
                            {task.title}
                          </span>
                        </div>
                        {task.description && (
                          <div className="text-muted small text-decoration-line-through">
                            {task.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
