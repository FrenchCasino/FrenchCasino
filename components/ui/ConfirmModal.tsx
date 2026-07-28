'use client'

import { useState, useCallback } from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'default'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null

  const confirmColor =
    variant === 'danger'
      ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/30'
      : variant === 'warning'
      ? 'bg-amber-500 hover:bg-amber-600 text-black'
      : 'bg-primary hover:bg-primary-hover text-white shadow-purple-glow'

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="glass-panel rounded-2xl border border-slate-700/60 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-slate-800/60">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl ${
                  variant === 'danger'
                    ? 'bg-red-500/20 border border-red-500/30'
                    : variant === 'warning'
                    ? 'bg-amber-500/20 border border-amber-500/30'
                    : 'bg-primary/20 border border-primary/30'
                }`}
              >
                <AlertTriangle
                  className={`w-5 h-5 ${
                    variant === 'danger'
                      ? 'text-red-400'
                      : variant === 'warning'
                      ? 'text-amber-400'
                      : 'text-primary'
                  }`}
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold/70">
                    FrenchCasino
                  </span>
                </div>
                <h3 className="font-display font-bold text-white text-base">{title}</h3>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="text-slate-500 hover:text-white transition-colors rounded-lg p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 pb-6">
            <button
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${confirmColor}`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook for easy usage
interface UseConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'default'
}

export function useConfirm() {
  const [state, setState] = useState<{
    isOpen: boolean
    resolve: ((value: boolean) => void) | null
    options: UseConfirmOptions
  }>({
    isOpen: false,
    resolve: null,
    options: { title: '', message: '' },
  })

  const confirm = useCallback((options: UseConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ isOpen: true, resolve, options })
    })
  }, [])

  const handleConfirm = useCallback(() => {
    state.resolve?.(true)
    setState((s) => ({ ...s, isOpen: false, resolve: null }))
  }, [state])

  const handleCancel = useCallback(() => {
    state.resolve?.(false)
    setState((s) => ({ ...s, isOpen: false, resolve: null }))
  }, [state])

  const ConfirmDialog = useCallback(
    () => (
      <ConfirmModal
        isOpen={state.isOpen}
        title={state.options.title}
        message={state.options.message}
        confirmLabel={state.options.confirmLabel}
        cancelLabel={state.options.cancelLabel}
        variant={state.options.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    ),
    [state, handleConfirm, handleCancel]
  )

  return { confirm, ConfirmDialog }
}
