import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import BitmojiAvatar from '../common/BitmojiAvatar'

export default function PostCard({ post, onReactionUpdated, isDetail = false }) {
  const { isLoggedIn, persona } = useAuth()
  const navigate = useNavigate()
  const [reactionsCount, setReactionsCount] = useState(post._count?.reactions || 0)
  const [activeReaction, setActiveReaction] = useState(post.userReaction || null)
  const [reacting, setReacting] = useState(false)
  const [reactionMsg, setReactionMsg] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)

  const MAX_LINES = 3
  const MAX_CHARS = 220

  const content = post.content || ''
  const lines = content.split('\n')
  const isLong = !isDetail && (content.length > MAX_CHARS || lines.length > MAX_LINES)

  let displayedContent = content
  if (isLong && !isExpanded) {
    if (lines.length > MAX_LINES) {
      const truncatedLines = lines.slice(0, MAX_LINES).join('\n')
      displayedContent = truncatedLines.length > MAX_CHARS
        ? truncatedLines.slice(0, MAX_CHARS).trim() + '...'
        : truncatedLines + '...'
    } else {
      displayedContent = content.slice(0, MAX_CHARS).trim() + '...'
    }
  }

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

  // Use saved persona avatar config if available locally
  const savedAvatarConfig = (persona && persona.name === post.author?.personaName)
    ? persona.avatarConfig
    : post.author?.avatarConfig

  return (
    <article className="py-4 sm:py-5 px-2 sm:px-3 hover:bg-[#151518]/50 transition-colors animate-fade-in group rounded-[6px]">
      {/* Top Metadata Row: Avatar + Username + Trust + Space + Time */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5">
          {/* Layered Bitmoji Avatar */}
          <BitmojiAvatar
            seed={post.author?.personaName || 'Persona'}
            avatarConfig={savedAvatarConfig}
            size={30}
          />

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-semibold text-[#F2F2F2]">
              {post.author?.personaName}
            </span>

            <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-[4px] bg-[#151518] text-[#9A9A9F] border border-[#25252A]">
              Trust <span className="text-[#F5B800] font-bold">{post.author?.trustScore ?? 0}</span>
            </span>

            <span className="text-[#6F7076] text-xs">·</span>

            <Link
              to={`/c/${post.community?.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-[#9A9A9F] hover:text-[#F2F2F2] font-medium transition-colors"
            >
              {post.community?.name}
            </Link>
          </div>
        </div>

        <span className="text-[11px] text-[#6F7076] shrink-0">
          {timeAgo(post.createdAt)}
        </span>
      </div>

      {/* Main Content Text — Highest Visual Priority */}
      <div className="my-2">
        <Link to={`/post/${post.id}`} className="block group-hover:opacity-95 transition-opacity">
          <p className="text-[15px] sm:text-[16px] text-[#F2F2F2] leading-relaxed whitespace-pre-wrap font-normal">
            {displayedContent}
          </p>
        </Link>

        {isLong && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setIsExpanded(prev => !prev)
            }}
            className="mt-1.5 text-xs font-semibold text-[#F5B800] hover:text-[#ffd24d] transition-colors cursor-pointer inline-flex items-center gap-1 focus:outline-none"
          >
            {isExpanded ? 'Read less' : 'Read more...'}
          </button>
        )}

        {/* Privacy Leak Alert */}
        {post.hasPrivacyLeak && (
          <Link to={`/post/${post.id}`} className="block">
            <div
              style={{
                backgroundColor: 'var(--warning-bg)',
                borderColor: 'var(--warning-border)',
                color: 'var(--warning-text)',
              }}
              className="mt-3 p-3 rounded-[6px] border text-xs flex items-center gap-2 font-medium"
            >
              <svg className="w-4 h-4 text-[#F5B800] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>
                Privacy Warning: Post contains potential personal contact info ({post.privacyLeaks?.join(', ') || 'detected'}).
              </span>
            </div>
          </Link>
        )}
      </div>

      {/* Reaction feedback toast */}
      {reactionMsg && (
        <div className="mt-1 text-[11px] font-semibold text-rose-400">
          {reactionMsg}
        </div>
      )}

      {/* Action Toolbar — Quieter Secondary Controls */}
      <div className="flex items-center justify-between mt-3 text-xs text-[#9A9A9F]">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Helpful Reaction */}
          <button
            onClick={(e) => handleReaction(e, 'HELPFUL')}
            title="Mark as Helpful (+1 Trust Score)"
            className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              activeReaction === 'HELPFUL'
                ? 'bg-[#F5B800]/15 text-[#F5B800] border-[#F5B800]/40 font-bold'
                : 'bg-[#151518]/80 text-[#9A9A9F] border-[#25252A] hover:text-[#F2F2F2] hover:bg-[#151518]'
            }`}
          >
            <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Helpful</span>
          </button>

          {/* Insightful Reaction */}
          <button
            onClick={(e) => handleReaction(e, 'INSIGHTFUL')}
            title="Mark as Insightful (+1 Trust Score)"
            className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              activeReaction === 'INSIGHTFUL'
                ? 'bg-[#F5B800]/15 text-[#F5B800] border-[#F5B800]/40 font-bold'
                : 'bg-[#151518]/80 text-[#9A9A9F] border-[#25252A] hover:text-[#F2F2F2] hover:bg-[#151518]'
            }`}
          >
            <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span>Insightful</span>
          </button>

          {/* Support Reaction */}
          <button
            onClick={(e) => handleReaction(e, 'SUPPORTIVE')}
            title="Mark as Support (+1 Trust Score)"
            className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
              activeReaction === 'SUPPORTIVE'
                ? 'bg-[#F5B800]/15 text-[#F5B800] border-[#F5B800]/40 font-bold'
                : 'bg-[#151518]/80 text-[#9A9A9F] border-[#25252A] hover:text-[#F2F2F2] hover:bg-[#151518]'
            }`}
          >
            <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="1.75" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2" />
            </svg>
            <span>Support</span>
          </button>

          {reactionsCount > 0 && (
            <span className="text-[11px] font-semibold text-[#6F7076] ml-0.5">
              {reactionsCount}
            </span>
          )}
        </div>

        {/* Comment Count Link */}
        <Link
          to={`/post/${post.id}`}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#151518]/40 border border-[#25252A] text-xs text-[#9A9A9F] hover:text-[#F2F2F2] hover:bg-[#151518] font-medium transition-colors"
        >
          <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="1.75" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{post._count?.comments || 0} comments</span>
        </Link>
      </div>
    </article>
  )
}