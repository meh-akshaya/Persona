import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ProfileModal from '../profile/ProfileModal'

export default function RightSidebar({ onSearchChange, onOpenInfoModal }) {
  const { isLoggedIn, persona, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (onSearchChange) onSearchChange(query)
  }

  return (
    <>
      <aside className="w-[280px] min-w-[280px] hidden lg:block py-6 px-3.5 sticky top-0 h-screen overflow-y-auto no-scrollbar border-l border-[var(--border)]">
        {/* Search Bar */}
        <div className="relative mb-5">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search Persona..."
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
            className="w-full pl-9 pr-3.5 py-2 rounded-full text-xs border focus:outline-none focus:border-amber-500 transition-all placeholder:text-[var(--text-muted)]"
          />
          <svg
            className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[var(--text-muted)]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Auth / Account Card Widget */}
        {!isLoggedIn ? (
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
            }}
            className="rounded-2xl p-5 border text-center mb-5 shadow-sm animate-fade-in hover:scale-[1.01] hover:border-amber-500/40 transition-all duration-300 group"
          >
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>

            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Log in or sign up
            </h3>
            <p style={{ color: 'var(--text-secondary)' }} className="text-[11px] mt-1 leading-relaxed mb-4">
              Join insightful anonymous discussions.
            </p>

            <div className="flex flex-col gap-2">
              <Link
                to="/register"
                className="w-full py-2 rounded-xl text-xs font-extrabold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-xs"
              >
                Start your Persona
              </Link>
              <Link
                to="/login"
                style={{
                  backgroundColor: 'var(--border-subtle)',
                  color: 'var(--text-primary)',
                  borderColor: 'var(--border)',
                }}
                className="w-full py-2 rounded-xl text-xs font-semibold border hover:bg-[var(--border)] transition-colors"
              >
                Sign in
              </Link>
            </div>
          </div>
        ) : (
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border)',
            }}
            className="rounded-2xl p-4 border mb-5 shadow-sm animate-fade-in hover:border-amber-500/30 transition-all"
          >
            <div className="flex items-center gap-2.5 mb-3">
              <div
                style={{ backgroundColor: persona?.color || '#f59e0b' }}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-950 font-bold text-xs shrink-0 shadow-xs"
              >
                {persona?.name ? persona.name.charAt(0).toUpperCase() : 'P'}
              </div>
              <div className="overflow-hidden">
                <h3 className="text-xs font-bold truncate text-[var(--text-primary)]">
                  {persona?.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 mt-0.5">
                  <svg className="w-2.5 h-2.5 fill-current text-amber-400" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2A11.954 11.954 0 0110 1.944z" clipRule="evenodd" />
                  </svg>
                  Trust: {persona?.trustScore || 0}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-[var(--border)] mb-3 text-center text-xs">
              <div>
                <span style={{ color: 'var(--text-muted)' }} className="text-[9px] uppercase font-bold block">Posts</span>
                <span className="font-bold text-xs text-[var(--text-primary)]">{persona?._count?.posts ?? 0}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }} className="text-[9px] uppercase font-bold block">Comments</span>
                <span className="font-bold text-xs text-[var(--text-primary)]">{persona?._count?.comments ?? 0}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="flex-1 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                Profile
              </button>
              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                style={{
                  backgroundColor: 'var(--border-subtle)',
                  color: 'var(--text-secondary)',
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Minimal Footer Links */}
        <div style={{ color: 'var(--text-muted)' }} className="px-1 text-[10px] space-y-1.5">
          <div className="flex flex-wrap gap-x-2.5 gap-y-1 font-medium">
            <button onClick={() => onOpenInfoModal && onOpenInfoModal('privacy')} className="hover:underline hover:text-amber-400">Privacy</button>
            <button onClick={() => onOpenInfoModal && onOpenInfoModal('terms')} className="hover:underline hover:text-amber-400">Terms</button>
            <button onClick={() => onOpenInfoModal && onOpenInfoModal('guidelines')} className="hover:underline hover:text-amber-400">Guidelines</button>
            <button onClick={() => onOpenInfoModal && onOpenInfoModal('contact')} className="hover:underline hover:text-amber-400">Contact</button>
          </div>
          <p className="opacity-70">Persona Inc. © {new Date().getFullYear()}</p>
        </div>
      </aside>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  )
}
