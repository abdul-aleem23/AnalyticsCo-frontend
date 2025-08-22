import React from 'react'
import {
  FolderIcon,
  EyeIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const DashboardStats = ({ data }) => {
  const stats = [
    {
      name: 'Total_Campaigns',
      value: data?.total_campaigns || 0,
      icon: '📁',
      description: 'All campaigns'
    },
    {
      name: 'Total_Scans',
      value: data?.total_scans || 0,
      icon: '👁️',
      description: 'QR code scans'
    },
    {
      name: 'Active_Campaigns',
      value: data?.active_campaigns || 0,
      icon: '📊',
      description: 'Currently active'
    },
    {
      name: 'Today_Activity',
      value: data?.todays_scans || 0,
      icon: '⏰',
      description: 'Last 24 hours'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div key={stat.name} className="stat-card hover:scale-105 transition-transform duration-200">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{stat.icon}</span>
                <h3 className="font-mono text-sm text-gray-300 uppercase tracking-wider">
                  {stat.name}
                </h3>
              </div>
            </div>
            
            <div className="flex items-end space-x-2">
              <span 
                className="text-2xl sm:text-3xl font-cyber font-bold"
                style={{color: 'var(--berlin-ubahn)'}}
              >
                {stat.value}
              </span>
            </div>
            
            <p className="font-mono text-xs text-gray-500">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DashboardStats