import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X, Save, Plus, Edit, Trash2, Eye } from 'lucide-react'

export default function AdminModal({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  children, 
  type = 'create', // 'create', 'edit', 'delete', 'view'
  size = 'md', // 'sm', 'md', 'lg', 'xl', '2xl'
  className = '',
  zIndex = 10000 
}) {
  const getIcon = () => {
    switch (type) {
      case 'create':
        return <Plus className="h-5 w-5" />
      case 'edit':
        return <Edit className="h-5 w-5" />
      case 'delete':
        return <Trash2 className="h-5 w-5" />
      case 'view':
        return <Eye className="h-5 w-5" />
      default:
        return <Plus className="h-5 w-5" />
    }
  }

  const getIconColor = () => {
    switch (type) {
      case 'create':
        return 'text-green-600 bg-green-100'
      case 'edit':
        return 'text-blue-600 bg-blue-100'
      case 'delete':
        return 'text-red-600 bg-red-100'
      case 'view':
        return 'text-purple-600 bg-purple-100'
      default:
        return 'text-green-600 bg-green-100'
    }
  }

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md'
      case 'md':
        return 'max-w-lg'
      case 'lg':
        return 'max-w-2xl'
      case 'xl':
        return 'max-w-4xl'
      case '2xl':
        return 'max-w-6xl'
      default:
        return 'max-w-lg'
    }
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative" onClose={onOpenChange} style={{ zIndex }}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full ${getSizeClass()} transform overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200 ${className}`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getIconColor()}`}>
                        {getIcon()}
                      </div>
                      <div>
                        <Dialog.Title className="text-xl font-bold text-gray-900">
                          {title}
                        </Dialog.Title>
                        {description && (
                          <Dialog.Description className="text-sm text-gray-600 mt-1">
                            {description}
                          </Dialog.Description>
                        )}
                      </div>
                    </div>
                    <button
                      aria-label="Fechar"
                      onClick={() => onOpenChange(false)}
                      className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

// Componente para botões de ação padronizados
export function ModalActionButton({ 
  onClick, 
  variant = 'primary', 
  disabled = false, 
  children, 
  icon = null,
  className = ''
}) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white'
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white'
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 text-white'
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white'
      case 'outline':
        return 'border border-gray-300 hover:bg-gray-50 text-gray-700'
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getVariantClasses()} ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  )
}

// Componente para seções de formulário
export function ModalSection({ title, children, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

// Componente para grid de campos
export function ModalGrid({ children, cols = 2, className = '' }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${cols} gap-4 ${className}`}>
      {children}
    </div>
  )
}
