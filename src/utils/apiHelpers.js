export const handleApiError = (error) => {
  if (!error.response) {
    return 'Network error - please check your connection'
  }
  
  const status = error.response.status
  const detail = error.response.data?.detail
  
  switch (status) {
    case 400:
      return detail || 'Invalid request'
    case 401:
      return 'Authentication required'
    case 403:
      return 'Access forbidden'
    case 404:
      return detail || 'Resource not found'
    case 422:
      return detail || 'Validation error'
    case 500:
      return 'Server error - please try again later'
    default:
      return detail || 'An unexpected error occurred'
  }
}

export const createApiResponse = async (apiCall) => {
  try {
    const data = await apiCall()
    return { success: true, data }
  } catch (error) {
    return { 
      success: false, 
      error: handleApiError(error) 
    }
  }
}

// Utility for downloading files with proper error handling
export const downloadFile = (blob, filename) => {
  try {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to download file' }
  }
}

// Utility for formatting API dates
export const formatApiDate = (dateString) => {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString()
}

export const formatApiDateTime = (dateString) => {
  if (!dateString) return null
  return new Date(dateString).toLocaleString()
}