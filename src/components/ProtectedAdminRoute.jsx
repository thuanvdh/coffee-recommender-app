import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getAdminSession } from '../api'

function ProtectedAdminRoute({ children }) {
  const location = useLocation()
  const session = getAdminSession()

  if (!session?.access_token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default ProtectedAdminRoute
