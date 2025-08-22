import React, { useState } from 'react'
import { adminAPI, publicAPI } from '../../services/api'

const AnalyticsDebug = () => {
  const [campaignId, setCampaignId] = useState('')
  const [testResults, setTestResults] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const testAdminStats = async () => {
    if (!campaignId) {
      alert('Please enter a campaign ID')
      return
    }

    setIsLoading(true)
    try {
      console.log('Testing admin stats for campaign:', campaignId)
      const stats = await adminAPI.getCampaignAdminStats(campaignId)
      setTestResults(prev => ({
        ...prev,
        adminStats: { success: true, data: stats }
      }))
      console.log('✅ Admin stats:', stats)
    } catch (error) {
      console.log('❌ Admin stats error:', error)
      setTestResults(prev => ({
        ...prev,
        adminStats: { 
          success: false, 
          error: error.response?.data?.detail || error.message 
        }
      }))
    }
    setIsLoading(false)
  }

  const testPublicStats = async () => {
    if (!campaignId) {
      alert('Please enter a campaign ID')
      return
    }

    setIsLoading(true)
    try {
      console.log('Testing public stats for campaign:', campaignId)
      const stats = await publicAPI.getCampaignStats(campaignId)
      setTestResults(prev => ({
        ...prev,
        publicStats: { success: true, data: stats }
      }))
      console.log('✅ Public stats:', stats)
    } catch (error) {
      console.log('❌ Public stats error:', error)
      setTestResults(prev => ({
        ...prev,
        publicStats: { 
          success: false, 
          error: error.response?.data?.detail || error.message 
        }
      }))
    }
    setIsLoading(false)
  }

  const testCampaignValidation = async () => {
    if (!campaignId) {
      alert('Please enter a campaign ID')
      return
    }

    setIsLoading(true)
    try {
      console.log('Testing campaign validation for:', campaignId)
      const validation = await publicAPI.validateCampaign(campaignId)
      setTestResults(prev => ({
        ...prev,
        validation: { success: true, data: validation }
      }))
      console.log('✅ Campaign validation:', validation)
    } catch (error) {
      console.log('❌ Campaign validation error:', error)
      setTestResults(prev => ({
        ...prev,
        validation: { 
          success: false, 
          error: error.response?.data?.detail || error.message 
        }
      }))
    }
    setIsLoading(false)
  }

  const getAllCampaigns = async () => {
    setIsLoading(true)
    try {
      console.log('Getting all campaigns...')
      const campaigns = await adminAPI.getCampaigns()
      setTestResults(prev => ({
        ...prev,
        campaigns: { success: true, data: campaigns }
      }))
      console.log('✅ All campaigns:', campaigns)
      
      if (campaigns.length > 0) {
        setCampaignId(campaigns[0].campaign_id)
        console.log('Auto-filled campaign ID:', campaigns[0].campaign_id)
      }
    } catch (error) {
      console.log('❌ Get campaigns error:', error)
      setTestResults(prev => ({
        ...prev,
        campaigns: { 
          success: false, 
          error: error.response?.data?.detail || error.message 
        }
      }))
    }
    setIsLoading(false)
  }

  const clearResults = () => {
    setTestResults({})
    console.clear()
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Analytics Debug Tool</h2>
      
      <div className="space-y-4 mb-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Campaign ID:</label>
            <input
              type="text"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter campaign ID or click 'Get Campaigns' to auto-fill"
            />
          </div>
          <button
            onClick={getAllCampaigns}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:bg-gray-400"
          >
            Get Campaigns
          </button>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={testCampaignValidation}
            disabled={isLoading || !campaignId}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            Test Validation
          </button>
          
          <button
            onClick={testPublicStats}
            disabled={isLoading || !campaignId}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            Test Public Stats
          </button>
          
          <button
            onClick={testAdminStats}
            disabled={isLoading || !campaignId}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400"
          >
            Test Admin Stats
          </button>
          
          <button
            onClick={clearResults}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Clear Results
          </button>
        </div>
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="space-y-4">
          {Object.entries(testResults).map(([key, result]) => (
            <div key={key} className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-bold mb-2 capitalize">{key} Results:</h3>
              <pre className="text-xs overflow-auto max-h-64 bg-white p-3 rounded border">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Instructions:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click "Get Campaigns" to fetch your campaigns and auto-fill the ID</li>
          <li>• Test Validation: Checks if campaign exists and client access is enabled</li>
          <li>• Test Public Stats: Tests the public analytics endpoint (requires client access)</li>
          <li>• Test Admin Stats: Tests the admin analytics endpoint (requires authentication)</li>
          <li>• Open browser console to see detailed logs</li>
        </ul>
      </div>
    </div>
  )
}

export default AnalyticsDebug