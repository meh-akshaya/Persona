import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function Sidebar() {
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(true)
  const { slug } = useParams()
  const { persona, isLoggedIn } = useAuth()

  useEffect(() => {
    api.get('/communities')
      .then(res => setCommunities(res.data.communities || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <aside
      style={{
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border)',
        width: '240px',
        minWidth: '240px',
      }}
      className="fixed top-14 left-0 h-[calc(100vh-56px)] hidden md:flex flex-col justify-between py-4 z-30"
    >
      <div className="overflow-y-auto px-3">
        {/* Main Feed Link */}
        <div className="mb-2">
          <Link
            to="/"
            style={{
              backgroundColor: !slug ? 'var(--accent-light)' : 'transparent',
              color: !slug ? 'var(--accent-text)' : 'var(--text-primary)',
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold hover:opacity-85 transition-all"
          >
            <span className="text-base">🌐</span>
            <span>All Communities</span>
          </Link>
        </div>

        <div style={{ borderColor: 'var(--border)' }} className="border-t my-3 mx-1" />

        {/* Communities Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <span
              style={{ color: 'var(--text-muted)' }}
              className="text-[10px] font-bold uppercase tracking-wider"
            >
              Spaces ({communities.length})
            </span>
          </div>

          {loading ? (
            <div className="px-3 py-4 flex flex-col gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-8 rounded-lg bg-[var(--border)] animate-pulse-subtle" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-0.5">
              {communities.map(c => {
                const isActive = slug === c.slug
                return (
                  <Link
                    key={c.id}
                    to={`/c/${c.slug}`}
                    style={{
                      backgroundColor: isActive ? 'var(--accent-light)' : 'transparent',
                      color: isActive ? 'var(--accent-text)' : 'var(--text-primary)',
                    }}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium hover:bg-[var(--border-subtle)] transition-all group"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-sm">{c.icon}</span>
                      <span className="truncate">{c.name}</span>
                    </div>
                    {c._count?.posts > 0 && (
                      <span
                        style={{
                          backgroundColor: isActive ? 'var(--accent)' : 'var(--border)',
                          color: isActive ? '#ffffff' : 'var(--text-secondary)',
                        }}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full group-hover:opacity-100 transition-opacity"
                      >
                        {c._count.posts}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom User Mini Persona Card */}
      {isLoggedIn && persona && (
        <div className="px-3 pt-3 border-t border-[var(--border)]">
          <div
            style={{
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
            }}
            className="p-3 rounded-xl flex items-center gap-2.5 shadow-xs"
          >
            <div
              style={{
                backgroundColor: persona.color || '#7c5cfc',
              }}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
            >
              {persona.emoji || '🎭'}
            </div>
            <div className="overflow-hidden leading-tight flex-1">
              <p className="text-xs font-bold truncate">{persona.name}</p>
              <p style={{ color: 'var(--text-muted)' }} className="text-[10px] truncate mt-0.5">
                🛡️ Trust Score: {persona.trustScore || 0}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}