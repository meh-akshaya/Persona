import { useState } from 'react'
import CommentComposer from './CommentComposer'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function CommentThread({ comment, postId, onReplyAdded, depth = 0 }) {
  const [replying, setReplying] = useState(false)
  const [replies, setReplies] = useState(comment.replies || [])
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

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

  const authorColor = comment.author?.personaColor || '#7c5cfc'

  return (
    <div className={`flex flex-col gap-2 ${depth > 0 ? 'ml-4 pl-3 border-l-2 border-[var(--border)]' : ''}`}>
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border)',
        }}
        className="p-3.5 rounded-xl border text-xs animate-fade-in"
      >
        {/* Comment Header */}
        <div className="flex items-center gap-2 mb-2">
          <span
            style={{
              backgroundColor: authorColor + '1a',
              color: 'var(--text-primary)',
              borderColor: authorColor + '44',
            }}
            className="font-bold px-2 py-0.5 rounded-full border text-[11px] flex items-center gap-1"
          >
            <span>{comment.author?.personaEmoji || '🎭'}</span>
            <span>{comment.author?.personaName}</span>
            <span
              style={{ backgroundColor: authorColor, color: '#ffffff' }}
              className="text-[9px] font-extrabold px-1.5 py-0.1 rounded-full ml-0.5"
            >
              🛡️ {comment.author?.trustScore ?? 0}
            </span>
          </span>

          <span style={{ color: 'var(--text-muted)' }} className="text-[10px] ml-auto">
            {timeAgo(comment.createdAt)}
          </span>
        </div>

        {/* Comment Content */}
        <p style={{ color: 'var(--text-primary)' }} className="text-xs leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </p>

        {/* Reply Action button */}
        <div className="mt-2.5 flex items-center gap-3">
          <button
            onClick={() => {
              if (!isLoggedIn) return navigate('/login')
              setReplying(!replying)
            }}
            style={{ color: 'var(--text-secondary)' }}
            className="text-[11px] font-semibold hover:text-[var(--accent-text)] transition-colors flex items-center gap-1"
          >
            <span>💬</span>
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
