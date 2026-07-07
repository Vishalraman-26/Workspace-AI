import { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import EmptyState from '../common/EmptyState';
import TaskCard from './TaskCard';

export default function CompletedTasksSection({ tasks, onEdit, onDelete, onToggleComplete }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="wa-work-section wa-fade-in">
      <div
        className="wa-completed-toggle"
        onClick={() => setOpen((prev) => !prev)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        {open ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
        <h3 className="wa-work-section-title mb-0">
          Completed
          <span className="text-muted fw-normal ms-2">({tasks.length})</span>
        </h3>
      </div>

      <Collapse in={open}>
        <div className="mt-3">
          {tasks.length === 0 ? (
            <EmptyState
              title="No completed tasks"
              description="Completed tasks will appear here."
            />
          ) : (
            <div className="d-flex flex-column gap-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleComplete={onToggleComplete}
                />
              ))}
            </div>
          )}
        </div>
      </Collapse>
    </section>
  );
}
