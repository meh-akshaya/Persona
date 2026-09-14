import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ProfileModal from '../profile/ProfileModal'
import BitmojiAvatar from '../common/BitmojiAvatar'
import TopPersonasWidget from '../sidebar/TopPersonasWidget'
import CommunityRulesWidget from '../sidebar/CommunityRulesWidget'
import CleanLink from '../common/CleanLink'

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
      <aside className="w-[260px] xl:w-[280px] shrink-0 hidden lg:flex flex-col justify-between py-4 px-3 sm:px-3.5 h-full overflow-y-auto no-scrollbar border-t border-x border-[#25252A] rounded-t-[10px] bg-[#0D0D0F]">
        <div className="flex flex-col gap-4 min-w-0">
          {/* Search Bar — Clean Container Box */}
          <div className="relative w-full bg-[#151518] border border-[#25252A] rounded-[10px] p-3 shadow-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search Persona..."
              className="w-full px-3 py-2 rounded-[6px] text-xs bg-[#0D0D0F] border border-[#25252A] text-[#F2F2F2] placeholder-[#6F7076] focus:outline-none focus:border-[#F5B800] transition-colors"
            />
          </div>

          {/* Auth / Account Widget Box */}
          {!isLoggedIn ? (
            <div className="bg-[#151518] border border-[#25252A] rounded-[10px] p-4 sm:p-4.5 text-center shadow-xs min-w-0">
              <h3 className="text-xs font-bold text-[#F2F2F2]">
                Log in or sign up
              </h3>
              <p className="text-[11px] text-[#9A9A9F] mt-1 leading-relaxed mb-3.5">
                Join insightful anonymous discussions.
              </p>

              <div className="flex flex-col gap-2">
                <CleanLink
                  to="/register"
                  className="w-full py-2 rounded-[6px] text-xs font-bold text-[#0D0D0F] bg-[#F5B800] hover:bg-[#e0a800] transition-colors text-center shadow-xs block"
                >
                  Start your Persona
                </CleanLink>
                <CleanLink
                  to="/login"
                  className="w-full py-2 rounded-[6px] text-xs font-semibold text-[#9A9A9F] bg-[#0D0D0F] border border-[#25252A] hover:text-[#F2F2F2] transition-colors text-center block"
                >
                  Sign in
                </CleanLink>
              </div>
            </div>
          ) : (
            <div className="bg-[#151518] border border-[#25252A] rounded-[10px] p-4 sm:p-4.5 text-xs shadow-xs min-w-0">
              <div className="flex items-center justify-between gap-3 mb-3.5 min-w-0">
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-[#F2F2F2] text-sm leading-tight truncate">
                    {persona?.name}
                  </h3>
                  <span className="text-[11px] font-medium text-[#9A9A9F] flex items-center gap-1 mt-0.5">
                    Trust <span className="text-[#F5B800] font-bold">{persona?.trustScore || 0}</span>
                  </span>
                </div>
                <button
                  onClick={() => setIsProfileOpen(true)}
                  title="Customize Avatar in Studio"
                  className="shrink-0 cursor-pointer hover:scale-105 transition-transform"
                >
                  <BitmojiAvatar
                    seed={persona?.name || 'Persona'}
                    avatarConfig={persona?.avatarConfig}
                    size={36}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 py-2 border-t border-b border-[#25252A] mb-3.5 text-[#9A9A9F] text-xs px-1">
                <div className="flex items-center gap-1.5"><span className="font-bold text-[#F2F2F2]">{persona?._count?.posts ?? 0}</span> <span>Posts</span></div>
                <div className="flex items-center gap-1.5"><span className="font-bold text-[#F2F2F2]">{persona?._count?.comments ?? 0}</span> <span>Comments</span></div>
              </div>

              <div className="flex items-center justify-between gap-2 text-xs">
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="text-[#F5B800] hover:underline font-semibold cursor-pointer"
                >
                  View profile
                </button>
                <button
                  onClick={() => {
                    logout()
                    navigate('/login')
                  }}
                  className="text-[#6F7076] hover:text-[#9A9A9F] cursor-pointer font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          )}

          {/* Contextual Top Personas Section Box */}
          <TopPersonasWidget />

          {/* Platform Trust & Community Rules Section Box */}
          <CommunityRulesWidget onOpenInfoModal={onOpenInfoModal} />
        </div>

        {/* Minimal Footer Links Section Box — Pinned to Bottom */}
        <div className="bg-[#151518] border border-[#25252A] rounded-[10px] p-3.5 sm:p-4 text-[11px] text-[#6F7076] space-y-1.5 shadow-xs mt-4 min-w-0">
          <div className="flex items-center justify-center gap-1.5 font-medium flex-wrap">
            <button onClick={() => onOpenInfoModal && onOpenInfoModal('privacy')} className="hover:text-[#9A9A9F] cursor-pointer">Privacy</button>
            <span>·</span>
            <button onClick={() => onOpenInfoModal && onOpenInfoModal('terms')} className="hover:text-[#9A9A9F] cursor-pointer">Terms</button>
            <span>·</span>
            <button onClick={() => onOpenInfoModal && onOpenInfoModal('guidelines')} className="hover:text-[#9A9A9F] cursor-pointer">Guidelines</button>
            <span>·</span>
            <button onClick={() => onOpenInfoModal && onOpenInfoModal('contact')} className="hover:text-[#9A9A9F] cursor-pointer">Contact</button>
          </div>
          <p className="text-[10px] text-center">Persona Inc. © {new Date().getFullYear()}</p>
        </div>
      </aside>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  )
}
