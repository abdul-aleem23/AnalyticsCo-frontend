import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { PlusIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

const AdminHeader = ({ user, onCreateCampaign }) => {
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="glass-card rounded-none border-l-0 border-r-0 border-t-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-6 space-y-4 sm:space-y-0">
          <div>
            <div className="font-cyber text-2xl sm:text-3xl font-bold mb-2" style={{color: 'var(--berlin-ubahn)'}}>
              <span className="font-mono">[</span>ADMIN<span className="font-mono">]</span>
            </div>
            <div className="font-terminal text-sm text-gray-400">
              &gt; QR_Analytics_Platform_Management.exe
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={onCreateCampaign}
              className="berlin-btn inline-flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              <span className="font-mono">CREATE_CAMPAIGN</span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-mono" style={{color: 'var(--berlin-ubahn)'}}>
                  {user?.email}
                </p>
                <p className="text-xs font-terminal text-gray-500">[ADMINISTRATOR]</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-berlin-ubahn transition-colors"
                title="Sign out"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader