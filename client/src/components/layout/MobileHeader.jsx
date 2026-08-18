import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react'
import { Link as RouterLink, useParams as useRouterParams, useNavigate as useRouterNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

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
      <header className="md:hidden sticky top-0 z-30 w-full bg-[#121214]/95 backdrop-blur-md border-b border-[#26262e] px-4 py-3 flex items-center justify-between">
        {/* Clickable Brand Logo */}
        <RouterLink to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-xs">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="text-lg font-black tracking-tight text-white">
            Persona
          </span>
        </RouterLink>

        {/* Right Action Icons */}
        <div className="flex items-center gap-2">
          {/* Create Button */}
          <button
            onClick={onCreatePostClick}
            className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-colors shadow-xs flex items-center gap-1"
          >
            <span>+</span>
            <span>Post</span>
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Navigation Menu"
            className="p-2 rounded-xl text-zinc-300 hover:text-white bg-[#19191d] border border-[#26262e] transition-colors"
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
        <div className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm animate-fade-in flex flex-col justify-between p-5 overflow-y-auto">
          <div>
            {/* Header in Drawer */}
            <div className="flex items-center justify-between pb-4 border-b border-[#26262e] mb-4">
              <RouterLink to="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <span className="text-xl font-black text-white">Persona</span>
              </RouterLink>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white"
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
                className="w-full px-4 py-2.5 rounded-xl bg-[#19191d] border border-[#26262e] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Spaces Navigation Section */}
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-2 px-1">
                Spaces & Topics
              </span>
              <div className="grid grid-cols-2 gap-2">
                {SPACES_LIST.map(space => (
                  <button
                    key={space.slug}
                    onClick={() => handleSpaceClick(space.slug)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold text-left transition-all ${
                      slug === space.slug
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
                        : 'bg-[#19191d] text-zinc-300 border border-[#26262e] hover:bg-[#222228]'
                    }`}
                  >
                    # {space.name}
                  </button>
                ))}
              </div>
            </div>

            {/* User Account Info */}
            {isLoggedIn && persona && (
              <div className="p-4 rounded-xl bg-[#19191d] border border-[#26262e] mb-6">
                <div className="flex items-center gap-3">
                  <div
                    style={{ backgroundColor: persona.color || '#f59e0b' }}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-slate-950 font-bold text-xs shrink-0"
                  >
                    {persona.name ? persona.name.charAt(0).toUpperCase() : 'P'}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{persona.name}</h4>
                    <span className="text-[10px] font-bold text-amber-400">
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
                  className="w-full mt-3 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20"
                >
                  Logout Persona
                </button>
              </div>
            )}
          </div>

          {/* Footer Info Links */}
          <div className="pt-4 border-t border-[#26262e] text-[11px] text-zinc-500 space-y-2">
            <div className="flex flex-wrap gap-3 font-semibold text-zinc-400">
              <button onClick={() => { setIsOpen(false); onOpenInfoModal('privacy') }} className="hover:text-amber-400">Privacy Policy</button>
              <button onClick={() => { setIsOpen(false); onOpenInfoModal('terms') }} className="hover:text-amber-400">Terms of Service</button>
              <button onClick={() => { setIsOpen(false); onOpenInfoModal('guidelines') }} className="hover:text-amber-400">Guidelines</button>
              <button onClick={() => { setIsOpen(false); onOpenInfoModal('contact') }} className="hover:text-amber-400">Contact</button>
            </div>
            <p className="text-[10px] text-zinc-600">Persona Inc. © {new Date().getFullYear()}</p>
          </div>
        </div>
      )}
    </>
  )
}
