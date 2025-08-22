import React, { useState, useEffect } from 'react'
import ScanTrends from './ScanTrends'
import GeographicChart from './GeographicChart'
import DeviceChart from './DeviceChart'
import PeakHours from './PeakHours'

const AnalyticsCharts = ({ data, campaignId, refreshData }) => {
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Real-time polling every 20 seconds
  useEffect(() => {
    if (!campaignId || !refreshData) return

    const interval = setInterval(() => {
      refreshData()
      setLastUpdate(new Date())
    }, 20000) // 20 seconds for real-time feel

    return () => clearInterval(interval)
  }, [campaignId, refreshData])

  return (
    <div className="space-y-6">
      {/* Real-time indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-terminal text-xs text-green-400">LIVE DATA</span>
        </div>
        <span className="font-mono text-xs text-gray-400">
          Updated: {lastUpdate.toLocaleTimeString()}
        </span>
      </div>

      {/* Mobile-first grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scan Trends - Full width on mobile, takes priority */}
        <div className="lg:col-span-2">
          <ScanTrends data={data} />
        </div>

        {/* Geographic Chart - Mobile optimized */}
        <div>
          <GeographicChart data={data} />
        </div>

        {/* Device Chart - Responsive pie chart */}
        <div>
          <DeviceChart data={data} />
        </div>

        {/* Peak Hours - Full width for better hourly visualization */}
        <div className="lg:col-span-2">
          <PeakHours data={data} />
        </div>
      </div>
    </div>
  )
}

export default AnalyticsCharts