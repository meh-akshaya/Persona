import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import CreatePostModal from '../posts/CreatePostModal'

const formatSpaceName = (c) => {
  if (!c) return 'General'
  const slug = c.slug?.toLowerCase() || ''
  if (slug.includes('coding') || slug.includes('tech')) return 'IT'
  if (slug.includes('finance')) return 'Finance'
  if (slug.includes('fitness') || slug.includes('health')) return 'Fitness'
  if (slug.includes('geopolitics') || slug.includes('life')) return 'Geopolitics'
  if (slug.includes('relationship') || slug.includes('emotion')) return 'Relationships'
  if (slug.includes('startup')) return 'Startups'
  if (slug.includes('career') || slug.includes('placement')) return 'General'
  return c.name
}

export default function Sidebar({ onCreatePostClick }) {
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)
  const [showSpaces, setShowSpaces] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { slug } = useParams()
  const { isLoggedIn, persona } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/communities')
      .then(res => setCommunities(res.data.communities || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleCreateClick = () => {
    if (!isLoggedIn) return navigate('/login')
    if (onCreatePostClick) {
      onCreatePostClick()
    } else {
      setIsCreateModalOpen(true)
    }
  }

  return (
    <>
      <aside className="w-[240px] min-w-[240px] hidden md:flex flex-col justify-between py-6 px-4 sticky top-0 h-screen overflow-y-auto no-scrollbar border-r border-[var(--border)]">
        <div className="flex flex-col gap-6">
          {/* Substack Style Minimal Wordmark Logo */}
          <Link to="/" className="flex items-center gap-2.5 px-2 group">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 shadow-xs group-hover:bg-amber-400 transition-colors font-bold">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight text-[var(--text-primary)] font-sans">
              Persona
            </span>
          </Link>

          {/* Substack Primary Navigation List */}
          <nav className="flex flex-col gap-1 text-sm font-semibold">
            {/* Home */}
            <Link
              to="/"
              className={`flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all ${
                !slug
                  ? 'bg-[var(--border-subtle)] text-[var(--text-primary)] font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
              }`}
            >
              <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </Link>

            {/* Spaces / Communities Toggle */}
            <button
              onClick={() => setShowSpaces(!showSpaces)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>Spaces</span>
              </div>
              <svg className={`w-4 h-4 transition-transform ${showSpaces ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Sub-menu of Community Spaces */}
            {showSpaces && (
              <div className="ml-5 border-l border-[var(--border)] pl-3 flex flex-col gap-0.5 my-1">
                {loading ? (
                  <div className="py-2 space-y-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-6 bg-[var(--border-subtle)] rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : (
                  communities.map(c => {
                    const isActive = slug === c.slug
                    const cleanName = formatSpaceName(c)
                    return (
                      <Link
                        key={c.id}
                        to={`/c/${c.slug}`}
                        className={`flex items-center justify-between py-1.5 px-2.5 rounded-lg text-xs font-semibold transition-all ${
                          isActive
                            ? 'text-amber-400 bg-amber-500/10 font-bold border-l-2 border-amber-500'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]'
                        }`}
                      >
                        <span className="truncate">{cleanName}</span>
                        {c._count?.posts > 0 && (
                          <span className="text-[10px] opacity-70">
                            {c._count.posts}
                          </span>
                        )}
                      </Link>
                    )
                  })
                )}
              </div>
            )}

            {/* Activity */}
            <Link
              to="/"
              className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-all"
            >
              <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span>Activity</span>
            </Link>

            {/* Explore */}
            <Link
              to="/"
              className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-all"
            >
              <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Explore</span>
            </Link>

            {/* Profile */}
            <Link
              to={isLoggedIn ? '/' : '/login'}
              className="flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)] transition-all"
            >
              <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{isLoggedIn ? persona?.name || 'Profile' : 'Profile'}</span>
            </Link>
          </nav>
        </div>

        {/* Substack Prominent "Create" Primary Button */}
        <div className="pt-4">
          <button
            onClick={handleCreateClick}
            className="w-full py-3 px-4 rounded-full text-xs font-extrabold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider hover:scale-[1.02]"
          >
            <span>+</span>
            <span>Create</span>
          </button>
        </div>
      </aside>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={() => setIsCreateModalOpen(false)}
      />
    </>
  )
}