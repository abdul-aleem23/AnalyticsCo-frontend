import { systemAPI, adminAPI, publicAPI } from '../services/api'

// Test function to verify API integration
export const testAPIIntegration = async () => {
  const results = {
    system: {},
    public: {},
    admin: {}
  }

  console.log('🧪 Testing API Integration...\n')

  // Test System APIs
  try {
    console.log('Testing system endpoints...')
    
    const systemInfo = await systemAPI.getSystemInfo()
    results.system.info = { success: true, data: systemInfo }
    console.log('✅ System info:', systemInfo)
    
    const healthStatus = await systemAPI.getHealthStatus()
    results.system.health = { success: true, data: healthStatus }
    console.log('✅ Health check:', healthStatus)
    
  } catch (error) {
    results.system.error = error.message
    console.log('❌ System API error:', error.message)
  }

  // Test Public APIs with a sample campaign ID
  try {
    console.log('\nTesting public endpoints...')
    
    const sampleCampaignId = 'test-campaign-id'
    
    const validation = await publicAPI.validateCampaign(sampleCampaignId)
    results.public.validation = { success: true, data: validation }
    console.log('✅ Campaign validation:', validation)
    
  } catch (error) {
    results.public.error = error.message
    console.log('❌ Public API error:', error.message)
  }

  // Note: Admin API tests require authentication
  console.log('\n⚠️  Admin API tests require authentication')
  console.log('Please log in through the admin panel to test admin endpoints\n')

  return results
}

// Function to test admin APIs (call after login)
export const testAdminAPI = async () => {
  const token = localStorage.getItem('adminToken')
  if (!token) {
    console.log('❌ No admin token found. Please log in first.')
    return { error: 'Not authenticated' }
  }

  const results = {}

  try {
    console.log('🧪 Testing Admin API...\n')
    
    // Test current user
    const currentUser = await adminAPI.getCurrentUser()
    results.currentUser = { success: true, data: currentUser }
    console.log('✅ Current user:', currentUser)
    
    // Test dashboard stats
    const dashboardStats = await adminAPI.getDashboardStats()
    results.dashboardStats = { success: true, data: dashboardStats }
    console.log('✅ Dashboard stats:', dashboardStats)
    
    // Test campaigns
    const campaigns = await adminAPI.getCampaigns()
    results.campaigns = { success: true, data: campaigns }
    console.log('✅ Campaigns:', campaigns)
    
  } catch (error) {
    results.error = error.message
    console.log('❌ Admin API error:', error.message)
  }

  return results
}

// Helper function to log API configuration
export const logAPIConfiguration = () => {
  console.log('📋 API Configuration:')
  console.log('Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:8000')
  console.log('Environment:', import.meta.env.NODE_ENV || 'development')
  console.log('Auth Token:', localStorage.getItem('adminToken') ? '✅ Present' : '❌ Not found')
  console.log('User Data:', localStorage.getItem('adminUser') ? '✅ Present' : '❌ Not found')
}