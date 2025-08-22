import axios from 'axios'

// Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token for admin requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token && config.url.includes('/admin/')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized for admin routes
    if (error.response?.status === 401 && error.config.url.includes('/admin/')) {
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminUser')
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = '/admin/login'
      }
    }
    
    // Handle network errors
    if (!error.response) {
      error.message = 'Network error - please check your connection'
    }
    
    // Handle server errors
    if (error.response?.status >= 500) {
      error.message = 'Server error - please try again later'
    }
    
    return Promise.reject(error)
  }
)

// Public API calls (no authentication required)
export const publicAPI = {
  // Validate campaign and check access
  validateCampaign: async (campaignId) => {
    const response = await api.get(`/api/campaigns/${campaignId}/validate`)
    return response.data
  },

  // Get campaign analytics
  getCampaignStats: async (campaignId) => {
    const response = await api.get(`/api/campaigns/${campaignId}/stats`)
    return response.data
  },

  // Export campaign data to Excel
  exportCampaignData: async (campaignId) => {
    const response = await api.get(`/api/campaigns/${campaignId}/export`, {
      responseType: 'blob'
    })
    return response.data
  }
}

// Admin API calls (authentication required)
export const adminAPI = {
  // Authentication
  login: async (credentials) => {
    const response = await api.post('/admin/login', credentials)
    return response.data
  },

  logout: async () => {
    const response = await api.post('/admin/logout')
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/admin/me')
    return response.data
  },

  // Dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats')
    return response.data
  },

  // Campaign management
  getCampaigns: async (includeArchived = false) => {
    const response = await api.get(`/admin/campaigns?include_archived=${includeArchived}`)
    return response.data
  },

  getCampaign: async (campaignId) => {
    const response = await api.get(`/admin/campaigns/${campaignId}`)
    return response.data
  },

  createCampaign: async (campaignData) => {
    const response = await api.post('/admin/campaigns', campaignData)
    return response.data
  },

  updateCampaign: async (campaignId, campaignData) => {
    const response = await api.put(`/admin/campaigns/${campaignId}`, campaignData)
    return response.data
  },

  archiveCampaign: async (campaignId) => {
    const response = await api.put(`/admin/campaigns/${campaignId}/archive`)
    return response.data
  },

  unarchiveCampaign: async (campaignId) => {
    const response = await api.put(`/admin/campaigns/${campaignId}/unarchive`)
    return response.data
  },

  toggleClientAccess: async (campaignId, enabled) => {
    const response = await api.put(`/admin/campaigns/${campaignId}/access`, {
      client_access_enabled: enabled
    })
    return response.data
  },

  // QR code generation
  getCampaignQR: async (campaignId, size = 300, format = 'PNG') => {
    const response = await api.get(`/admin/campaigns/${campaignId}/qr?size=${size}&format=${format}`, {
      responseType: 'blob'
    })
    return response.data
  },

  // Download QR code with proper filename
  downloadCampaignQR: async (campaignId, size = 300, format = 'PNG') => {
    const response = await api.get(`/admin/campaigns/${campaignId}/qr?size=${size}&format=${format}`, {
      responseType: 'blob'
    })
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${campaignId}_qr.${format.toLowerCase()}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
  },

  // Campaign stats for admin view
  getCampaignAdminStats: async (campaignId) => {
    const response = await api.get(`/admin/campaigns/${campaignId}/stats`)
    return response.data
  }
}

// System API calls
export const systemAPI = {
  // Get API status and info
  getSystemInfo: async () => {
    const response = await api.get('/')
    return response.data
  },

  // Health check
  getHealthStatus: async () => {
    const response = await api.get('/health')
    return response.data
  }
}

export default api