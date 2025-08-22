import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { publicAPI } from '../../services/api'

const ExportButton = ({ campaignId }) => {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async () => {
    if (!campaignId || isExporting) return

    setIsExporting(true)
    try {
      const blob = await publicAPI.exportCampaignData(campaignId)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `campaign-${campaignId}-analytics.xlsx`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      toast.success('Analytics data exported successfully!')
      
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Export failed. Please try again or contact support.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`
        berlin-btn inline-flex items-center text-sm font-medium
        ${isExporting 
          ? 'opacity-50 cursor-not-allowed transform-none' 
          : ''
        }
      `}
    >
      <ArrowDownTrayIcon className={`h-4 w-4 mr-2 ${isExporting ? 'animate-bounce' : ''}`} />
      <span className="font-mono">
        {isExporting ? 'EXPORTING...' : 'EXPORT_DATA.xlsx'}
      </span>
    </button>
  )
}

export default ExportButton