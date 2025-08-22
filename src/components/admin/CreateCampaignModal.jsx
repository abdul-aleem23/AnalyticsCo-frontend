import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { adminAPI } from '../../services/api'
import { XMarkIcon } from '@heroicons/react/24/outline'

const CreateCampaignModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    business_name: '',
    target_url: '',
    description: ''
  })
  const [errors, setErrors] = useState({})

  const createMutation = useMutation({
    mutationFn: adminAPI.createCampaign,
    onSuccess: (data) => {
      onSuccess(data)
      setFormData({
        business_name: '',
        target_url: '',
        description: ''
      })
      setErrors({})
    },
    onError: (error) => {
      setErrors({
        submit: error.response?.data?.detail || 'Failed to create campaign'
      })
    }
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.business_name.trim()) {
      newErrors.business_name = 'Business name is required'
    }
    
    if (!formData.target_url.trim()) {
      newErrors.target_url = 'Target URL is required'
    } else {
      try {
        new URL(formData.target_url)
      } catch {
        newErrors.target_url = 'Please enter a valid URL'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    createMutation.mutate(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{backgroundColor: 'rgba(13, 2, 8, 0.8)'}}>
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}></div>

        <div className="inline-block align-bottom glass-card text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-cyber font-bold" style={{color: 'var(--berlin-ubahn)'}}>
                [CREATE] New Campaign
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-berlin-ubahn transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.submit && (
                <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-md text-sm font-mono">
                  [ERROR] {errors.submit}
                </div>
              )}

              <div>
                <label htmlFor="business_name" className="block text-sm font-mono text-gray-300 mb-2 uppercase tracking-wider">
                  Business_Name *
                </label>
                <input
                  type="text"
                  id="business_name"
                  name="business_name"
                  value={formData.business_name}
                  onChange={handleChange}
                  className={`block w-full border-2 rounded-md px-4 py-3 shadow-sm focus:outline-none text-white font-mono bg-gray-800/50 focus:border-berlin-ubahn focus:ring-2 focus:ring-berlin-ubahn/50 transition-all ${
                    errors.business_name ? 'border-red-600' : 'border-gray-600'
                  }`}
                  placeholder="e.g. Acme Restaurant"
                />
                {errors.business_name && (
                  <p className="mt-2 text-sm text-red-400 font-mono">[ERROR] {errors.business_name}</p>
                )}
              </div>

              <div>
                <label htmlFor="target_url" className="block text-sm font-mono text-gray-300 mb-2 uppercase tracking-wider">
                  Target_URL *
                </label>
                <input
                  type="url"
                  id="target_url"
                  name="target_url"
                  value={formData.target_url}
                  onChange={handleChange}
                  className={`block w-full border-2 rounded-md px-4 py-3 shadow-sm focus:outline-none text-white font-mono bg-gray-800/50 focus:border-berlin-ubahn focus:ring-2 focus:ring-berlin-ubahn/50 transition-all ${
                    errors.target_url ? 'border-red-600' : 'border-gray-600'
                  }`}
                  placeholder="https://example.com"
                />
                {errors.target_url && (
                  <p className="mt-2 text-sm text-red-400 font-mono">[ERROR] {errors.target_url}</p>
                )}
                <p className="mt-2 text-xs text-gray-400 font-mono">
                  → Redirect destination after QR scan
                </p>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-mono text-gray-300 mb-2 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="block w-full border-2 border-gray-600 rounded-md px-4 py-3 shadow-sm focus:outline-none text-white font-mono bg-gray-800/50 focus:border-berlin-ubahn focus:ring-2 focus:ring-berlin-ubahn/50 transition-all resize-none"
                  placeholder="Optional campaign description..."
                />
              </div>
            </form>
          </div>

          <div className="px-4 py-4 sm:px-6 sm:flex sm:flex-row-reverse sm:space-x-reverse sm:space-x-3 space-y-3 sm:space-y-0">
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={createMutation.isPending}
              className={`w-full berlin-btn inline-flex justify-center sm:w-auto ${
                createMutation.isPending
                  ? 'opacity-50 cursor-not-allowed transform-none'
                  : ''
              }`}
            >
              {createMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 mr-2" style={{borderColor: 'var(--berlin-black)'}}></div>
                  <span className="font-mono">CREATING...</span>
                </>
              ) : (
                <span className="font-mono">CREATE_CAMPAIGN</span>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border-2 border-gray-600 shadow-sm px-4 py-3 bg-gray-800/50 text-base font-medium text-gray-300 hover:bg-gray-700/50 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-berlin-ubahn/50 transition-all sm:w-auto font-mono"
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateCampaignModal