import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const PeakHours = ({ data }) => {
  // Transform hourly_data for Recharts
  const chartData = data?.hourly_data?.map(item => ({
    hour: `${item.hour.toString().padStart(2, '0')}:00`,
    scans: item.scans || 0,
    isPeak: item.scans === Math.max(...(data?.hourly_data?.map(h => h.scans) || [0]))
  })) || []

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="glass-card border-0 shadow-lg">
          <p className="font-pixel text-sm mb-1" style={{color: 'var(--berlin-ubahn)'}}>
            {label}
          </p>
          <p className="font-cyber text-xs" style={{color: payload[0].color}}>
            {payload[0].value} scans
          </p>
          {data.isPeak && (
            <p className="font-pixel text-xs text-green-400 mt-1">
              🔥 Peak Hour
            </p>
          )}
        </div>
      )
    }
    return null
  }

  // Find peak hour for stats
  const peakHour = chartData.find(item => item.isPeak)
  const totalHourlyScans = chartData.reduce((sum, item) => sum + item.scans, 0)
  const avgHourlyScans = totalHourlyScans / chartData.length || 0

  return (
    <div className="glass-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="font-cyber text-lg font-bold mb-1" style={{color: 'var(--berlin-ubahn)'}}>
            Peak Hours
          </h3>
          <p className="font-pixel text-sm text-gray-400">
            24-hour activity pattern
          </p>
        </div>
        
        {/* Peak indicator */}
        <div className="mt-2 sm:mt-0">
          <span className="font-pixel text-xs" style={{color: 'var(--berlin-ubahn)'}}>
            Peak: {peakHour?.hour || 'N/A'}
          </span>
        </div>
      </div>

      {/* Chart Container - Mobile optimized */}
      <div className="h-48 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 10,
            }}
          >
            <defs>
              <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--berlin-ubahn)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--berlin-ubahn)" stopOpacity={0.3}/>
              </linearGradient>
              <linearGradient id="peakGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.9}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.4}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.1)" 
              horizontal={true}
              vertical={false}
            />
            
            <XAxis 
              dataKey="hour"
              axisLine={false}
              tickLine={false}
              tick={{ 
                fontSize: 9, 
                fill: 'var(--berlin-gray)',
                fontFamily: 'VT323, monospace'
              }}
              interval={window.innerWidth < 640 ? 2 : 1} // Show fewer ticks on mobile
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fontSize: 10, 
                fill: 'var(--berlin-gray)',
                fontFamily: 'VT323, monospace'
              }}
              width={25}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Bar
              dataKey="scans"
              fill={(entry) => entry.isPeak ? "url(#peakGradient)" : "url(#hourlyGradient)"}
              stroke="var(--berlin-ubahn)"
              strokeWidth={1}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick stats - Mobile grid */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <p className="font-cyber text-sm font-bold" style={{color: 'var(--berlin-ubahn)'}}>
            {peakHour?.hour || 'N/A'}
          </p>
          <p className="font-pixel text-xs text-gray-400">Peak Hour</p>
        </div>
        <div className="text-center">
          <p className="font-cyber text-sm font-bold" style={{color: 'var(--berlin-ubahn)'}}>
            {peakHour?.scans || 0}
          </p>
          <p className="font-pixel text-xs text-gray-400">Peak Scans</p>
        </div>
        <div className="text-center">
          <p className="font-cyber text-sm font-bold" style={{color: 'var(--berlin-ubahn)'}}>
            {Math.round(avgHourlyScans)}
          </p>
          <p className="font-pixel text-xs text-gray-400">Avg/Hour</p>
        </div>
      </div>
    </div>
  )
}

export default PeakHours