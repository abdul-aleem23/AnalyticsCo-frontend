import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { adminAPI } from '../../services/api'
import {
  EyeIcon,
  QrCodeIcon,
  ArchiveBoxIcon,
  LinkIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

const CampaignListMobile = ({ campaigns, onRefetch }) => {
  const [loadingStates, setLoadingStates] = useState({})

  // Archive campaign mutation
  const archiveMutation = useMutation({
    mutationFn: adminAPI.archiveCampaign,
    onSuccess: () => {
      onRefetch()
    }
  })

  // Unarchive campaign mutation
  const unarchiveMutation = useMutation({
    mutationFn: adminAPI.unarchiveCampaign,
    onSuccess: () => {
      onRefetch()
    }
  })

  // Toggle access mutation
  const toggleAccessMutation = useMutation({
    mutationFn: ({ campaignId, enabled }) => adminAPI.toggleClientAccess(campaignId, enabled),
    onSuccess: () => {
      onRefetch()
    }
  })

  const setLoading = (campaignId, action, loading) => {
    setLoadingStates(prev => ({
      ...prev,
      [`${campaignId}-${action}`]: loading
    }))
  }

  const handleArchive = async (campaignId) => {
    if (!confirm('Are you sure you want to archive this campaign?')) return
    
    setLoading(campaignId, 'archive', true)
    try {
      await archiveMutation.mutateAsync(campaignId)
    } catch (error) {
      alert('Failed to archive campaign')
    } finally {
      setLoading(campaignId, 'archive', false)
    }
  }

  const handleUnarchive = async (campaignId) => {
    if (!confirm('Are you sure you want to unarchive this campaign?')) return
    
    setLoading(campaignId, 'unarchive', true)
    try {
      await unarchiveMutation.mutateAsync(campaignId)
    } catch (error) {
      alert('Failed to unarchive campaign')
    } finally {
      setLoading(campaignId, 'unarchive', false)
    }
  }

  const handleToggleAccess = async (campaignId, currentStatus) => {
    const newStatus = !currentStatus
    setLoading(campaignId, 'access', true)
    
    try {
      await toggleAccessMutation.mutateAsync({ campaignId, enabled: newStatus })
    } catch (error) {
      alert('Failed to update access status')
    } finally {
      setLoading(campaignId, 'access', false)
    }
  }

  const handleDownloadQR = async (campaignId) => {
    setLoading(campaignId, 'qr', true)
    try {
      const blob = await adminAPI.getCampaignQR(campaignId)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${campaignId}-qr.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      alert('Failed to download QR code')
    } finally {
      setLoading(campaignId, 'qr', false)
    }
  }

  const copyDashboardLink = (campaignId) => {
    const link = `${window.location.origin}/dashboard/${campaignId}`
    navigator.clipboard.writeText(link).then(() => {
      alert('Dashboard link copied to clipboard!')
    })
  }

  if (campaigns.length === 0) {
    return (
      <div className="glass-card text-center py-8">
        <p className="text-gray-400 font-mono">No campaigns found</p>
        <p className="text-sm text-gray-500 font-mono mt-2">Create your first campaign to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table - Hidden on mobile */}
      <div className="hidden lg:block glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-mono text-gray-300 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-mono text-gray-300 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-mono text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-mono text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {campaigns.map((campaign) => (
                <tr key={campaign.campaign_id} className={`hover:bg-gray-800/20 transition-colors ${
                  campaign.archived ? 'opacity-60 bg-red-900/10' : ''
                }`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-mono font-semibold text-white">
                        {campaign.business_name}
                      </div>
                      <div className="text-sm text-gray-400 font-mono">
                        ID: {campaign.campaign_id}
                      </div>
                      <div className="text-xs text-gray-500 font-mono mt-1">
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300 font-mono">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          {campaign.total_scans || 0}
                        </span>
                        <span className="text-gray-400">|</span>
                        <span>{campaign.unique_visitors || 0} visitors</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-mono rounded-md border ${
                        campaign.client_access_enabled 
                          ? 'bg-green-900/30 text-green-400 border-green-700' 
                          : 'bg-red-900/30 text-red-400 border-red-700'
                      }`}>
                        {campaign.client_access_enabled ? 'ACTIVE' : 'DISABLED'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyDashboardLink(campaign.campaign_id)}
                        className="p-2 text-gray-400 hover:text-berlin-ubahn transition-colors"
                        title="Copy Dashboard Link"
                      >
                        <LinkIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadQR(campaign.campaign_id)}
                        disabled={loadingStates[`${campaign.campaign_id}-qr`]}
                        className="p-2 text-gray-400 hover:text-berlin-ubahn transition-colors disabled:opacity-50"
                        title="Download QR Code"
                      >
                        <QrCodeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleToggleAccess(campaign.campaign_id, campaign.client_access_enabled)}
                        disabled={loadingStates[`${campaign.campaign_id}-access`]}
                        className="p-2 text-gray-400 hover:text-berlin-ubahn transition-colors disabled:opacity-50"
                        title="Toggle Access"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleArchive(campaign.campaign_id)}
                        disabled={loadingStates[`${campaign.campaign_id}-archive`]}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Archive Campaign"
                      >
                        <ArchiveBoxIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards - Hidden on desktop */}
      <div className="lg:hidden space-y-4">
        {campaigns.map((campaign) => (
          <div key={campaign.campaign_id} className={`stat-card ${
            campaign.archived ? 'opacity-75 bg-red-900/5 border-red-900/20' : ''
          }`}>
            {/* Header */}
            <div className="flex flex-col space-y-2 mb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-mono font-semibold text-white truncate">
                      {campaign.business_name}
                    </h3>
                    {campaign.archived && (
                      <span className="px-2 py-1 text-xs font-mono rounded-md bg-red-900/30 text-red-400 border border-red-700">
                        ARCHIVED
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 font-mono">
                    ID: {campaign.campaign_id}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    Created: {new Date(campaign.created_at).toLocaleDateString()}
                    {campaign.archived && campaign.archived_at && (
                      <span className="ml-2 text-red-400">
                        • Archived: {new Date(campaign.archived_at).toLocaleDateString()}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className={`px-2 py-1 text-xs font-mono rounded-md border ${
                    campaign.client_access_enabled 
                      ? 'bg-green-900/30 text-green-400 border-green-700' 
                      : 'bg-red-900/30 text-red-400 border-red-700'
                  }`}>
                    {campaign.client_access_enabled ? 'ACCESS ON' : 'ACCESS OFF'}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-cyber font-bold" style={{color: 'var(--berlin-ubahn)'}}>
                  {campaign.total_scans || 0}
                </div>
                <div className="text-xs font-mono text-gray-400">Total Scans</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-cyber font-bold" style={{color: 'var(--berlin-ubahn)'}}>
                  {campaign.unique_visitors || 0}
                </div>
                <div className="text-xs font-mono text-gray-400">Unique Visitors</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => copyDashboardLink(campaign.campaign_id)}
                className="flex-1 min-w-0 berlin-btn py-2 px-3 text-sm"
              >
                <LinkIcon className="h-4 w-4 mr-1" />
              </button>
              <button
                onClick={() => handleDownloadQR(campaign.campaign_id)}
                disabled={loadingStates[`${campaign.campaign_id}-qr`]}
                className="flex-1 min-w-0 berlin-btn py-2 px-3 text-sm disabled:opacity-50"
              >
                <QrCodeIcon className="h-4 w-4 mr-1" />
              </button>
              <button
                onClick={() => handleToggleAccess(campaign.campaign_id, campaign.client_access_enabled)}
                disabled={loadingStates[`${campaign.campaign_id}-access`]}
                className="px-3 py-2 text-xs font-mono bg-gray-700/50 text-gray-300 border border-gray-600 rounded hover:bg-gray-600/50 transition-colors disabled:opacity-50"
              >
                {campaign.client_access_enabled ? 'DISABLE' : 'ENABLE'}
              </button>
              <button
                onClick={() => handleArchive(campaign.campaign_id)}
                disabled={loadingStates[`${campaign.campaign_id}-archive`]}
                className="px-3 py-2 text-xs font-mono bg-red-900/30 text-red-400 border border-red-700 rounded hover:bg-red-800/30 transition-colors disabled:opacity-50"
              >
                ARCHIVE
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CampaignListMobile