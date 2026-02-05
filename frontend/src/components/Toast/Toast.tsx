import { useEffect } from 'react'
import { useToast } from '../../hooks/useToast'
import type { Toast as ToastType } from '../../contexts/ToastContext'
import './Toast.css'

const Toast = ({ id, message, type, duration }: ToastType) => {
  const { removeToast } = useToast()

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        removeToast(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [id, duration, removeToast])

  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  }

  return (
    <div className={`toast toast-${type}`} role="alert">
      <span className="toast-icon">{icons[type]}</span>
      <p className="toast-message">{message}</p>
      <button
        className="toast-close"
        onClick={() => removeToast(id)}
        aria-label="Fechar notificação"
      >
        ✕
      </button>
    </div>
  )
}

export const ToastContainer = () => {
  const { toasts } = useToast()

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  )
}
