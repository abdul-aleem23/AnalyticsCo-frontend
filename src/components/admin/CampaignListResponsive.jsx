import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { adminAPI } from '../../services/api'
import ConfirmModal from '../ui/ConfirmModal'
import {
  EyeIcon,
  QrCodeIcon,
  ArchiveBoxIcon,
  LinkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ArrowUturnLeftIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

const CampaignListResponsive = ({ campaigns, onRefetch }) => {
  const [loadingStates, setLoadingStates] = useState({})
  const [showArchived, setShowArchived] = useState(false)
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, campaignId: null })

  // Separate active and archived campaigns
  const activeCampaigns = campaigns.filter(campaign => !campaign.archived)
  const archivedCampaigns = campaigns.filter(campaign => campaign.archived)

  // Mutations
  const archiveMutation = useMutation({
    mutationFn: adminAPI.archiveCampaign,
    onSuccess: () => onRefetch()
  })

  const unarchiveMutation = useMutation({
    mutationFn: adminAPI.unarchiveCampaign,
    onSuccess: () => onRefetch()
  })

  const toggleAccessMutation = useMutation({
    mutationFn: ({ campaignId, enabled }) => adminAPI.toggleClientAccess(campaignId, enabled),
    onSuccess: () => onRefetch()
  })

  const setLoading = (campaignId, action, loading) => {
    setLoadingStates(prev => ({
      ...prev,
      [`${campaignId}-${action}`]: loading
    }))
  }

  const handleArchive = (campaignId) => {
    setConfirmModal({
      isOpen: true,
      action: 'archive',
      campaignId,
      title: 'Archive Campaign',
      message: 'Are you sure you want to archive this campaign? It will be hidden from active campaigns but can be restored later.',
      confirmText: 'Archive',
      type: 'warning'
    })
  }

  const executeArchive = async (campaignId) => {
    setLoading(campaignId, 'archive', true)
    try {
      await archiveMutation.mutateAsync(campaignId)
      toast.success('Campaign archived successfully')
    } catch (error) {
      toast.error('Failed to archive campaign')
    } finally {
      setLoading(campaignId, 'archive', false)
    }
  }

  const handleUnarchive = (campaignId) => {
    setConfirmModal({
      isOpen: true,
      action: 'unarchive',
      campaignId,
      title: 'Restore Campaign',
      message: 'Are you sure you want to restore this campaign? It will be moved back to active campaigns.',
      confirmText: 'Restore',
      type: 'warning'
    })
  }

  const executeUnarchive = async (campaignId) => {
    setLoading(campaignId, 'unarchive', true)
    try {
      await unarchiveMutation.mutateAsync(campaignId)
      toast.success('Campaign restored successfully')
    } catch (error) {
      toast.error('Failed to restore campaign')
    } finally {
      setLoading(campaignId, 'unarchive', false)
    }
  }

  const handleToggleAccess = async (campaignId, currentStatus) => {
    const newStatus = !currentStatus
    setLoading(campaignId, 'access', true)
    
    try {
      await toggleAccessMutation.mutateAsync({ campaignId, enabled: newStatus })
      toast.success(`Client access ${newStatus ? 'enabled' : 'disabled'}`)
    } catch (error) {
      toast.error('Failed to update access status')
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
      toast.success('QR code downloaded successfully')
    } catch (error) {
      toast.error('Failed to download QR code')
    } finally {
      setLoading(campaignId, 'qr', false)
    }
  }

  const copyDashboardLink = (campaignId) => {
    const link = `${window.location.origin}/dashboard/${campaignId}`
    navigator.clipboard.writeText(link).then(() => {
      toast.success('Dashboard link copied to clipboard!')
    }).catch(() => {
      toast.error('Failed to copy link to clipboard')
    })
  }

  const handleConfirmAction = () => {
    const { action, campaignId } = confirmModal
    if (action === 'archive') {
      executeArchive(campaignId)
    } else if (action === 'unarchive') {
      executeUnarchive(campaignId)
    }
    setConfirmModal({ isOpen: false, action: null, campaignId: null })
  }

  const CampaignRow = ({ campaign, isArchived = false }) => (
    <div className="glass-card mb-4 p-4 transition-all duration-200 hover:border-berlin-ubahn/30">
      {/* Mobile & Desktop Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        
        {/* Campaign Info - Full width on mobile, 4 cols on desktop */}
        <div className="lg:col-span-4">
          <div className="flex items-start justify-between lg:block">
            <div className="flex-1 min-w-0">
              <h3 className="font-mono font-semibold text-white text-base lg:text-lg truncate">
                {campaign.business_name}
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-1">
                {campaign.campaign_id}
              </p>
              <p className="text-xs text-gray-500 font-mono mt-1">
                {new Date(campaign.created_at).toLocaleDateString()}
              </p>
            </div>
            
            {/* Status Badge - Mobile only */}
            <div className="lg:hidden ml-2">
              <span className={`px-2 py-1 text-xs font-mono rounded border ${
                campaign.client_access_enabled 
                  ? 'bg-green-900/30 text-green-400 border-green-700' 
                  : 'bg-red-900/30 text-red-400 border-red-700'
              }`}>
                {campaign.client_access_enabled ? 'ON' : 'OFF'}
              </span>
            </div>
          </div>
          
          {isArchived && (
            <span className="inline-block mt-2 px-2 py-1 text-xs font-mono rounded bg-orange-900/30 text-orange-400 border border-orange-700">
              ARCHIVED
            </span>
          )}
        </div>

        {/* Stats - Full width on mobile, 3 cols on desktop */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 gap-4 lg:gap-2">
            <div className="text-center lg:text-left">
              <div className="text-lg lg:text-base font-cyber font-bold" style={{color: 'var(--berlin-ubahn)'}}>
                {campaign.total_scans || 0}
              </div>
              <div className="text-xs font-mono text-gray-400">Scans</div>
            </div>
            <div className="text-center lg:text-left">
              <div className="text-lg lg:text-base font-cyber font-bold" style={{color: 'var(--berlin-ubahn)'}}>
                {campaign.unique_visitors || 0}
              </div>
              <div className="text-xs font-mono text-gray-400">Visitors</div>
            </div>
          </div>
        </div>

        {/* Status - Hidden on mobile, 2 cols on desktop */}
        <div className="hidden lg:block lg:col-span-2">
          <span className={`px-3 py-1 text-xs font-mono rounded border ${
            campaign.client_access_enabled 
              ? 'bg-green-900/30 text-green-400 border-green-700' 
              : 'bg-red-900/30 text-red-400 border-red-700'
          }`}>
            {campaign.client_access_enabled ? 'ACTIVE' : 'DISABLED'}
          </span>
        </div>

        {/* Actions - Full width on mobile, 3 cols on desktop */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-2 lg:grid lg:grid-cols-2 xl:flex xl:flex-wrap gap-1 lg:gap-1">
            
            {/* Quick Actions */}
            <button
              onClick={() => copyDashboardLink(campaign.campaign_id)}
              className="flex items-center justify-center lg:justify-center xl:justify-start px-2 lg:px-1 xl:px-2 py-2 text-xs font-mono bg-gray-700/50 text-gray-300 border border-gray-600 rounded hover:bg-gray-600/50 transition-colors"
              title="Copy Link"
            >
              <LinkIcon className="h-4 w-4 xl:mr-1" />
              <span className="hidden xl:inline">LINK</span>
            </button>

            <button
              onClick={() => handleDownloadQR(campaign.campaign_id)}
              disabled={loadingStates[`${campaign.campaign_id}-qr`]}
              className="flex items-center justify-center lg:justify-center xl:justify-start px-2 lg:px-1 xl:px-2 py-2 text-xs font-mono bg-gray-700/50 text-gray-300 border border-gray-600 rounded hover:bg-gray-600/50 transition-colors disabled:opacity-50"
              title="Download QR"
            >
              <QrCodeIcon className="h-4 w-4 xl:mr-1" />
              <span className="hidden xl:inline">QR</span>
            </button>

            <button
              onClick={() => handleToggleAccess(campaign.campaign_id, campaign.client_access_enabled)}
              disabled={loadingStates[`${campaign.campaign_id}-access`]}
              className="flex items-center justify-center lg:justify-center xl:justify-start px-2 lg:px-1 xl:px-2 py-2 text-xs font-mono bg-blue-900/30 text-blue-400 border border-blue-700 rounded hover:bg-blue-800/30 transition-colors disabled:opacity-50"
              title="Toggle Access"
            >
              <EyeIcon className="h-4 w-4 xl:mr-1" />
              <span className="hidden xl:inline">{campaign.client_access_enabled ? 'OFF' : 'ON'}</span>
            </button>

            {/* Archive/Unarchive */}
            {isArchived ? (
              <button
                onClick={() => handleUnarchive(campaign.campaign_id)}
                disabled={loadingStates[`${campaign.campaign_id}-unarchive`]}
                className="flex items-center justify-center lg:justify-center xl:justify-start px-2 lg:px-1 xl:px-2 py-2 text-xs font-mono bg-green-900/30 text-green-400 border border-green-700 rounded hover:bg-green-800/30 transition-colors disabled:opacity-50"
                title="Unarchive"
              >
                <ArrowUturnLeftIcon className="h-4 w-4 xl:mr-1" />
                <span className="hidden xl:inline">RESTORE</span>
              </button>
            ) : (
              <button
                onClick={() => handleArchive(campaign.campaign_id)}
                disabled={loadingStates[`${campaign.campaign_id}-archive`]}
                className="flex items-center justify-center lg:justify-center xl:justify-start px-2 lg:px-1 xl:px-2 py-2 text-xs font-mono bg-red-900/30 text-red-400 border border-red-700 rounded hover:bg-red-800/30 transition-colors disabled:opacity-50"
                title="Archive"
              >
                <ArchiveBoxIcon className="h-4 w-4 xl:mr-1" />
                <span className="hidden xl:inline">ARCHIVE</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  if (campaigns.length === 0) {
    return (
      <div className="glass-card text-center py-12">
        <div className="max-w-md mx-auto">
          <QrCodeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 font-mono text-lg mb-2">No campaigns found</p>
          <p className="text-sm text-gray-500 font-mono">Create your first campaign to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Active Campaigns */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-cyber text-lg font-bold" style={{color: 'var(--berlin-ubahn)'}}>
            Active Campaigns ({activeCampaigns.length})
          </h3>
        </div>
        
        {activeCampaigns.length === 0 ? (
          <div className="glass-card text-center py-8">
            <p className="text-gray-400 font-mono">No active campaigns</p>
          </div>
        ) : (
          <div className="space-y-0">
            {activeCampaigns.map(campaign => (
              <CampaignRow key={campaign.campaign_id} campaign={campaign} isArchived={false} />
            ))}
          </div>
        )}
      </div>

      {/* Archived Campaigns */}
      {archivedCampaigns.length > 0 && (
        <div>
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="flex items-center space-x-2 font-cyber text-lg font-bold text-gray-400 hover:text-berlin-ubahn transition-colors mb-4"
          >
            {showArchived ? (
              <ChevronDownIcon className="h-5 w-5" />
            ) : (
              <ChevronRightIcon className="h-5 w-5" />
            )}
            <span>Archived Campaigns ({archivedCampaigns.length})</span>
          </button>

          {showArchived && (
            <div className="space-y-0">
              {archivedCampaigns.map(campaign => (
                <CampaignRow key={campaign.campaign_id} campaign={campaign} isArchived={true} />
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, action: null, campaignId: null })}
        onConfirm={handleConfirmAction}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        type={confirmModal.type}
      />
    </div>
  )
}

export default CampaignListResponsive