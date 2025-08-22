import { useState, useEffect, useCallback } from 'react'
import { publicAPI } from '../services/api'

export const usePublicCampaign = (campaignId) => {
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const validateCampaign = useCallback(async () => {
    if (!campaignId) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await publicAPI.validateCampaign(campaignId)
      setCampaign(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Campaign not found')
    } finally {
      setLoading(false)
    }
  }, [campaignId])

  useEffect(() => {
    validateCampaign()
  }, [validateCampaign])

  return {
    campaign,
    loading,
    error,
    refresh: validateCampaign
  }
}

export const usePublicCampaignStats = (campaignId) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = useCallback(async () => {
    if (!campaignId) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await publicAPI.getCampaignStats(campaignId)
      setStats(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch campaign stats')
    } finally {
      setLoading(false)
    }
  }, [campaignId])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refresh: fetchStats
  }
}