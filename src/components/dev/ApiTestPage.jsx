import React, { useState } from 'react'
import { testAPIIntegration, testAdminAPI, logAPIConfiguration } from '../../utils/apiTest'
import { useAuth } from '../../hooks/useAuth'

const ApiTestPage = () => {
  const [testResults, setTestResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  const runBasicTests = async () => {
    setIsLoading(true)
    try {
      const results = await testAPIIntegration()
      setTestResults(results)
    } catch (error) {
      setTestResults({ error: error.message })
    }
    setIsLoading(false)
  }

  const runAdminTests = async () => {
    setIsLoading(true)
    try {
      const results = await testAdminAPI()
      setTestResults(prev => ({ ...prev, admin: results }))
    } catch (error) {
      setTestResults(prev => ({ ...prev, admin: { error: error.message } }))
    }
    setIsLoading(false)
  }

  const showConfiguration = () => {
    logAPIConfiguration()
    alert('Check browser console for API configuration details')
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          API Integration Test Page
        </h1>
        
        <div className="space-y-4 mb-6">
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={runBasicTests}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Testing...' : 'Test Basic APIs'}
            </button>
            
            <button
              onClick={runAdminTests}
              disabled={isLoading || !isAuthenticated}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {isLoading ? 'Testing...' : 'Test Admin APIs'}
            </button>
            
            <button
              onClick={showConfiguration}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Show Config
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            Authentication Status: 
            <span className={`ml-2 px-2 py-1 rounded ${
              isAuthenticated 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
            </span>
          </div>
        </div>

        {testResults && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Test Results</h2>
            <pre className="whitespace-pre-wrap text-sm bg-white p-4 rounded border overflow-auto max-h-96">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Instructions:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Test Basic APIs:</strong> Tests system health and public endpoints</li>
            <li>• <strong>Test Admin APIs:</strong> Tests authenticated admin endpoints (login required)</li>
            <li>• <strong>Show Config:</strong> Displays current API configuration in console</li>
            <li>• Open browser console to see detailed test output</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-medium text-yellow-900 mb-2">API Endpoints:</h3>
          <div className="text-sm text-yellow-800 space-y-1">
            <div><strong>System:</strong> GET / and GET /health</div>
            <div><strong>Public:</strong> GET /api/campaigns/{'{id}'}/validate and /stats</div>
            <div><strong>Admin:</strong> POST /admin/login, GET /admin/me, GET /admin/dashboard/stats</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApiTestPage