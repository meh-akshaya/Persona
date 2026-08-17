import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'

export default function PostCard({ post, onReactionUpdated }) {
  const { isLoggedIn, persona } = useAuth()
  const navigate = useNavigate()
  const [reactionsCount, setReactionsCount] = useState(post._count?.reactions || 0)
  const [activeReaction, setActiveReaction] = useState(post.userReaction || null)
  const [reacting, setReacting] = useState(false)
  const [reactionMsg, setReactionMsg] = useState(null)

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return `${Math.max(1, seconds)}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const handleReaction = async (e, type) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      navigate('/login')
      return
    }

    if (post.author?.personaName === persona?.name) {
      setReactionMsg('Cannot react to your own post')
      setTimeout(() => setReactionMsg(null), 2000)
      return
    }

    if (reacting) return
    setReacting(true)

    try {
      if (activeReaction === type) {
        // Remove reaction
        await api.delete(`/reactions/${post.id}`)
        setActiveReaction(null)
        setReactionsCount(prev => Math.max(0, prev - 1))
      } else {
        // Add or change reaction
        await api.post('/reactions', { postId: post.id, type })
        if (!activeReaction) {
          setReactionsCount(prev => prev + 1)
        }
        setActiveReaction(type)
      }
      if (onReactionUpdated) onReactionUpdated(post.id)
    } catch (err) {
      setReactionMsg(err.response?.data?.error || 'Reaction failed')
      setTimeout(() => setReactionMsg(null), 2000)
    } finally {
      setReacting(false)
    }
  }

  const authorColor = post.author?.personaColor || '#7c5cfc'

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--card-shadow)',
      }}
      className="rounded-2xl p-5 hover:border-[var(--accent-text)] transition-all animate-fade-in group"
    >
      {/* Top row — persona + community + trust score + time */}
      <div className="flex items-center gap-2 mb-3 text-xs flex-wrap">
        {/* Persona Pill */}
        <span
          style={{
            backgroundColor: authorColor + '1c',
            borderColor: authorColor + '44',
            color: 'var(--text-primary)',
          }}
          className="font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5"
        >
          <span>{post.author?.personaEmoji || '🎭'}</span>
          <span>{post.author?.personaName}</span>
          <span
            style={{ backgroundColor: authorColor, color: '#ffffff' }}
            className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full ml-0.5"
            title="Trust score"
          >
            🛡️ {post.author?.trustScore ?? 0}
          </span>
        </span>

        <span style={{ color: 'var(--text-muted)' }} className="font-medium">in</span>

        {/* Community tag */}
        <Link
          to={`/c/${post.community?.slug}`}
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'var(--bg-sidebar)',
            color: 'var(--text-secondary)',
          }}
          className="font-semibold px-2.5 py-1 rounded-full hover:bg-[var(--border)] transition-colors flex items-center gap-1"
        >
          <span>{post.community?.icon}</span>
          <span>{post.community?.name}</span>
        </Link>

        <span style={{ color: 'var(--text-muted)' }} className="ml-auto text-[11px]">
          {timeAgo(post.createdAt)}
        </span>
      </div>

      {/* Main Content Body */}
      <Link to={`/post/${post.id}`} className="block">
        <p
          style={{ color: 'var(--text-primary)' }}
          className="text-sm leading-relaxed whitespace-pre-wrap line-clamp-4 font-normal"
        >
          {post.content}
        </p>

        {/* Privacy Leak Warning Badge */}
        {post.hasPrivacyLeak && (
          <div
            style={{
              backgroundColor: 'var(--warning-bg)',
              borderColor: 'var(--warning-border)',
              color: 'var(--warning-text)',
            }}
            className="mt-3 p-2.5 rounded-xl border text-xs flex items-center gap-2 font-medium"
          >
            <span>⚠️</span>
            <span>
              Privacy Warning: Post contains potential personal contact info ({post.privacyLeaks?.join(', ') || 'detected'}).
            </span>
          </div>
        )}
      </Link>

      {/* Reaction feedback toast */}
      {reactionMsg && (
        <div className="mt-2 text-[11px] font-semibold text-rose-500 animate-fade-in">
          ⚠️ {reactionMsg}
        </div>
      )}

      {/* Footer bar — Reactions & Comment counters */}
      <div
        style={{ borderColor: 'var(--border)' }}
        className="flex items-center justify-between mt-4 pt-3 border-t text-xs"
      >
        {/* Quick Reaction buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => handleReaction(e, 'HELPFUL')}
            title="Mark as Helpful (+1 Trust Score to Author)"
            style={{
              backgroundColor: activeReaction === 'HELPFUL' ? 'var(--accent-light)' : 'var(--bg-sidebar)',
              color: activeReaction === 'HELPFUL' ? 'var(--accent-text)' : 'var(--text-secondary)',
              borderColor: activeReaction === 'HELPFUL' ? 'var(--accent-text)' : 'transparent',
            }}
            className="px-2.5 py-1 rounded-lg border font-medium hover:scale-105 transition-all flex items-center gap-1"
          >
            <span>💡</span>
            <span className="hidden sm:inline">Helpful</span>
          </button>

          <button
            onClick={(e) => handleReaction(e, 'INSIGHTFUL')}
            title="Mark as Insightful (+1 Trust Score to Author)"
            style={{
              backgroundColor: activeReaction === 'INSIGHTFUL' ? 'var(--accent-light)' : 'var(--bg-sidebar)',
              color: activeReaction === 'INSIGHTFUL' ? 'var(--accent-text)' : 'var(--text-secondary)',
              borderColor: activeReaction === 'INSIGHTFUL' ? 'var(--accent-text)' : 'transparent',
            }}
            className="px-2.5 py-1 rounded-lg border font-medium hover:scale-105 transition-all flex items-center gap-1"
          >
            <span>🧠</span>
            <span className="hidden sm:inline">Insightful</span>
          </button>

          <button
            onClick={(e) => handleReaction(e, 'SUPPORTIVE')}
            title="Mark as Supportive (+1 Trust Score to Author)"
            style={{
              backgroundColor: activeReaction === 'SUPPORTIVE' ? 'var(--accent-light)' : 'var(--bg-sidebar)',
              color: activeReaction === 'SUPPORTIVE' ? 'var(--accent-text)' : 'var(--text-secondary)',
              borderColor: activeReaction === 'SUPPORTIVE' ? 'var(--accent-text)' : 'transparent',
            }}
            className="px-2.5 py-1 rounded-lg border font-medium hover:scale-105 transition-all flex items-center gap-1"
          >
            <span>💜</span>
            <span className="hidden sm:inline">Support</span>
          </button>

          <span style={{ color: 'var(--text-muted)' }} className="text-xs font-semibold ml-1">
            {reactionsCount}
          </span>
        </div>

        {/* Comment Counter Link */}
        <Link
          to={`/post/${post.id}`}
          style={{ color: 'var(--text-secondary)' }}
          className="flex items-center gap-1.5 font-semibold hover:text-[var(--accent-text)] transition-colors px-2 py-1"
        >
          <span>💬</span>
          <span>{post._count?.comments || 0} comments</span>
        </Link>
      </div>
    </div>
  )
}