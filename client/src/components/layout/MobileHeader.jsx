import { useState } from 'react'
import { Link as RouterLink, useParams as useRouterParams, useNavigate as useRouterNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import BitmojiAvatar from '../common/BitmojiAvatar'
import PersonaLogo from '../common/PersonaLogo'

const SPACES_LIST = [
  { name: 'IT', slug: 'coding-tech' },
  { name: 'Finance', slug: 'finance' },
  { name: 'Fitness', slug: 'fitness-health' },
  { name: 'Geopolitics', slug: 'life-geopolitics' },
  { name: 'Relationships', slug: 'relationships-emotions' },
  { name: 'Startups', slug: 'startups' },
  { name: 'General', slug: 'career-placements' },
]

export default function MobileHeader({ searchQuery, setSearchQuery, onCreatePostClick, onOpenInfoModal }) {
  const [isOpen, setIsOpen] = useState(false)
  const { slug } = useRouterParams()
  const { isLoggedIn, persona, logout } = useAuth()
  const navigate = useRouterNavigate()

  const handleSpaceClick = (spaceSlug) => {
    setIsOpen(false)
    navigate(`/c/${spaceSlug}`)
  }

  return (
    <>
      {/* Mobile Top Sticky Navigation Bar (Visible only on screens < md) */}
      <header className="md:hidden sticky top-0 z-30 w-full bg-[#0D0D0F]/95 backdrop-blur-md border-b border-[#25252A] px-4 py-3 flex items-center justify-between">
        {/* Futuristic Brand Logo (No Icon Image) */}
        <PersonaLogo size="sm" />

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {/* Create Button */}
          <button
            onClick={onCreatePostClick}
            className="px-3 py-1.5 rounded-[6px] text-xs font-bold text-[#0D0D0F] bg-[#F5B800] hover:bg-[#e0a800] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>+</span>
            <span>Post</span>
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-[6px] text-[#9A9A9F] hover:text-[#F2F2F2] bg-[#151518] border border-[#25252A] transition-colors cursor-pointer"
          >
            {isOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Slide-out Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#0D0D0F]/95 backdrop-blur-md animate-fade-in flex flex-col justify-between p-5 overflow-y-auto">
          <div>
            {/* Header in Drawer */}
            <div className="flex items-center justify-between pb-4 border-b border-[#25252A] mb-4">
              <PersonaLogo size="md" onClick={() => setIsOpen(false)} />
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-[6px] text-[#9A9A9F] hover:text-[#F2F2F2]"
              >
                ✕
              </button>
            </div>

            {/* Mobile Search Bar */}
            <div className="mb-5">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Persona..."
                className="w-full px-3.5 py-2 rounded-[8px] bg-[#151518] border border-[#25252A] text-xs text-[#F2F2F2] placeholder-[#6F7076] focus:outline-none focus:border-[#F5B800]"
              />
            </div>

            {/* Spaces Navigation Section */}
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6F7076] block mb-2 px-1">
                Spaces
              </span>
              <div className="grid grid-cols-2 gap-2">
                {SPACES_LIST.map(space => (
                  <button
                    key={space.slug}
                    onClick={() => handleSpaceClick(space.slug)}
                    className={`py-2 px-3 rounded-[6px] text-xs font-semibold text-left transition-all cursor-pointer ${
                      slug === space.slug
                        ? 'bg-[#151518] text-[#F5B800] border-l-2 border-[#F5B800] font-bold'
                        : 'bg-[#151518]/60 text-[#9A9A9F] border border-[#25252A] hover:text-[#F2F2F2]'
                    }`}
                  >
                    # {space.name}
                  </button>
                ))}
              </div>
            </div>

            {/* User Account Info */}
            {isLoggedIn && persona && (
              <div className="p-4 rounded-[8px] bg-[#151518] border border-[#25252A] mb-6 text-xs">
                <div className="flex items-center gap-3">
                  <BitmojiAvatar
                    seed={persona.name}
                    avatarConfig={persona.avatarConfig}
                    size={32}
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#F2F2F2]">{persona.name}</h4>
                    <span className="text-[10px] font-bold text-[#F5B800]">
                      Trust Score: {persona.trustScore || 0}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    logout()
                    navigate('/login')
                  }}
                  className="w-full mt-3 py-2 rounded-[6px] text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Footer Info Links */}
          <div className="pt-4 border-t border-[#25252A] text-[11px] text-[#6F7076] space-y-2">
            <div className="flex flex-wrap gap-3 font-medium text-[#9A9A9F]">
              <button onClick={() => { setIsOpen(false); onOpenInfoModal('privacy') }} className="hover:text-[#F5B800]">Privacy</button>
              <button onClick={() => { setIsOpen(false); onOpenInfoModal('terms') }} className="hover:text-[#F5B800]">Terms</button>
              <button onClick={() => { setIsOpen(false); onOpenInfoModal('guidelines') }} className="hover:text-[#F5B800]">Guidelines</button>
              <button onClick={() => { setIsOpen(false); onOpenInfoModal('contact') }} className="hover:text-[#F5B800]">Contact</button>
            </div>
            <p className="text-[10px] text-[#6F7076]">Persona Inc. © {new Date().getFullYear()}</p>
          </div>
        </div>
      )}
    </>
  )
}
