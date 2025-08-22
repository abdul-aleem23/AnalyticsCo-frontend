import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

const DeviceChart = ({ data }) => {
  // Transform device_breakdown for Recharts
  const chartData = Object.entries(data?.device_breakdown || {}).map(([device, count]) => ({
    name: device.charAt(0).toUpperCase() + device.slice(1),
    value: count,
    percentage: data?.total_scans ? ((count / data.total_scans) * 100).toFixed(1) : 0
  }))

  // Berlin-themed colors
  const COLORS = [
    'var(--berlin-ubahn)',    // Yellow for primary
    'var(--berlin-steel)',    // Blue for secondary  
    '#10B981',                // Green for tertiary
    '#F59E0B',                // Orange for quaternary
    '#EF4444'                 // Red for others
  ]

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="glass-card border-0 shadow-lg">
          <p className="font-pixel text-sm mb-1" style={{color: 'var(--berlin-ubahn)'}}>
            {data.name}
          </p>
          <p className="font-cyber text-xs text-gray-300">
            {data.value} scans ({data.percentage}%)
          </p>
        </div>
      )
    }
    return null
  }

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180)
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180)

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-cyber text-xs font-bold"
      >
        {`${percentage}%`}
      </text>
    )
  }

  return (
    <div className="glass-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="font-cyber text-lg font-bold mb-1" style={{color: 'var(--berlin-ubahn)'}}>
            Device Types
          </h3>
          <p className="font-pixel text-sm text-gray-400">
            Platform distribution
          </p>
        </div>
        
        {/* Total devices */}
        <div className="mt-2 sm:mt-0">
          <span className="font-pixel text-xs text-gray-400">
            {chartData.reduce((sum, item) => sum + item.value, 0)} total
          </span>
        </div>
      </div>

      {/* Chart Container - Mobile optimized */}
      <div className="h-64 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={window.innerWidth < 640 ? 80 : 100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth={1}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend - Mobile friendly grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-700">
        {chartData.map((entry, index) => (
          <div key={entry.name} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{backgroundColor: COLORS[index % COLORS.length]}}
            ></div>
            <div className="flex-1 min-w-0">
              <p className="font-pixel text-xs text-gray-300 truncate">
                {entry.name}
              </p>
              <p className="font-cyber text-xs font-bold" style={{color: 'var(--berlin-ubahn)'}}>
                {entry.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DeviceChart