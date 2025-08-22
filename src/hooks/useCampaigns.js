import { useState, useEffect, useCallback } from 'react'
import { adminAPI } from '../services/api'

export const useCampaigns = (includeArchived = false) => {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCampaigns = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminAPI.getCampaigns(includeArchived)
      setCampaigns(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch campaigns')
    } finally {
      setLoading(false)
    }
  }, [includeArchived])

  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  const createCampaign = async (campaignData) => {
    try {
      const newCampaign = await adminAPI.createCampaign(campaignData)
      setCampaigns(prev => [newCampaign, ...prev])
      return { success: true, campaign: newCampaign }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.detail || 'Failed to create campaign' 
      }
    }
  }

  const updateCampaign = async (campaignId, campaignData) => {
    try {
      const updatedCampaign = await adminAPI.updateCampaign(campaignId, campaignData)
      setCampaigns(prev => 
        prev.map(c => c.id === campaignId ? updatedCampaign : c)
      )
      return { success: true, campaign: updatedCampaign }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.detail || 'Failed to update campaign' 
      }
    }
  }

  const archiveCampaign = async (campaignId) => {
    try {
      await adminAPI.archiveCampaign(campaignId)
      if (!includeArchived) {
        setCampaigns(prev => prev.filter(c => c.id !== campaignId))
      } else {
        setCampaigns(prev => 
          prev.map(c => c.id === campaignId ? { ...c, archived: true } : c)
        )
      }
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.detail || 'Failed to archive campaign' 
      }
    }
  }

  const toggleClientAccess = async (campaignId, enabled) => {
    try {
      await adminAPI.toggleClientAccess(campaignId, enabled)
      setCampaigns(prev => 
        prev.map(c => 
          c.id === campaignId ? { ...c, client_access_enabled: enabled } : c
        )
      )
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.detail || 'Failed to toggle client access' 
      }
    }
  }

  return {
    campaigns,
    loading,
    error,
    refresh: fetchCampaigns,
    createCampaign,
    updateCampaign,
    archiveCampaign,
    toggleClientAccess
  }
}

export const useCampaign = (campaignId) => {
  const [campaign, setCampaign] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCampaign = useCallback(async () => {
    if (!campaignId) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await adminAPI.getCampaign(campaignId)
      setCampaign(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch campaign')
    } finally {
      setLoading(false)
    }
  }, [campaignId])

  useEffect(() => {
    fetchCampaign()
  }, [fetchCampaign])

  return {
    campaign,
    loading,
    error,
    refresh: fetchCampaign
  }
}

export const useCampaignStats = (campaignId) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchStats = useCallback(async () => {
    if (!campaignId) return
    
    try {
      setLoading(true)
      setError(null)
      const data = await adminAPI.getCampaignAdminStats(campaignId)
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