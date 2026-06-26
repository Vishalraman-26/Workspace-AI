import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

export default function WorkspaceLayout({ children }) {
  const location = useLocation()
  const { fetchAllData } = useAppContext()
  
  const navItems = [
    { path: '/workspace/dashboard', label: 'AI Assistant', icon: 'bi-robot' },
    { path: '/workspace/emails', label: 'Inbox', icon: 'bi-envelope' },
    { path: '/workspace/calendar', label: 'Calendar', icon: 'bi-calendar3' },
    { path: '/workspace/tasks', label: 'Tasks', icon: 'bi-list-check' },
    { path: '/workspace/approvals', label: 'Approvals', icon: 'bi-check-circle' }
  ]
  
  return (
    <div className="d-flex vh-100 overflow-hidden bg-light">
      {/* Sidebar */}
      <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '280px' }}>
        <Link to="/workspace/dashboard" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          <i className="bi bi-lightning-charge-fill me-2 fs-4 text-primary"></i>
          <span className="fs-4 fw-bold">InboxIntel</span>
        </Link>
        
        <hr />
        
        <ul className="nav nav-pills flex-column mb-auto">
          {navItems.map((item) => (
            <li className="nav-item" key={item.path}>
              <Link
                to={item.path}
                className={`nav-link text-white d-flex align-items-center gap-2 ${location.pathname === item.path ? 'active' : ''}`}
                aria-current={location.pathname === item.path ? 'page' : undefined}
              >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        
        <hr />
        
        <div className="dropdown">
          <div className="d-flex align-items-center text-white text-decoration-none mb-3 px-2">
            <i className="bi bi-person-circle fs-4 me-2 text-secondary"></i>
            <div className="overflow-hidden">
              <div className="fw-bold text-truncate small">Sarah Jenkins</div>
              <div className="text-secondary small text-truncate" style={{ fontSize: '0.75rem' }}>Operations Manager</div>
            </div>
          </div>
          
          <button 
            onClick={fetchAllData} 
            className="btn btn-outline-secondary btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
          >
            <i className="bi bi-arrow-repeat"></i>
            Refresh Data
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column h-100 overflow-hidden">
        {children}
      </div>
    </div>
  )
}
