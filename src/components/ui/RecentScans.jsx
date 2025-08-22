import React from 'react'
import { 
  DevicePhoneMobileIcon, 
  ComputerDesktopIcon,
  DeviceTabletIcon
} from '@heroicons/react/24/outline'

const RecentScans = ({ data }) => {
  const getDeviceIcon = (deviceType) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return DevicePhoneMobileIcon
      case 'desktop':
        return ComputerDesktopIcon
      case 'tablet':
        return DeviceTabletIcon
      default:
        return DevicePhoneMobileIcon
    }
  }

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString()
  }

  if (!data || data.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No recent scans to display</p>
          <p className="text-sm text-gray-400 mt-2">
            Activity will appear here as people scan your QR codes
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
      <div className="space-y-4">
        {data.slice(0, 10).map((scan, index) => {
          const DeviceIcon = getDeviceIcon(scan.device_type)
          return (
            <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50">
              <div className="flex-shrink-0">
                <div className="bg-white p-2 rounded-lg border">
                  <DeviceIcon className="h-5 w-5 text-gray-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {scan.city || 'Unknown Location'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {scan.device_type || 'Unknown Device'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(scan.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {data.length > 10 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Showing 10 most recent scans of {data.length} total
          </p>
        </div>
      )}
    </div>
  )
}

export default RecentScans