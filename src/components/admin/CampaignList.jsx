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

const CampaignList = ({ campaigns, onRefetch }) => {
  const [loadingStates, setLoadingStates] = useState({})

  // Archive campaign mutation
  const archiveMutation = useMutation({
    mutationFn: adminAPI.archiveCampaign,
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
      <div className="card text-center py-8">
        <p className="text-gray-500">No campaigns found</p>
        <p className="text-sm text-gray-400 mt-2">Create your first campaign to get started</p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campaign
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stats
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr key={campaign.campaign_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {campaign.business_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {campaign.campaign_id}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1 text-gray-400" />
                        {campaign.total_scans || 0}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <span className={`
                      inline-flex px-2 py-1 text-xs font-semibold rounded-full
                      ${campaign.archived 
                        ? 'bg-gray-100 text-gray-800' 
                        : campaign.active 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    `}>
                      {campaign.archived ? 'Archived' : campaign.active ? 'Active' : 'Inactive'}
                    </span>
                    
                    <div>
                      <span className={`
                        inline-flex px-2 py-1 text-xs font-semibold rounded-full
                        ${campaign.client_access_enabled 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-red-100 text-red-800'
                        }
                      `}>
                        {campaign.client_access_enabled ? 'Access On' : 'Access Off'}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyDashboardLink(campaign.campaign_id)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Copy dashboard link"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDownloadQR(campaign.campaign_id)}
                      disabled={loadingStates[`${campaign.campaign_id}-qr`]}
                      className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                      title="Download QR code"
                    >
                      <QrCodeIcon className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleToggleAccess(campaign.campaign_id, campaign.client_access_enabled)}
                      disabled={loadingStates[`${campaign.campaign_id}-access`]}
                      className={`${
                        campaign.client_access_enabled 
                          ? 'text-red-600 hover:text-red-900' 
                          : 'text-green-600 hover:text-green-900'
                      } disabled:opacity-50`}
                      title={campaign.client_access_enabled ? 'Disable access' : 'Enable access'}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>

                    {!campaign.archived && (
                      <button
                        onClick={() => handleArchive(campaign.campaign_id)}
                        disabled={loadingStates[`${campaign.campaign_id}-archive`]}
                        className="text-gray-600 hover:text-gray-900 disabled:opacity-50"
                        title="Archive campaign"
                      >
                        <ArchiveBoxIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default CampaignList