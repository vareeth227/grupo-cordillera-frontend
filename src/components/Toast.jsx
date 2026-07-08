import { createContext, useContext, useState, useCallback } from 'react'

const ToastCtx = createContext(null)

const STYLES = {
  success: { bg: 'linear-gradient(135deg, #2a7a50 0%, #1a5e38 100%)', icon: '✓' },
  error:   { bg: 'linear-gradient(135deg, #b83028 0%, #922420 100%)', icon: '✕' },
  info:    { bg: 'linear-gradient(135deg, #3558c0 0%, #2540a0 100%)', icon: 'ℹ' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  return (
    <ToastCtx.Provider value={showToast}>
      {children}
      <div style={{ position: 'fixed', bottom: '28px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
        {toasts.map(t => {
          const { bg, icon } = STYLES[t.type] || STYLES.info
          return (
            <div key={t.id} style={{
              background: bg,
              color: 'white',
              padding: '12px 18px',
              borderRadius: '14px',
              fontSize: '13px',
              fontWeight: 600,
              boxShadow: '6px 8px 24px rgba(0,0,0,0.25), -2px -2px 6px rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              maxWidth: '320px',
              animation: 'toastIn 0.28s ease',
              pointerEvents: 'auto',
            }}>
              <span style={{
                width: '20px', height: '20px',
                background: 'rgba(255,255,255,0.22)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', flexShrink: 0,
              }}>
                {icon}
              </span>
              {t.message}
            </div>
          )
        })}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  return useContext(ToastCtx)
}
