import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/admin'

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, from])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isLoading) return

    setError('')
    setIsLoading(true)

    const result = await login(formData)
    
    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError(result.error)
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" style={{backgroundColor: 'var(--berlin-black)'}}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="font-cyber text-4xl font-bold mb-4" style={{color: 'var(--berlin-ubahn)'}}>
            <span className="font-mono">[</span>ADMIN<span className="font-mono">]</span>
          </div>
          <div className="font-terminal text-sm text-gray-400 mb-2">
            &gt; Access_Control_System.exe
          </div>
          <div className="font-mono text-sm text-gray-500">
            QR Analytics Platform Administration
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="glass-card">
            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-md">
                <p className="text-red-400 text-sm font-mono">[ERROR] {error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-mono text-gray-300 mb-2 uppercase tracking-wider">
                  Email_Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border-2 border-gray-600 rounded-md shadow-sm placeholder-gray-500 text-white font-mono focus:outline-none focus:border-berlin-ubahn focus:ring-2 focus:ring-berlin-ubahn/50 transition-all"
                  placeholder="admin@thepostingco.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-mono text-gray-300 mb-2 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-12 bg-gray-800/50 border-2 border-gray-600 rounded-md shadow-sm placeholder-gray-500 text-white font-mono focus:outline-none focus:border-berlin-ubahn focus:ring-2 focus:ring-berlin-ubahn/50 transition-all"
                    placeholder="•••••••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-berlin-ubahn transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full berlin-btn py-4 text-base font-bold ${
                  isLoading
                    ? 'opacity-50 cursor-not-allowed transform-none'
                    : ''
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-3" style={{borderColor: 'var(--berlin-black)'}}></div>
                    <span className="font-mono">AUTHENTICATING...</span>
                  </div>
                ) : (
                  <span className="font-mono">ACCESS_GRANTED &gt;</span>
                )}
              </button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs font-terminal text-gray-500">
              [INFO] Campaign access: /dashboard/YOUR_CAMPAIGN_ID
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin