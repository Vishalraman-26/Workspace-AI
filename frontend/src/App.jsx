import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import WorkspaceCore from './pages/WorkspaceCore'
import InspectionInbox from './pages/InspectionInbox'
import FullScheduler from './pages/FullScheduler'
import TaskManager from './pages/TaskManager'
import ApprovalCenter from './pages/ApprovalCenter'
import ChatInterface from './pages/ChatInterface'

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(true) // Set to true for development

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route 
          path="/workspace/*" 
          element={
            isAuthenticated ? <WorkspaceCore /> : <Navigate to="/login" replace />
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ChatInterface />} />
          <Route path="emails" element={<InspectionInbox />} />
          <Route path="calendar" element={<FullScheduler />} />
          <Route path="tasks" element={<TaskManager />} />
          <Route path="approvals" element={<ApprovalCenter />} />
        </Route>
        <Route path="*" element={<Navigate to="/workspace/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

export default App
