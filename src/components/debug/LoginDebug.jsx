import React, { useState } from 'react'

const LoginDebug = () => {
  const [testResult, setTestResult] = useState(null)
  const [credentials, setCredentials] = useState({
    email: 'Abdul_aleem98@hotmail.com',
    password: 'Alyisthebest3!'
  })

  const testLogin = async () => {
    try {
      console.log('Testing login with:', { email: credentials.email, password: '***' })
      
      const response = await fetch('https://analyticsco-backend-production.up.railway.app/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        mode: 'cors'
      })
      
      const data = await response.json()
      
      const result = {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        data: data,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url
      }
      
      setTestResult(result)
      
      console.log('Full response:', result)
      
      if (response.ok) {
        console.log('✅ Login successful!')
      } else {
        console.log('❌ Login failed:', data)
      }
      
    } catch (error) {
      const errorResult = {
        error: error.message,
        name: error.name,
        type: 'Network/CORS Error'
      }
      setTestResult(errorResult)
      console.error('❌ Login test error:', error)
    }
  }

  const testHealth = async () => {
    try {
      const response = await fetch('https://analyticsco-backend-production.up.railway.app/health')
      const data = await response.json()
      console.log('Health check:', data)
      alert('Health check successful - see console for details')
    } catch (error) {
      console.error('Health check error:', error)
      alert('Health check failed - see console for details')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Login Debug Tool</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({...credentials, email: e.target.value})}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password:</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={testLogin}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Test Login
          </button>
          <button
            onClick={testHealth}
            className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Test Health
          </button>
        </div>
      </div>
      
      {testResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="font-bold mb-2">Test Result:</h3>
          <pre className="text-xs overflow-auto max-h-64">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Backend URL:</strong> https://analyticsco-backend-production.up.railway.app</p>
        <p><strong>Check console for detailed logs</strong></p>
      </div>
    </div>
  )
}

export default LoginDebug