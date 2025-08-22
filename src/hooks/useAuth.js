import React, { createContext, useContext, useState, useEffect } from 'react'
import { adminAPI } from '../services/api'

const AdminAuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AdminAuthProvider')
  }
  return context
}

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const userData = localStorage.getItem('adminUser')
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      const response = await adminAPI.login(credentials)
      const { access_token, token_type, expires_in } = response
      
      localStorage.setItem('adminToken', access_token)
      
      // Get user info after successful login
      const userData = await adminAPI.getCurrentUser()
      localStorage.setItem('adminUser', JSON.stringify(userData))
      setUser(userData)
      
      return { success: true, expires_in }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed'
      }
    }
  }

  const logout = async () => {
    try {
      await adminAPI.logout()
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
      setUser(null)
    }
  }

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user
  }

  return React.createElement(
    AdminAuthContext.Provider,
    { value: value },
    children
  )
}