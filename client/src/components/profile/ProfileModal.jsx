import { useAuth } from '../../context/AuthContext'

export default function ProfileModal({ isOpen, onClose }) {
  const { persona, logout } = useAuth()

  if (!isOpen || !persona) return null

  const personaInitial = persona.name ? persona.name.charAt(0).toUpperCase() : 'P'

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
        {/* Header banner */}
        <div
          style={{
            background: `linear-gradient(135deg, ${persona.color || '#2563eb'}44, ${persona.color || '#2563eb'}11)`,
          }}
          className="h-20 -mx-6 -mt-6 mb-4 flex items-center justify-end px-4"
        >
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-black/20 hover:bg-black/40 text-white text-xs transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Persona Avatar Badge */}
        <div className="flex flex-col items-center text-center -mt-12 mb-4">
          <div
            style={{
              backgroundColor: persona.color || '#2563eb',
            }}
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-black text-white border-4 border-[var(--bg-modal)] shadow-md"
          >
            {personaInitial}
          </div>

          <h2 className="text-xl font-bold mt-3 tracking-tight text-[var(--text-primary)]">
            {persona.name || 'Anonymous Persona'}
          </h2>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Trust Score: {persona.trustScore || 0}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1e1e24] text-[var(--text-secondary)] border border-[var(--border)]">
              Anonymous
            </span>
          </div>
        </div>

        {/* Privacy Guarantee callout */}
        <div
          style={{
            backgroundColor: 'var(--bg-sidebar)',
            borderColor: 'var(--border)',
          }}
          className="rounded-xl p-3.5 mb-5 text-xs text-center leading-relaxed border text-[var(--text-secondary)]"
        >
          <strong>100% Identity Shielded</strong> — Your real email and identity are encrypted. Other members only see your <span className="text-[var(--text-primary)] font-semibold">{persona.name}</span> persona.
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div
            style={{
              backgroundColor: 'var(--bg-sidebar)',
              borderColor: 'var(--border)',
            }}
            className="p-3 rounded-xl text-center border"
          >
            <p style={{ color: 'var(--text-muted)' }} className="text-xs font-medium uppercase tracking-wider">
              Posts Written
            </p>
            <p className="text-lg font-bold text-blue-400 mt-0.5">
              {persona._count?.posts ?? '—'}
            </p>
          </div>
          <div
            style={{
              backgroundColor: 'var(--bg-sidebar)',
              borderColor: 'var(--border)',
            }}
            className="p-3 rounded-xl text-center border"
          >
            <p style={{ color: 'var(--text-muted)' }} className="text-xs font-medium uppercase tracking-wider">
              Comments Shared
            </p>
            <p className="text-lg font-bold text-blue-400 mt-0.5">
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
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-colors border border-rose-500/20"
          >
            Logout Persona
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

