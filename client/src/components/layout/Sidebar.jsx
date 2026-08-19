import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import CreatePostModal from '../posts/CreatePostModal'
import BitmojiAvatar from '../common/BitmojiAvatar'
import PersonaLogo from '../common/PersonaLogo'

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
      <aside className="w-[240px] min-w-[240px] shrink-0 hidden md:flex flex-col justify-between py-6 px-3.5 sticky top-0 h-screen overflow-y-auto no-scrollbar border-r border-[#25252A] bg-[#0D0D0F]">
        <div className="flex flex-col gap-6">
          {/* Futuristic Wordmark Logo (No Icon Image) */}
          <div className="pl-4 pr-2 pt-1">
            <PersonaLogo size="md" />
          </div>

          {/* Primary CTA Button */}
          <button
            onClick={handleCreateClick}
            className="w-full py-2.5 px-3.5 rounded-[6px] text-[13px] sm:text-sm font-bold text-[#0D0D0F] bg-[#F5B800] hover:bg-[#e0a800] transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="text-base font-black">+</span>
            <span>Start a post</span>
          </button>

          {/* Grouped Sidebar Navigation */}
          <nav className="flex flex-col gap-6">
            {/* MAIN GROUP */}
            <div>
              <div className="text-[11px] font-bold text-[#6F7076] tracking-wider uppercase mb-2 px-3">
                Main
              </div>
              <Link
                to="/"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-[13px] sm:text-sm transition-colors ${
                  !slug
                    ? 'bg-[#151518] text-[#F2F2F2] font-bold border-l-2 border-[#F5B800]'
                    : 'text-[#9A9A9F] hover:text-[#F2F2F2] hover:bg-[#151518]/60 font-medium'
                }`}
              >
                <svg className="w-4.5 h-4.5 fill-none stroke-current" strokeWidth="1.75" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Home</span>
              </Link>
            </div>

            {/* SPACES GROUP */}
            <div>
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-[11px] font-bold text-[#6F7076] tracking-wider uppercase">
                  Spaces
                </span>
                <button
                  onClick={() => setShowSpaces(!showSpaces)}
                  className="text-[#6F7076] hover:text-[#F2F2F2] transition-colors cursor-pointer"
                >
                  <svg className={`w-3.5 h-3.5 transition-transform ${showSpaces ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {showSpaces && (
                <div className="flex flex-col gap-0.5">
                  {loading ? (
                    <div className="py-2 space-y-1.5 px-3">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-7 bg-[#151518] rounded animate-pulse" />
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
                          className={`flex items-center justify-between py-2.5 px-3 rounded-[6px] text-[13px] sm:text-sm transition-all ${
                            isActive
                              ? 'text-[#F5B800] bg-[#151518] font-bold border-l-2 border-[#F5B800]'
                              : 'text-[#9A9A9F] hover:text-[#F2F2F2] hover:bg-[#151518]/70 font-medium'
                          }`}
                        >
                          <span className="truncate">{cleanName}</span>
                          {c._count?.posts > 0 && (
                            <span className="text-[11px] font-mono text-[#6F7076] bg-[#0D0D0F] px-2 py-0.5 rounded-[4px] border border-[#25252A]">
                              {c._count.posts}
                            </span>
                          )}
                        </Link>
                      )
                    })
                  )}
                </div>
              )}
            </div>

            {/* ACTIVITY GROUP */}
            <div>
              <div className="text-[11px] font-bold text-[#6F7076] tracking-wider uppercase mb-2 px-3">
                Activity
              </div>
              <div className="flex flex-col gap-0.5">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-[13px] sm:text-sm text-[#9A9A9F] hover:text-[#F2F2F2] hover:bg-[#151518]/60 transition-colors font-medium"
                >
                  <svg className="w-4.5 h-4.5 fill-none stroke-current" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span>Notifications</span>
                </Link>

                <Link
                  to="/"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-[6px] text-[13px] sm:text-sm text-[#9A9A9F] hover:text-[#F2F2F2] hover:bg-[#151518]/60 transition-colors font-medium"
                >
                  <svg className="w-4.5 h-4.5 fill-none stroke-current" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Explore</span>
                </Link>
              </div>
            </div>

            {/* ACCOUNT GROUP */}
            <div>
              <div className="text-[11px] font-bold text-[#6F7076] tracking-wider uppercase mb-2 px-3">
                Account
              </div>
              <Link
                to={isLoggedIn ? '/' : '/login'}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-[6px] text-[13px] sm:text-sm text-[#9A9A9F] hover:text-[#F2F2F2] hover:bg-[#151518]/60 transition-colors font-medium"
              >
                {isLoggedIn && persona ? (
                  <BitmojiAvatar
                    seed={persona.name}
                    avatarConfig={persona.avatarConfig}
                    size={24}
                  />
                ) : (
                  <svg className="w-4.5 h-4.5 fill-none stroke-current" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
                <span>{isLoggedIn ? persona?.name || 'Profile' : 'Profile'}</span>
              </Link>
            </div>
          </nav>
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