import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { publicAPI } from '../services/api'

// Chart components
import AnalyticsCharts from '../components/charts/AnalyticsCharts'
import KPICards from '../components/ui/KPICards'
import RecentScans from '../components/ui/RecentScans'
import ExportButton from '../components/ui/ExportButton'

const Dashboard = () => {
  const { campaignId } = useParams()

  // Validate campaign and check access
  const { data: validation, isLoading: validationLoading, error: validationError } = useQuery({
    queryKey: ['validateCampaign', campaignId],
    queryFn: () => publicAPI.validateCampaign(campaignId),
    enabled: !!campaignId,
    retry: false
  })

  // Get campaign analytics - reduced interval for real-time feel
  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refreshData } = useQuery({
    queryKey: ['campaignStats', campaignId],
    queryFn: () => publicAPI.getCampaignStats(campaignId),
    enabled: !!campaignId && validation?.exists && validation?.access_enabled,
    refetchInterval: 20000 // Refetch every 20 seconds for real-time updates
  })

  if (!campaignId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Campaign URL</h1>
          <p className="text-gray-600">
            Please access your campaign using: /dashboard/YOUR_CAMPAIGN_ID
          </p>
        </div>
      </div>
    )
  }

  if (validationLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (validationError || !validation?.exists) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Campaign Not Found</h1>
          <p className="text-gray-600 mb-4">
            The campaign "{campaignId}" does not exist or has been removed.
          </p>
          <p className="text-sm text-gray-500">
            Please check your Campaign ID or contact your marketing agency.
          </p>
        </div>
      </div>
    )
  }

  if (!validation.access_enabled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-orange-600 mb-4">Access Disabled</h1>
          <p className="text-gray-600 mb-4">
            Dashboard access for this campaign has been temporarily disabled.
          </p>
          <p className="text-sm text-gray-500">
            Please contact your marketing agency for assistance.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--berlin-black)'}}>
      {/* Berlin-themed Header */}
      <header className="glass-card rounded-none border-l-0 border-r-0 border-t-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Digital Terminal Style Title */}
            <div>
              <div className="font-cyber text-2xl sm:text-3xl font-bold mb-2" style={{color: 'var(--berlin-ubahn)'}}>
                <span className="font-mono">[</span>ANALYTICS<span className="font-mono">]</span>
              </div>
              <div className="font-mono text-lg sm:text-xl font-semibold text-gray-300 mb-1">
                {validation.business_name || 'Campaign Monitor'}
              </div>
              <div className="font-terminal text-sm text-gray-400">
                &gt; Campaign_Analytics.exe
              </div>
              <div className="font-mono text-sm text-gray-500 mt-1">
                ID: {campaignId}
              </div>
            </div>
            
            {/* Action buttons - stacked on mobile */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <ExportButton campaignId={campaignId} />
              <a 
                href="/privacy-policy" 
                className="font-terminal text-xs text-gray-400 hover:text-berlin-ubahn transition-colors"
                target="_blank" 
                rel="noopener noreferrer"
              >
                Privacy_Policy.txt
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Mobile-first padding */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {statsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{borderColor: 'var(--berlin-ubahn)'}}></div>
          </div>
        ) : statsError ? (
          <div className="text-center py-12">
            <div className="glass-card max-w-md mx-auto">
              <h2 className="font-cyber text-lg font-bold mb-2" style={{color: '#EF4444'}}>
                [ERROR] Loading Analytics
              </h2>
              <p className="font-mono text-sm text-gray-400">
                Unable to load campaign statistics. Please refresh the page.
              </p>
            </div>
          </div>
        ) : stats ? (
          <div className="space-y-6 sm:space-y-8">
            {/* KPI Cards - Mobile priority */}
            <KPICards data={stats} />
            
            {/* Charts Section - Pass refresh function for real-time */}
            <AnalyticsCharts 
              data={stats} 
              campaignId={campaignId}
              refreshData={refreshData}
            />
            
            {/* Recent Activity - Mobile optimized */}
            <RecentScans data={stats.recent_scans || []} />
          </div>
        ) : null}
      </main>

      {/* Berlin-themed Footer */}
      <footer className="glass-card rounded-none border-l-0 border-r-0 border-b-0 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="font-terminal text-sm text-gray-400 mb-2">
              &gt; QR_Analytics_Platform.exe - Real-time Campaign Tracking
            </div>
            <div className="font-mono text-xs text-gray-500">
              [SYSTEM] Last_Update: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard