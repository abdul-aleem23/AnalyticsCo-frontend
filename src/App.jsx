import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Public Components (No Authentication Required)
import Dashboard from './pages/Dashboard'
import PrivacyPolicy from './pages/PrivacyPolicy'

// Admin Components (Authentication Required)
import AdminLogin from './pages/AdminLogin'
import AdminPanel from './pages/AdminPanel'
import ProtectedRoute from './components/ProtectedRoute'

// Context Providers
import { AdminAuthProvider } from './hooks/useAuth'

// Debug Components (remove in production)
import LoginDebug from './components/debug/LoginDebug'
import AnalyticsDebug from './components/debug/AnalyticsDebug'

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes - No Authentication Required */}
            <Route path="/dashboard/:campaignId" element={<Dashboard />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            
            {/* Admin Routes - Authentication Required */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } />
            
            {/* Debug Routes - Remove in production */}
            <Route path="/debug" element={<LoginDebug />} />
            <Route path="/debug/analytics" element={<AnalyticsDebug />} />
            
            {/* Default Redirects */}
            <Route path="/" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
            <Route path="*" element={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                  <p className="text-gray-600 mb-4">
                    To view campaign analytics, use: /dashboard/YOUR_CAMPAIGN_ID
                  </p>
                  <a href="/admin/login" className="btn-primary">
                    Admin Login
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </div>
        
        {/* Toast Notifications with Berlin Theme */}
        <Toaster
          position="top-right"
          gutter={12}
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(13, 2, 8, 0.95)',
              backdropFilter: 'blur(12px)',
              color: '#F0CA00',
              border: '1px solid rgba(240, 202, 0, 0.3)',
              borderRadius: '8px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '14px',
              boxShadow: '0 8px 32px rgba(13, 2, 8, 0.8)',
            },
            success: {
              iconTheme: {
                primary: '#F0CA00',
                secondary: 'rgba(13, 2, 8, 0.95)',
              },
              style: {
                border: '1px solid rgba(240, 202, 0, 0.5)',
              }
            },
            error: {
              iconTheme: {
                primary: '#ff6b6b',
                secondary: 'rgba(13, 2, 8, 0.95)',
              },
              style: {
                border: '1px solid rgba(255, 107, 107, 0.5)',
                color: '#ff6b6b'
              }
            },
          }}
        />
      </Router>
    </AdminAuthProvider>
  )
}

export default App