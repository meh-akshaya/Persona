import { useAuth } from '../../context/AuthContext'

export default function ProfileModal({ isOpen, onClose }) {
  const { persona, logout } = useAuth()

  if (!isOpen || !persona) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--modal-overlay)] backdrop-blur-xs animate-fade-in">
      <div
        style={{
          backgroundColor: 'var(--bg-modal)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
        }}
        className="relative w-full max-w-md rounded-2xl p-6 shadow-xl overflow-hidden"
      >
        {/* Header decoration banner */}
        <div
          style={{
            background: `linear-gradient(135deg, ${persona.color || '#7c5cfc'}44, ${persona.color || '#7c5cfc'}11)`,
          }}
          className="h-20 -mx-6 -mt-6 mb-4 flex items-center justify-end px-4"
        >
          <button
            onClick={onClose}
            style={{ color: 'var(--text-secondary)' }}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Persona Avatar Badge */}
        <div className="flex flex-col items-center text-center -mt-12 mb-4">
          <div
            style={{
              backgroundColor: persona.color || '#7c5cfc',
              boxShadow: `0 0 20px ${persona.color || '#7c5cfc'}55`,
            }}
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-4 border-[var(--bg-modal)] transition-transform hover:scale-105"
          >
            {persona.emoji || '🎭'}
          </div>

          <h2 className="text-xl font-bold mt-3 tracking-tight">
            {persona.name || 'Anonymous Persona'}
          </h2>

          <div className="flex items-center gap-2 mt-2">
            <span
              style={{
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent-text)',
              }}
              className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
            >
              🛡️ Trust Score: {persona.trustScore || 0}
            </span>
            <span
              style={{
                backgroundColor: 'var(--border-subtle)',
                color: 'var(--text-secondary)',
              }}
              className="text-xs px-2.5 py-1 rounded-full"
            >
              Anonymous
            </span>
          </div>
        </div>

        {/* Privacy Guarantee callout */}
        <div
          style={{
            backgroundColor: 'var(--bg-sidebar)',
            border: '1px solid var(--border)',
          }}
          className="rounded-xl p-3.5 mb-5 text-xs text-center leading-relaxed"
        >
          🔒 <strong>100% Identity Shielded</strong> — Your real email and identity are encrypted. Other members only see your <span>{persona.name}</span> persona.
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div
            style={{
              backgroundColor: 'var(--bg-sidebar)',
              border: '1px solid var(--border)',
            }}
            className="p-3 rounded-xl text-center"
          >
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs font-medium">
              Posts Written
            </p>
            <p className="text-lg font-bold text-[var(--accent-text)] mt-0.5">
              {persona._count?.posts ?? '—'}
            </p>
          </div>
          <div
            style={{
              backgroundColor: 'var(--bg-sidebar)',
              border: '1px solid var(--border)',
            }}
            className="p-3 rounded-xl text-center"
          >
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs font-medium">
              Comments Shared
            </p>
            <p className="text-lg font-bold text-[var(--accent-text)] mt-0.5">
              {persona._count?.comments ?? '—'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              logout()
              onClose()
            }}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 transition-colors"
          >
            Logout Persona
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'var(--accent)',
              color: '#ffffff',
            }}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
