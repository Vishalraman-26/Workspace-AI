import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="d-flex">
      <Sidebar show={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-grow-1 wa-main">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-3 p-lg-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
