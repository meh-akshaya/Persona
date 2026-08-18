import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ProfileModal from '../profile/ProfileModal'
import BitmojiAvatar from '../common/BitmojiAvatar'
import TopPersonasWidget from '../sidebar/TopPersonasWidget'

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
      <aside className="w-[280px] min-w-[280px] hidden lg:block py-6 px-3.5 sticky top-0 h-screen overflow-y-auto no-scrollbar border-l border-[#25252A] bg-[#0D0D0F]">
        {/* Search Bar */}
        <div className="relative mb-5">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search Persona..."
            className="w-full pl-9 pr-3.5 py-2 rounded-[8px] text-xs bg-[#151518] border border-[#25252A] text-[#F2F2F2] placeholder-[#6F7076] focus:outline-none focus:border-[#F5B800] transition-colors"
          />
          <svg
            className="w-4 h-4 absolute left-3 top-2.5 text-[#6F7076]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Auth / Account Widget */}
        {!isLoggedIn ? (
          <div className="bg-[#151518] border border-[#25252A] rounded-[8px] p-4 text-center mb-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#F2F2F2]">
              Log in or sign up
            </h3>
            <p className="text-[11px] text-[#9A9A9F] mt-1 leading-relaxed mb-3">
              Join insightful anonymous discussions.
            </p>

            <div className="flex flex-col gap-2">
              <Link
                to="/register"
                className="w-full py-2 rounded-[6px] text-xs font-bold text-[#0D0D0F] bg-[#F5B800] hover:bg-[#e0a800] transition-colors text-center"
              >
                Start your Persona
              </Link>
              <Link
                to="/login"
                className="w-full py-2 rounded-[6px] text-xs font-semibold text-[#9A9A9F] bg-[#151518] border border-[#25252A] hover:text-[#F2F2F2] transition-colors text-center"
              >
                Sign in
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-[#151518] border border-[#25252A] rounded-[8px] p-4 mb-5 text-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-[#F2F2F2] text-sm leading-tight">
                  {persona?.name}
                </h3>
                <span className="text-[11px] font-medium text-[#9A9A9F]">
                  Trust <span className="text-[#F5B800] font-bold">{persona?.trustScore || 0}</span>
                </span>
              </div>
              <button
                onClick={() => setIsProfileOpen(true)}
                title="Customize Avatar in Studio"
                className="cursor-pointer hover:scale-105 transition-transform"
              >
                <BitmojiAvatar
                  seed={persona?.name || 'Persona'}
                  avatarConfig={persona?.avatarConfig}
                  size={36}
                />
              </button>
            </div>

            <div className="flex items-center gap-4 py-2 border-t border-b border-[#25252A] mb-3 text-[#9A9A9F] text-xs">
              <div><span className="font-bold text-[#F2F2F2]">{persona?._count?.posts ?? 0}</span> Posts</div>
              <div><span className="font-bold text-[#F2F2F2]">{persona?._count?.comments ?? 0}</span> Comments</div>
            </div>

            <div className="flex items-center justify-between text-xs">
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
                className="text-[#6F7076] hover:text-[#9A9A9F] cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Contextual Top Personas Section */}
        <TopPersonasWidget />

        {/* Minimal Footer Links */}
        <div className="px-1 text-[11px] text-[#6F7076] space-y-1">
          <div className="flex items-center gap-1.5 font-medium flex-wrap">
            <button onClick={() => onOpenInfoModal && onOpenInfoModal('privacy')} className="hover:text-[#9A9A9F] cursor-pointer">Privacy</button>
            <span>·</span>
            <button onClick={() => onOpenInfoModal && onOpenInfoModal('terms')} className="hover:text-[#9A9A9F] cursor-pointer">Terms</button>
            <span>·</span>
            <button onClick={() => onOpenInfoModal && onOpenInfoModal('guidelines')} className="hover:text-[#9A9A9F] cursor-pointer">Guidelines</button>
            <span>·</span>
            <button onClick={() => onOpenInfoModal && onOpenInfoModal('contact')} className="hover:text-[#9A9A9F] cursor-pointer">Contact</button>
          </div>
          <p className="text-[10px]">Persona Inc. © {new Date().getFullYear()}</p>
        </div>
      </aside>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  )
}
