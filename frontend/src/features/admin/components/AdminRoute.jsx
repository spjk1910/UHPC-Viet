import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'

import { APP_ROUTES } from '../../../config/appRoutes'
import { getAdminSession } from '../services/adminService'

function AdminRoute({ children }) {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let active = true
    getAdminSession()
      .then(() => {
        if (active) setStatus('authorized')
      })
      .catch((error) => {
        if (active) setStatus(error.status === 401 ? 'unauthorized' : 'error')
      })

    return () => {
      active = false
    }
  }, [])

  if (status === 'checking') {
    return <main className="site-container py-20 text-center">Checking admin session...</main>
  }

  if (status === 'unauthorized') {
    return <Navigate to={APP_ROUTES.admin} replace />
  }

  if (status === 'error') {
    return (
      <main className="site-container py-20 text-center text-red-700">
        Unable to verify the admin session. Refresh the page to try again.
      </main>
    )
  }

  return children
}

export default AdminRoute
