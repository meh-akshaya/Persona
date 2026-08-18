import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../../api/axios'
import BitmojiAvatar from '../common/BitmojiAvatar'

export default function TopPersonasWidget() {
  const location = useLocation()
  const [topPersonas, setTopPersonas] = useState([])
  const [communityName, setCommunityName] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAllModal, setShowAllModal] = useState(false)

  // Extract space slug from location pathname safely (e.g. /c/coding-tech => coding-tech)
  const pathParts = (location.pathname || '').split('/').filter(Boolean)
  const currentSlug = (pathParts[0] === 'c' && pathParts[1]) ? pathParts[1] : null

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    const targetSlug = currentSlug || 'all'
    api.get(`/communities/top-personas?slug=${targetSlug}&limit=5`)
      .then(res => {
        if (!isMounted) return
        setTopPersonas(Array.isArray(res.data?.topPersonas) ? res.data.topPersonas : [])
        if (res.data?.community?.name) {
          setCommunityName(String(res.data.community.name))
        } else if (currentSlug) {
          const clean = String(currentSlug).replace(/-/g, ' ').toUpperCase()
          setCommunityName(clean)
        } else {
          setCommunityName('')
        }
      })
      .catch(err => {
        console.error('TopPersonas fetch error:', err)
        if (isMounted) setTopPersonas([])
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [currentSlug])

  const headingText = communityName
    ? `TOP PERSONAS IN ${String(communityName).toUpperCase()}`
    : 'TOP PERSONAS IN ALL SPACES'

  return (
    <div className="bg-[#151518] border border-[#25252A] rounded-[8px] p-4 mb-5 text-xs animate-fade-in">
      {/* Widget Section Title */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#25252A]">
        <h3 className="text-[10px] font-bold text-[#6F7076] tracking-wider uppercase truncate pr-2">
          {headingText}
        </h3>
        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-[4px] bg-[#0D0D0F] text-[#F5B800] border border-[#25252A] shrink-0">
          Trust Ranked
        </span>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-3 py-1">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-2.5 animate-pulse">
              <div className="w-4 h-4 bg-[#25252A] rounded shrink-0" />
              <div className="w-5 h-5 bg-[#25252A] rounded-full shrink-0" />
              <div className="flex-1 h-4 bg-[#25252A] rounded" />
              <div className="w-12 h-3 bg-[#25252A] rounded shrink-0" />
            </div>
          ))}
        </div>
      ) : topPersonas.length === 0 ? (
        <p className="text-[11px] text-[#6F7076] py-2 text-center">
          No personas ranked yet.
        </p>
      ) : (
        <div className="space-y-2.5">
          {topPersonas.map((user, idx) => {
            const rankStr = String(idx + 1).padStart(2, '0')
            const isTop3 = idx < 3

            return (
              <div
                key={user.id || idx}
                className="flex items-center justify-between gap-2.5 py-1 px-1.5 rounded-[6px] hover:bg-[#0D0D0F]/60 transition-colors group"
              >
                {/* Rank Number + Avatar + Username */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`text-[11px] font-mono font-bold shrink-0 ${
                      isTop3 ? 'text-[#F5B800]' : 'text-[#6F7076]'
                    }`}
                  >
                    {rankStr}
                  </span>

                  <BitmojiAvatar
                    seed={user.personaName}
                    avatarConfig={user.avatarConfig}
                    size={22}
                  />

                  <span className="truncate text-xs font-semibold text-[#F2F2F2] group-hover:text-[#F5B800] transition-colors">
                    {user.personaName}
                  </span>
                </div>

                {/* Trust Score Badge */}
                <div className="shrink-0 text-right">
                  <span className="text-[10px] text-[#9A9A9F] font-medium">
                    Trust <span className="font-bold text-[#F5B800]">{user.trustScore ?? 0}</span>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* View All Footer Link */}
      <div className="pt-3 mt-3 border-t border-[#25252A] flex items-center justify-between text-[11px]">
        <span className="text-[#6F7076]">Based on community trust</span>
        <button
          onClick={() => setShowAllModal(true)}
          className="text-[#9A9A9F] hover:text-[#F5B800] font-semibold transition-colors cursor-pointer flex items-center gap-1"
        >
          <span>View all</span>
          <span>→</span>
        </button>
      </div>

      {/* Optional "View All" Leaderboard Modal */}
      {showAllModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-sm rounded-[8px] p-5 bg-[#151518] border border-[#25252A] text-[#F2F2F2] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#25252A] mb-4">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#F2F2F2]">
                  {headingText}
                </h3>
                <p className="text-[10px] text-[#9A9A9F]">Top community contributors</p>
              </div>
              <button
                onClick={() => setShowAllModal(false)}
                className="p-1 rounded text-[#9A9A9F] hover:text-[#F2F2F2]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar pr-1">
              {topPersonas.map((user, idx) => (
                <div key={user.id || idx} className="flex items-center justify-between p-2 rounded-[6px] bg-[#0D0D0F] border border-[#25252A]">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-[#F5B800]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <BitmojiAvatar seed={user.personaName} avatarConfig={user.avatarConfig} size={24} />
                    <span className="text-xs font-bold text-[#F2F2F2]">{user.personaName}</span>
                  </div>
                  <span className="text-xs text-[#9A9A9F]">
                    Trust <span className="font-bold text-[#F5B800]">{user.trustScore ?? 0}</span>
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAllModal(false)}
              className="w-full mt-4 py-2 rounded-[6px] text-xs font-bold text-[#0D0D0F] bg-[#F5B800] hover:bg-[#e0a800] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
