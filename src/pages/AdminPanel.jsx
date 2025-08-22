import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import { adminAPI } from '../services/api'

// Components
import AdminHeader from '../components/admin/AdminHeader'
import DashboardStats from '../components/admin/DashboardStats'
import CampaignListResponsive from '../components/admin/CampaignListResponsive'
import CreateCampaignModal from '../components/admin/CreateCampaignModal'

const AdminPanel = () => {
  const { user } = useAuth()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [includeArchived, setIncludeArchived] = useState(false)

  // Get dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: adminAPI.getDashboardStats,
    refetchInterval: 60000 // Refetch every minute
  })

  // Get campaigns
  const { data: campaigns, isLoading: campaignsLoading, refetch: refetchCampaigns } = useQuery({
    queryKey: ['adminCampaigns', includeArchived],
    queryFn: () => adminAPI.getCampaigns(includeArchived),
    refetchInterval: 30000 // Refetch every 30 seconds
  })

  const handleCampaignCreated = () => {
    setShowCreateModal(false)
    refetchCampaigns()
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: 'var(--berlin-black)'}}>
      <AdminHeader 
        user={user}
        onCreateCampaign={() => setShowCreateModal(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Dashboard Stats */}
          <section>
            <h2 className="text-lg font-cyber font-bold mb-4" style={{color: 'var(--berlin-ubahn)'}}>
              [SYSTEM] Overview
            </h2>
            {statsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{borderColor: 'var(--berlin-ubahn)'}}></div>
              </div>
            ) : (
              <DashboardStats data={stats} />
            )}
          </section>

          {/* Campaign Management */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-2 sm:space-y-0">
              <h2 className="text-lg font-cyber font-bold" style={{color: 'var(--berlin-ubahn)'}}>
                [CAMPAIGNS] Management
              </h2>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={includeArchived}
                    onChange={(e) => setIncludeArchived(e.target.checked)}
                    className="rounded border-gray-600 bg-gray-800 text-berlin-ubahn focus:border-berlin-ubahn focus:ring focus:ring-berlin-ubahn/50"
                  />
                  <span className="ml-2 text-sm font-mono text-gray-400">Show_Archived</span>
                </label>
              </div>
            </div>

            {campaignsLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{borderColor: 'var(--berlin-ubahn)'}}></div>
              </div>
            ) : (
              <CampaignListResponsive 
                campaigns={campaigns || []} 
                onRefetch={refetchCampaigns}
              />
            )}
          </section>
        </div>
      </main>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <CreateCampaignModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCampaignCreated}
        />
      )}
    </div>
  )
}

export default AdminPanel