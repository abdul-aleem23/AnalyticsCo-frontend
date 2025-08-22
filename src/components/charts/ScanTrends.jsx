import React from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const ScanTrends = ({ data }) => {
  // Transform daily_data for Recharts
  const chartData = data?.daily_data?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }),
    scans: item.scans || 0,
    visitors: item.unique_visitors || 0
  })) || []

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card border-0 shadow-lg">
          <p className="font-pixel text-sm mb-2" style={{color: 'var(--berlin-ubahn)'}}>
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="font-cyber text-xs" style={{color: entry.color}}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="glass-card">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h3 className="font-cyber text-lg font-bold mb-1" style={{color: 'var(--berlin-ubahn)'}}>
            Scan Trends
          </h3>
          <p className="font-mono text-sm text-gray-400">
            Daily performance overview
          </p>
        </div>
        
        {/* Live indicator */}
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-terminal text-xs text-green-400">LIVE</span>
        </div>
      </div>

      {/* Chart Container - Mobile optimized height */}
      <div className="h-64 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 10,
            }}
          >
            <defs>
              {/* Berlin-themed gradients */}
              <linearGradient id="scansGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--berlin-ubahn)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--berlin-ubahn)" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--berlin-steel)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--berlin-steel)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.1)" 
              horizontal={true}
              vertical={false}
            />
            
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fontSize: 11, 
                fill: 'var(--berlin-gray)',
                fontFamily: 'VT323, monospace'
              }}
              // Reduce ticks on mobile
              interval={chartData.length > 10 ? 'preserveStartEnd' : 0}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ 
                fontSize: 11, 
                fill: 'var(--berlin-gray)',
                fontFamily: 'VT323, monospace'
              }}
              width={30}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Primary area - Total scans */}
            <Area
              type="monotone"
              dataKey="scans"
              stroke="var(--berlin-ubahn)"
              strokeWidth={2}
              fill="url(#scansGradient)"
              name="Total Scans"
            />
            
            {/* Secondary area - Unique visitors (only on larger screens) */}
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="var(--berlin-steel)"
              strokeWidth={2}
              fill="url(#visitorsGradient)"
              name="Unique Visitors"
              className="hidden sm:block"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend - Mobile friendly */}
      <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded"
            style={{backgroundColor: 'var(--berlin-ubahn)'}}
          ></div>
          <span className="font-mono text-xs text-gray-300">Total Scans</span>
        </div>
        <div className="hidden sm:flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded"
            style={{backgroundColor: 'var(--berlin-steel)'}}
          ></div>
          <span className="font-mono text-xs text-gray-300">Unique Visitors</span>
        </div>
      </div>
    </div>
  )
}

export default ScanTrends