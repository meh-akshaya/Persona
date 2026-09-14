import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import CreatePostModal from '../posts/CreatePostModal'
import BitmojiAvatar from '../common/BitmojiAvatar'
import PersonaLogo from '../common/PersonaLogo'
import CleanLink from '../common/CleanLink'

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
      <aside className="w-[230px] xl:w-[240px] shrink-0 hidden md:flex flex-col justify-between py-4 px-2.5 h-full overflow-y-auto no-scrollbar border-t border-x border-[#25252A] rounded-t-[10px] bg-[#0D0D0F]">
        <div className="flex flex-col gap-3">
          {/* Header Section Box (Logo & Primary CTA) */}
          <div className="bg-[#151518] border border-[#25252A] rounded-[10px] p-3 shadow-xs">
            <div className="px-1 mb-3 pt-0.5">
              <PersonaLogo size="md" />
            </div>
            <button
              onClick={handleCreateClick}
              className="w-full h-9 px-3 rounded-[6px] text-xs font-bold text-[#0D0D0F] bg-[#F5B800] hover:bg-[#e0a800] transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span className="text-sm font-black">+</span>
              <span>Start a post</span>
            </button>
          </div>

          {/* Grouped Sidebar Navigation Box */}
          <div className="bg-[#151518] border border-[#25252A] rounded-[10px] p-3 shadow-xs flex flex-col gap-5">
            {/* MAIN GROUP */}
            <div>
              <div className="text-[10px] font-bold text-[#6F7076] tracking-wider uppercase mb-2 px-2">
                Main
              </div>
              <CleanLink
                to="/"
                className={`flex items-center h-9 px-2.5 rounded-[6px] text-xs transition-colors ${!slug
                    ? 'bg-[#0D0D0F] text-[#F2F2F2] font-bold border-l-2 border-[#F5B800]'
                    : 'text-[#9A9A9F] hover:text-[#F2F2F2] hover:bg-[#0D0D0F]/60 font-medium'
                  }`}
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="flex-1 ml-2.5 truncate">Home</span>
              </CleanLink>
            </div>

            {/* SPACES GROUP */}
            <div>
              <div className="flex items-center justify-between px-2 mb-2">
                <span className="text-[10px] font-bold text-[#6F7076] tracking-wider uppercase">
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
                    <div className="py-1 space-y-1.5 px-2">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-7 bg-[#0D0D0F] rounded animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    communities.map(c => {
                      const isActive = slug === c.slug
                      const cleanName = formatSpaceName(c)
                      return (
                        <CleanLink
                          key={c.id}
                          to={`/c/${c.slug}`}
                          className={`flex items-center h-8 px-2.5 rounded-[6px] text-xs transition-all ${isActive
                              ? 'text-[#F5B800] bg-[#0D0D0F] font-bold border-l-2 border-[#F5B800]'
                              : 'text-[#9A9A9F] hover:text-[#F2F2F2] hover:bg-[#0D0D0F]/60 font-medium'
                            }`}
                        >
                          <div className="w-4 h-4 flex items-center justify-center shrink-0 text-[#9A9A9F]">
                            <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <span className="flex-1 ml-2 truncate">{cleanName}</span>
                          {c._count?.posts > 0 && (
                            <span className="min-w-[20px] text-center text-[10px] font-mono text-[#6F7076] bg-[#0D0D0F] px-1 py-0.5 rounded border border-[#25252A] ml-auto shrink-0">
                              {c._count.posts}
                            </span>
                          )}
                        </CleanLink>
                      )
                    })
                  )}
                </div>
              )}
            </div>

            {/* ACTIVITY GROUP */}
            <div>
              <div className="text-[10px] font-bold text-[#6F7076] tracking-wider uppercase mb-2 px-2">
                Activity
              </div>
              <div className="flex flex-col gap-0.5">
                <CleanLink
                  to="/"
                  className="flex items-center h-9 px-2.5 rounded-[6px] text-xs text-[#9A9A9F] hover:text-[#F2F2F2] hover:bg-[#0D0D0F]/60 transition-colors font-medium"
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="1.75" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <span className="flex-1 ml-2.5 truncate">Notifications</span>
                </CleanLink>

                <CleanLink
                  to="/"
                  className="flex items-center h-9 px-2.5 rounded-[6px] text-xs text-[#9A9A9F] hover:text-[#F2F2F2] hover:bg-[#0D0D0F]/60 transition-colors font-medium"
                >
                  <div className="w-5 h-5 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="1.75" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <span className="flex-1 ml-2.5 truncate">Explore</span>
                </CleanLink>
              </div>
            </div>

            {/* ACCOUNT GROUP */}
            <div>
              <div className="text-[10px] font-bold text-[#6F7076] tracking-wider uppercase mb-2 px-2">
                Account
              </div>
              <CleanLink
                to={isLoggedIn ? '/' : '/login'}
                className="flex items-center h-9 px-2.5 rounded-[6px] text-xs text-[#9A9A9F] hover:text-[#F2F2F2] hover:bg-[#0D0D0F]/60 transition-colors font-medium"
              >
                <div className="w-5 h-5 flex items-center justify-center shrink-0">
                  {isLoggedIn && persona ? (
                    <BitmojiAvatar
                      seed={persona.name}
                      avatarConfig={persona.avatarConfig}
                      size={20}
                    />
                  ) : (
                    <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="1.75" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                </div>
                <span className="flex-1 ml-2.5 truncate">{isLoggedIn ? persona?.name || 'Profile' : 'Profile'}</span>
              </CleanLink>
            </div>
          </div>
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