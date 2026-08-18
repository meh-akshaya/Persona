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

  const authorColor = post.author?.personaColor || '#2563eb'
  const authorInitial = post.author?.personaName ? post.author.personaName.charAt(0).toUpperCase() : 'P'

  return (
    <article
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border)',
      }}
      className="rounded-2xl p-6 sm:p-7 border shadow-sm hover:border-[var(--text-muted)] transition-all animate-fade-in group"
    >
      {/* Top Author Row — Avatar Ring + Persona Name + Space Tag + Time */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          {/* Avatar Ring */}
          <div
            style={{ backgroundColor: authorColor }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs"
          >
            {authorInitial}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[var(--text-primary)]">
                {post.author?.personaName}
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Trust {post.author?.trustScore ?? 0}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] mt-0.5">
              <span>in</span>
              <Link
                to={`/c/${post.community?.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="font-semibold text-[var(--text-secondary)] hover:text-amber-400 transition-colors"
              >
                {post.community?.name}
              </Link>
            </div>
          </div>
        </div>

        <span style={{ color: 'var(--text-muted)' }} className="text-[11px]">
          {timeAgo(post.createdAt)}
        </span>
      </div>

      {/* Main Content Text */}
      <Link to={`/post/${post.id}`} className="block group-hover:opacity-95 transition-opacity">
        <p style={{ color: 'var(--text-primary)' }} className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-normal">
          {post.content}
        </p>

        {/* Privacy Leak Alert */}
        {post.hasPrivacyLeak && (
          <div
            style={{
              backgroundColor: 'var(--warning-bg)',
              borderColor: 'var(--warning-border)',
              color: 'var(--warning-text)',
            }}
            className="mt-4 p-3.5 rounded-xl border text-xs flex items-center gap-2 font-medium"
          >
            <svg className="w-4 h-4 text-amber-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>
              Privacy Warning: Post contains potential personal contact info ({post.privacyLeaks?.join(', ') || 'detected'}).
            </span>
          </div>
        )}
      </Link>

      {/* Reaction feedback toast */}
      {reactionMsg && (
        <div className="mt-2 text-[11px] font-semibold text-rose-500">
          {reactionMsg}
        </div>
      )}

      {/* Action Toolbar — Clean SVG Icons */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-[var(--border)] text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-2.5">
          {/* Helpful Reaction */}
          <button
            onClick={(e) => handleReaction(e, 'HELPFUL')}
            title="Mark as Helpful (+1 Trust Score)"
            className={`px-3.5 py-2 rounded-xl border font-medium flex items-center gap-1.5 transition-all text-xs ${
              activeReaction === 'HELPFUL'
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold'
                : 'bg-[var(--border-subtle)] border-transparent hover:text-[var(--text-primary)]'
            }`}
          >
            <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span className="hidden sm:inline">Helpful</span>
          </button>

          {/* Insightful Reaction */}
          <button
            onClick={(e) => handleReaction(e, 'INSIGHTFUL')}
            title="Mark as Insightful (+1 Trust Score)"
            className={`px-3.5 py-2 rounded-xl border font-medium flex items-center gap-1.5 transition-all text-xs ${
              activeReaction === 'INSIGHTFUL'
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold'
                : 'bg-[var(--border-subtle)] border-transparent hover:text-[var(--text-primary)]'
            }`}
          >
            <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="hidden sm:inline">Insightful</span>
          </button>

          {/* Support Reaction */}
          <button
            onClick={(e) => handleReaction(e, 'SUPPORTIVE')}
            title="Mark as Support (+1 Trust Score)"
            className={`px-3.5 py-2 rounded-xl border font-medium flex items-center gap-1.5 transition-all text-xs ${
              activeReaction === 'SUPPORTIVE'
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-bold'
                : 'bg-[var(--border-subtle)] border-transparent hover:text-[var(--text-primary)]'
            }`}
          >
            <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2" />
            </svg>
            <span className="hidden sm:inline">Support</span>
          </button>

          <span className="text-xs font-semibold ml-1 text-[var(--text-muted)]">
            {reactionsCount}
          </span>
        </div>

        {/* Comment Count Link */}
        <Link
          to={`/post/${post.id}`}
          className="flex items-center gap-1.5 font-semibold hover:text-amber-400 transition-colors px-2.5 py-1.5"
        >
          <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{post._count?.comments || 0} comments</span>
        </Link>
      </div>
    </article>
  )
}