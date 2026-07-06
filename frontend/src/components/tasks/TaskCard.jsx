import { Badge, Button, Form } from 'react-bootstrap';
import { FiCheck, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatDate } from '../../utils/date';
import PriorityBadge from '../common/PriorityBadge';

export default function TaskCard({ task, onEdit, onDelete, onToggleComplete }) {
  return (
    <div className={`wa-card wa-card-hover p-3 h-100 ${task.completed ? 'opacity-75' : ''}`}>
      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
        <h6 className={`mb-0 ${task.completed ? 'text-decoration-line-through' : ''}`}>
          {task.title}
        </h6>
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && (
        <p className="small text-muted mb-2">{task.description}</p>
      )}

      <div className="d-flex flex-wrap gap-2 mb-3">
        {task.due_date && (
          <Badge bg="light" text="dark" className="border">
            Due {formatDate(task.due_date)}
          </Badge>
        )}
        <Badge bg={task.completed ? 'success' : 'secondary'}>
          {task.completed ? 'Completed' : 'Pending'}
        </Badge>
      </div>

      <div className="d-flex gap-2">
        <Button
          variant={task.completed ? 'outline-secondary' : 'outline-success'}
          size="sm"
          onClick={() => onToggleComplete(task)}
        >
          <FiCheck size={14} />
        </Button>
        <Button variant="outline-primary" size="sm" onClick={() => onEdit(task)}>
          <FiEdit2 size={14} />
        </Button>
        <Button variant="outline-danger" size="sm" onClick={() => onDelete(task)}>
          <FiTrash2 size={14} />
        </Button>
      </div>
    </div>
  );
}

export function TaskFilters({ search, priority, onSearchChange, onPriorityChange }) {
  return (
    <div className="row g-3 mb-4">
      <div className="col-md-8">
        <Form.Control
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="col-md-4">
        <Form.Select value={priority} onChange={(e) => onPriorityChange(e.target.value)}>
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </Form.Select>
      </div>
    </div>
  );
}
