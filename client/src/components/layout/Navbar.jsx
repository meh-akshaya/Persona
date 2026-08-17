import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState, useEffect } from 'react'
import ProfileModal from '../profile/ProfileModal'
import CreatePostModal from '../posts/CreatePostModal'

export default function Navbar({ onSearchChange, onPostCreated }) {
  const { isLoggedIn, persona, logout } = useAuth()
  const navigate = useNavigate()
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showInfoToast, setShowInfoToast] = useState(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (onSearchChange) onSearchChange(query)
  }

  return (
    <>
      <nav
        style={{
          backgroundColor: 'var(--bg-card)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
          color: 'var(--text-primary)',
        }}
        className="fixed top-0 left-0 right-0 z-40 h-14 flex items-center px-4 md:px-6 gap-4 shadow-sm"
      >
        {/* Brand Logo */}
        <Link
          to="/"
          className="text-lg font-black tracking-tight flex items-center gap-2 mr-2 text-white group"
        >
          <span className="text-xl group-hover:rotate-12 transition-transform">🎭</span>
          <span className="hidden sm:inline bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">
            Persona
          </span>
        </Link>

        {/* Search Input */}
        <div className="flex-1 max-w-md relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search anonymous discussions..."
            style={{
              backgroundColor: 'var(--bg-sidebar)',
              borderColor: 'var(--border)',
              color: 'var(--text-primary)',
            }}
            className="w-full pl-9 pr-4 py-1.5 rounded-xl text-xs border focus:outline-none focus:border-[var(--accent)] transition-all placeholder:text-[var(--text-muted)]"
          />
          <span style={{ color: 'var(--text-muted)' }} className="absolute left-3 top-2 text-xs">
            🔍
          </span>
        </div>

        {/* Quick Nav Links */}
        <div
          style={{ color: 'var(--text-secondary)' }}
          className="hidden lg:flex items-center gap-4 text-xs font-semibold"
        >
          <button
            onClick={() => setShowInfoToast('Got suggestions? Send us feedback at suggestions@persona.app!')}
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            Suggestions
          </button>
          <button
            onClick={() => setShowInfoToast('Reach us anytime: contact@persona.app')}
            className="hover:text-[var(--text-primary)] transition-colors"
          >
            Contact
          </button>
          <span
            style={{
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent-text)',
            }}
            className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-violet-500/20"
          >
            V1 Live
          </span>
        </div>

        {/* Right side controls */}
        <div className="ml-auto flex items-center gap-3">

          {/* Create Post Button */}
          {isLoggedIn ? (
            <button
              onClick={() => setIsCreatePostOpen(true)}
              style={{
                backgroundColor: 'var(--accent)',
                color: '#ffffff',
              }}
              className="text-xs font-bold px-3.5 py-1.5 rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] cursor-pointer"
            >
              <span>➕</span>
              <span className="hidden sm:inline">New Post</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              style={{
                backgroundColor: 'var(--accent)',
                color: '#ffffff',
              }}
              className="text-xs font-bold px-3.5 py-1.5 rounded-xl hover:opacity-90 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] cursor-pointer"
            >
              <span>✍️</span>
              <span className="hidden sm:inline">Post Anonymously</span>
            </button>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            style={{ color: 'var(--text-secondary)' }}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-sm hover:bg-[var(--border)] transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>

          {/* Auth State & Persona Badge */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsProfileOpen(true)}
                style={{
                  backgroundColor: (persona?.color || '#7c5cfc') + '22',
                  borderColor: (persona?.color || '#7c5cfc') + '55',
                  color: 'var(--text-primary)',
                }}
                className="flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold hover:scale-102 transition-all cursor-pointer shadow-xs"
              >
                <span>{persona?.emoji || '🎭'}</span>
                <span className="truncate max-w-[90px]">{persona?.name}</span>
                <span
                  style={{
                    backgroundColor: persona?.color || '#7c5cfc',
                    color: '#ffffff',
                  }}
                  className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ml-0.5"
                >
                  🛡️ {persona?.trustScore || 0}
                </span>
              </button>

              <button
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
                style={{ color: 'var(--text-muted)' }}
                className="text-xs hover:text-rose-400 transition-colors p-1"
                title="Logout"
              >
                🚪
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                style={{ color: 'var(--text-primary)' }}
                className="text-xs font-semibold hover:opacity-80 transition-opacity px-2.5 py-1.5"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: '#ffffff',
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl hover:opacity-90 transition-opacity shadow-xs"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Info Toast */}
      {showInfoToast && (
        <div className="fixed bottom-5 right-5 z-50 p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] shadow-xl text-xs flex items-center gap-3 animate-fade-in">
          <span>ℹ️</span>
          <span>{showInfoToast}</span>
          <button onClick={() => setShowInfoToast(null)} className="ml-2 opacity-60 hover:opacity-100">✕</button>
        </div>
      )}

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostCreated={(post) => {
          if (onPostCreated) onPostCreated(post)
        }}
      />
    </>
  )
}