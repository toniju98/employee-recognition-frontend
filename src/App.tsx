import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider } from './components/auth/AuthProvider'
import { SnackbarProvider } from './components/snackbar/SnackbarProvider'
import { Navbar } from './components/navigation/Navbar'
import { AdminRoute } from './components/auth/AdminRoute'
import { CircularProgress, Box } from '@mui/material'

// Lazy load pages for better performance
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const RewardsPage = lazy(() => import('./pages/RewardsPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'))
const AdminAnalyticsPage = lazy(() => import('./pages/admin/AdminAnalyticsPage'))
const AdminPointsPage = lazy(() => import('./pages/admin/AdminPointsPage'))
const AdminRecognitionTypesPage = lazy(() => import('./pages/admin/AdminRecognitionTypesPage'))
const AdminRewardsPage = lazy(() => import('./pages/admin/AdminRewardsPage'))

// Loading component
const PageLoader = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
    <CircularProgress />
  </Box>
)

function App() {
  return (
    <SnackbarProvider>
      <AuthProvider>
        <Navbar />
        <main>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Routes - Keycloak handles authentication automatically */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/analytics" element={
                <AdminRoute>
                  <AdminAnalyticsPage />
                </AdminRoute>
              } />
              <Route path="/admin/points" element={
                <AdminRoute>
                  <AdminPointsPage />
                </AdminRoute>
              } />
              <Route path="/admin/recognition-types" element={
                <AdminRoute>
                  <AdminRecognitionTypesPage />
                </AdminRoute>
              } />
              <Route path="/admin/rewards" element={
                <AdminRoute>
                  <AdminRewardsPage />
                </AdminRoute>
              } />
            </Routes>
          </Suspense>
        </main>
      </AuthProvider>
    </SnackbarProvider>
  )
}

export default App
