import { createContext, useContext, useState, useEffect } from 'react'

const SecurityContext = createContext(null)

export const SecurityProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, message: '', type: 'copy' })
  const [isObscured, setIsObscured] = useState(false)

  const showCopyWarning = (msg = 'Copying a message is not allowed.') => {
    setToast({ show: true, message: msg, type: 'copy' })
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }))
    }, 3000)
  }

  const showScreenshotWarning = (msg = 'Taking screenshots is not allowed!') => {
    setIsObscured(true)
    setToast({ show: true, message: msg, type: 'screenshot' })
    setTimeout(() => {
      setIsObscured(false)
    }, 2000)
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }))
    }, 3500)
  }

  useEffect(() => {
    // Intercept screenshot and print keyboard shortcuts
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey

      // PrintScreen Key (Windows / Linux)
      if (e.key === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault()
        showScreenshotWarning('Taking screenshots is not allowed!')
        return
      }

      // Cmd/Ctrl + Shift + 3 / 4 / 5 / S (Mac & Windows Snipping tool)
      if (isCmdOrCtrl && e.shiftKey && (['3', '4', '5', 's', 'S'].includes(e.key) || e.keyCode === 83)) {
        e.preventDefault()
        showScreenshotWarning('Taking screenshots is not allowed!')
        return
      }

      // Windows logo key + Shift + S
      if (e.key === 'Meta' && e.shiftKey) {
        showScreenshotWarning('Taking screenshots is not allowed!')
        return
      }

      // Cmd/Ctrl + P (Print screen / save as PDF attempt)
      if (isCmdOrCtrl && (e.key === 'p' || e.key === 'P' || e.keyCode === 80)) {
        e.preventDefault()
        showScreenshotWarning('Taking screenshots or printing is not allowed!')
        return
      }
    }

    // Intercept global copy & cut events
    const handleGlobalCopy = (e) => {
      const selection = window.getSelection() ? window.getSelection().toString() : ''
      if (selection.trim().length > 0) {
        e.preventDefault()
        showCopyWarning('Copying a message is not allowed.')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('copy', handleGlobalCopy)
    document.addEventListener('cut', handleGlobalCopy)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('copy', handleGlobalCopy)
      document.removeEventListener('cut', handleGlobalCopy)
    }
  }, [])

  return (
    <SecurityContext.Provider
      value={{
        showCopyWarning,
        showScreenshotWarning,
        isObscured,
      }}
    >
      <div className={isObscured ? 'filter blur-xl transition-all duration-200 select-none' : ''}>
        {children}
      </div>

      {/* Security Toast Notification Popup */}
      {toast.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-[90%] sm:w-auto px-4 py-3 rounded-[8px] bg-[#151518]/95 border border-[#F5B800]/60 text-[#F2F2F2] shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fade-in pointer-events-none">
          <div className="w-7 h-7 rounded-full bg-[#F5B800]/20 text-[#F5B800] border border-[#F5B800]/40 flex items-center justify-center text-sm shrink-0 font-bold">
            {toast.type === 'screenshot' ? '📸' : '🚫'}
          </div>
          <div>
            <p className="text-xs font-bold text-[#F5B800] uppercase tracking-wider">
              {toast.type === 'screenshot' ? 'Security Restriction' : 'Action Prohibited'}
            </p>
            <p className="text-xs font-semibold text-[#F2F2F2] mt-0.5">
              {toast.message}
            </p>
          </div>
        </div>
      )}
    </SecurityContext.Provider>
  )
}

export const useSecurity = () => useContext(SecurityContext)
