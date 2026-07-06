import { FiMenu } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PAGE_TITLES } from '../../utils/constants';
import { getInitials } from '../../utils/helpers';

export default function Header({ onMenuClick }) {
  const { user } = useAuth();
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] || 'Workspace AI';

  return (
    <header className="wa-header px-3 px-lg-4 d-flex align-items-center justify-content-between">
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm d-lg-none"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <FiMenu size={18} />
        </button>
        <div>
          <div className="small text-muted d-none d-md-block">Workspace AI</div>
          <h1 className="h5 mb-0 fw-semibold">{pageTitle}</h1>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div className="text-end d-none d-sm-block">
          <div className="small fw-medium">{user?.email || 'User'}</div>
          <div className="small text-muted">Pro Plan</div>
        </div>
        <span className="wa-avatar" title={user?.email}>
          {getInitials(user?.email)}
        </span>
      </div>
    </header>
  );
}
