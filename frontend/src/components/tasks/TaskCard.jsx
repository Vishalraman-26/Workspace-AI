import { Badge, Button } from 'react-bootstrap';
import { FiCheck, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatDate } from '../../utils/date';
import PriorityBadge from '../common/PriorityBadge';

export default function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {
  const isCompleted = Boolean(task.completed);

  return (
    <div className={`wa-task-card wa-fade-in ${isCompleted ? 'completed' : ''}`}>
      <div className="d-flex align-items-start gap-3">
        <input
          type="checkbox"
          className="wa-task-checkbox mt-1"
          checked={isCompleted}
          onChange={() => onToggleComplete(task)}
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as complete'}
        />

        <div className="flex-grow-1 min-w-0">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
            <h6 className={`mb-0 fw-semibold ${isCompleted ? 'text-decoration-line-through text-muted' : ''}`}>
              {task.title}
            </h6>
            <PriorityBadge priority={task.priority} />
          </div>

          {task.description && (
            <p className="small text-muted mb-2">{task.description}</p>
          )}

          <div className="d-flex flex-wrap align-items-center gap-2">
            <Badge bg={isCompleted ? 'success' : 'secondary'}>
              {isCompleted ? 'Completed' : 'Pending'}
            </Badge>
            {task.due_date && (
              <Badge bg="light" text="dark" className="border">
                Due {formatDate(task.due_date)}
              </Badge>
            )}
          </div>
        </div>

        <div className="d-flex gap-1 wa-task-actions flex-shrink-0">
          {!isCompleted && (
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => onToggleComplete(task)}
              title="Complete task"
            >
              <FiCheck size={14} />
            </Button>
          )}
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            <FiEdit2 size={14} />
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => onDelete(task)}
            title="Delete task"
          >
            <FiTrash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
