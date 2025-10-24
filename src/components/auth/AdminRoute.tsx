import { ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { CircularProgress, Box } from '@mui/material'
import { getKeycloakInstance, hasRole } from '../../lib/auth/keycloak'

interface AdminRouteProps {
  children: ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        const keycloak = await getKeycloakInstance()
        if (keycloak && keycloak.authenticated) {
          setIsAdmin(hasRole('admin'))
        } else {
          setIsAdmin(false)
        }
      } catch (error) {
        console.error('Admin role check failed:', error)
        setIsAdmin(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminRole()
  }, [])

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
