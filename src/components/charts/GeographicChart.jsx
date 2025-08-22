import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const GeographicChart = ({ data }) => {
  // Transform geographic_data for Recharts - get top 8 cities for mobile
  const chartData = data?.geographic_data?.slice(0, 8).map(item => ({
    city: item.city || 'Unknown',
    scans: item.scans || 0,
    country: item.country || ''
  })) || []

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="glass-card border-0 shadow-lg">
          <p className="font-pixel text-sm mb-1" style={{color: 'var(--berlin-ubahn)'}}>
            {label}
          </p>
          <p className="font-cyber text-xs text-gray-300 mb-1">
            {data.country}
          </p>
          <p className="font-cyber text-xs" style={{color: payload[0].color}}>
            Scans: {payload[0].value}
          </p>
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
            Top Cities
          </h3>
          <p className="font-pixel text-sm text-gray-400">
            Geographic distribution
          </p>
        </div>
        
        {/* Total locations indicator */}
        <div className="mt-2 sm:mt-0">
          <span className="font-pixel text-xs text-gray-400">
            {data?.geographic_data?.length || 0} locations
          </span>
        </div>
      </div>

      {/* Chart Container - Mobile optimized */}
      <div className="h-64 sm:h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 20,
            }}
            layout="horizontal"
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="var(--berlin-ubahn)" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="var(--berlin-ubahn)" stopOpacity={0.4}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.1)" 
              horizontal={false}
              vertical={true}
            />
            
            <XAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ 
                fontSize: 11, 
                fill: 'var(--berlin-gray)',
                fontFamily: 'VT323, monospace'
              }}
            />
            
            <YAxis 
              type="category"
              dataKey="city"
              axisLine={false}
              tickLine={false}
              tick={{ 
                fontSize: 10, 
                fill: 'var(--berlin-gray)',
                fontFamily: 'VT323, monospace'
              }}
              width={60}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Bar
              dataKey="scans"
              fill="url(#barGradient)"
              stroke="var(--berlin-ubahn)"
              strokeWidth={1}
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Quick stats */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
        <div className="text-center">
          <p className="font-cyber text-sm font-bold" style={{color: 'var(--berlin-ubahn)'}}>
            {chartData[0]?.city || 'N/A'}
          </p>
          <p className="font-pixel text-xs text-gray-400">Top City</p>
        </div>
        <div className="text-center">
          <p className="font-cyber text-sm font-bold" style={{color: 'var(--berlin-ubahn)'}}>
            {chartData[0]?.scans || 0}
          </p>
          <p className="font-pixel text-xs text-gray-400">Top Scans</p>
        </div>
        <div className="text-center">
          <p className="font-cyber text-sm font-bold" style={{color: 'var(--berlin-ubahn)'}}>
            {chartData.reduce((sum, item) => sum + item.scans, 0)}
          </p>
          <p className="font-pixel text-xs text-gray-400">Total</p>
        </div>
      </div>
    </div>
  )
}

export default GeographicChart