import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { X } from 'lucide-react'

export default function AdminDialog({ open, onOpenChange, title, description, className = 'max-w-5xl', children, zIndex = 10000 }) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative" onClose={onOpenChange} style={{ zIndex }}>
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px]" aria-hidden="true" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={`w-full ${className} transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl border border-gray-200`}>
                {(title || description) && (
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      {title && (
                        <Dialog.Title className="text-xl font-semibold tracking-tight">{title}</Dialog.Title>
                      )}
                      {description && (
                        <Dialog.Description className="text-sm text-gray-600 mt-1">{description}</Dialog.Description>
                      )}
                    </div>
                    <button
                      aria-label="Fechar"
                      onClick={() => onOpenChange(false)}
                      className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
                <div>{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
