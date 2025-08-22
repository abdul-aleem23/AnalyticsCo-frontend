import React from 'react'

const KPICards = ({ data }) => {
  const kpis = [
    {
      title: 'Total Scans',
      value: data?.total_scans || 0,
      icon: '📊',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Unique Visitors',
      value: data?.unique_visitors || 0,
      icon: '👥',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Conversion Rate',
      value: data?.total_scans && data?.unique_visitors 
        ? `${((data.unique_visitors / data.total_scans) * 100).toFixed(1)}%`
        : '0%',
      icon: '⚡',
      change: '+2.1%',
      changeType: 'positive'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {kpis.map((kpi, index) => (
        <div 
          key={index} 
          className="stat-card hover:scale-105 transition-transform duration-200 relative"
        >
          {/* Mobile-first: Stacked layout */}
          <div className="flex flex-col space-y-3 sm:space-y-2">
            {/* Header with icon and title */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{kpi.icon}</span>
                <h3 className="font-mono text-sm text-gray-300 uppercase tracking-wider">
                  {kpi.title}
                </h3>
              </div>
              {/* Change indicator - hidden on very small screens */}
              <span 
                className={`hidden sm:inline-block px-2 py-1 rounded text-xs font-mono ${
                  kpi.changeType === 'positive' 
                    ? 'bg-green-900/30 text-green-400 border border-green-700' 
                    : 'bg-red-900/30 text-red-400 border border-red-700'
                }`}
              >
                {kpi.change}
              </span>
            </div>
            
            {/* Value - Large and prominent */}
            <div className="flex items-end space-x-2">
              <span 
                className="text-3xl sm:text-4xl font-cyber font-bold"
                style={{color: 'var(--berlin-ubahn)'}}
              >
                {kpi.value}
              </span>
            </div>
            
            {/* Change indicator for mobile - below value */}
            <span 
              className={`sm:hidden inline-block px-2 py-1 rounded text-xs font-mono self-start ${
                kpi.changeType === 'positive' 
                  ? 'bg-green-900/30 text-green-400 border border-green-700' 
                  : 'bg-red-900/30 text-red-400 border border-red-700'
              }`}
            >
              {kpi.change}
            </span>
          </div>
          
          {/* Subtle glow effect on hover */}
          <div 
            className="absolute inset-0 rounded-lg opacity-0 hover:opacity-20 transition-opacity duration-200 pointer-events-none"
            style={{
              background: `linear-gradient(45deg, transparent, var(--berlin-ubahn), transparent)`,
              filter: 'blur(10px)'
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default KPICards