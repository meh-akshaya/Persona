import { useState } from 'react'
import CommentComposer from './CommentComposer'
import { useAuth } from '../../context/AuthContext'
import { useSecurity } from '../../context/SecurityContext'
import { useNavigate } from 'react-router-dom'
import BitmojiAvatar from '../common/BitmojiAvatar'

export default function CommentThread({ comment, postId, onReplyAdded, depth = 0 }) {
  const [replying, setReplying] = useState(false)
  const [replies, setReplies] = useState(comment.replies || [])
  const { isLoggedIn, persona } = useAuth()
  const security = useSecurity()
  const showCopyWarning = security?.showCopyWarning
  const navigate = useNavigate()

  const handleCopyAttempt = (e) => {
    e.preventDefault()
    if (showCopyWarning) {
      showCopyWarning('Copying a message is not allowed.')
    }
  }

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return `${Math.max(1, seconds)}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const handleChildReplyAdded = (newReply) => {
    setReplies(prev => [...prev, newReply])
    if (onReplyAdded) onReplyAdded(newReply)
  }

  const savedAvatarConfig = (persona && persona.name === comment.author?.personaName)
    ? persona.avatarConfig
    : comment.author?.avatarConfig

  return (
    <div className={`flex flex-col gap-2 ${depth > 0 ? 'ml-4 pl-3 border-l-2 border-[#25252A]' : ''}`}>
      <div className="p-3.5 rounded-[8px] border border-[#25252A] bg-[#151518] text-xs animate-fade-in">
        {/* Comment Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-2">
            <BitmojiAvatar
              seed={comment.author?.personaName || 'Persona'}
              avatarConfig={savedAvatarConfig}
              size={24}
            />
            <span className="font-bold text-xs text-[#F2F2F2]">
              {comment.author?.personaName}
            </span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              Trust {comment.author?.trustScore ?? 0}
            </span>
          </div>

          <span style={{ color: 'var(--text-muted)' }} className="text-[10px] ml-auto">
            {timeAgo(comment.createdAt)}
          </span>
        </div>

        {/* Comment Content */}
        <p
          style={{ color: 'var(--text-primary)' }}
          className="text-xs leading-relaxed whitespace-pre-wrap font-normal select-none"
          onCopy={handleCopyAttempt}
          onCut={handleCopyAttempt}
          onDragStart={(e) => e.preventDefault()}
        >
          {comment.content}
        </p>

        {/* Reply Action button */}
        <div className="mt-2.5 flex items-center gap-3">
          <button
            onClick={() => {
              if (!isLoggedIn) return navigate('/login')
              setReplying(!replying)
            }}
            className="text-[11px] font-semibold text-[var(--text-secondary)] hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span>Reply</span>
          </button>
        </div>

        {/* Nested Reply Composer */}
        {replying && (
          <div className="mt-3 pt-3 border-t border-[var(--border)]">
            <CommentComposer
              postId={postId}
              parentId={comment.id}
              placeholder={`Reply to ${comment.author?.personaName}...`}
              onCancel={() => setReplying(false)}
              onCommentAdded={(newReply) => {
                handleChildReplyAdded(newReply)
                setReplying(false)
              }}
            />
          </div>
        )}
      </div>

      {/* Recursive Replies */}
      {replies.length > 0 && (
        <div className="flex flex-col gap-2 mt-1">
          {replies.map(reply => (
            <CommentThread
              key={reply.id}
              comment={reply}
              postId={postId}
              onReplyAdded={onReplyAdded}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
