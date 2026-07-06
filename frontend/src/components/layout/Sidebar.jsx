import { NavLink } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import NavIcon from './NavIcon';
import { NAV_ITEMS } from '../../utils/constants';

export default function Sidebar({ show, onClose }) {
  return (
    <>
      {show && (
        <div
          className="d-lg-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1035 }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside className={`wa-sidebar d-flex flex-column ${show ? 'show' : ''}`}>
        <div className="p-3 border-bottom d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <span className="wa-logo-icon">W</span>
            <span className="wa-logo">Workspace AI</span>
          </div>
          <button type="button" className="btn btn-link d-lg-none p-0 text-muted" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <nav className="flex-grow-1 p-3 d-flex flex-column gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `wa-nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <NavIcon name={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-top small text-muted">
          AI-powered workspace assistant
        </div>
      </aside>
    </>
  );
}
