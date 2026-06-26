import React from 'react'
import { Outlet } from 'react-router-dom'
import WorkspaceLayout from '../components/WorkspaceLayout'

export default function WorkspaceCore() {
  return (
    <WorkspaceLayout>
      <Outlet />
    </WorkspaceLayout>
  )
}
