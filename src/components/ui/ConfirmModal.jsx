import React from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning" // warning, danger
}) => {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-400',
          confirmBtn: 'bg-red-900/30 text-red-400 border-red-700 hover:bg-red-800/30'
        }
      default:
        return {
          icon: 'text-yellow-400',
          confirmBtn: 'bg-yellow-900/30 text-yellow-400 border-yellow-700 hover:bg-yellow-800/30'
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-md w-full p-6 animate-in fade-in duration-200">
        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 ${styles.icon}`}>
            <ExclamationTriangleIcon className="h-8 w-8" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-cyber text-lg font-bold text-white mb-2">
              {title}
            </h3>
            <p className="font-mono text-sm text-gray-300 leading-relaxed">
              {message}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-mono bg-gray-700/50 text-gray-300 border border-gray-600 rounded hover:bg-gray-600/50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`flex-1 px-4 py-2 text-sm font-mono border rounded transition-colors ${styles.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal