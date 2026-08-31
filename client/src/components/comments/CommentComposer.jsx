import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import BitmojiAvatar from '../common/BitmojiAvatar'
import {
  stripInvisibleChars,
  sanitizeAndTrimText,
  isInvalidText,
  handlePasteSanitization,
} from '../../utils/textSanitizer'

const MAX_COMMENT_LENGTH = 300

export default function CommentComposer({ postId, parentId = null, onCommentAdded, placeholder = 'Add an anonymous comment...', onCancel }) {
  const { isLoggedIn, persona } = useAuth()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleTextChange = (e) => {
    const rawText = e.target.value
    const text = stripInvisibleChars(rawText)
    setContent(text)
    if (error && !isInvalidText(text)) {
      setError(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    const cleanedContent = sanitizeAndTrimText(content)
    if (!cleanedContent) {
      return setError('Comment content cannot be empty or contain only spaces/invisible characters.')
    }
    if (cleanedContent.length > MAX_COMMENT_LENGTH) {
      return setError(`Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`)
    }

    setLoading(true)
    setError(null)

    try {
      const res = await api.post('/comments', { content: cleanedContent, postId, parentId })
      if (res.data?.comment) {
        onCommentAdded(res.data.comment)
        setContent('')
        if (onCancel) onCancel()
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit comment.')
    } finally {
      setLoading(false)
    }
  }

  const isOverLimit = content.length > MAX_COMMENT_LENGTH
  const isNearLimit = content.length >= MAX_COMMENT_LENGTH - 30

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {error && (
        <div className="p-2 text-xs rounded-[6px] bg-rose-500/10 text-rose-500 font-medium border border-rose-500/20">
          {error}
        </div>
      )}

      <div className="relative">
        <textarea
          rows={parentId ? 2 : 3}
          maxLength={MAX_COMMENT_LENGTH}
          value={content}
          onChange={handleTextChange}
          onPaste={(e) => handlePasteSanitization(e, setContent, setError)}
          placeholder={placeholder}
          className={`w-full p-3 rounded-[8px] border bg-[#0D0D0F] text-[#F2F2F2] text-xs focus:outline-none resize-none transition-all placeholder:text-[#6F7076] ${
            isOverLimit
              ? 'border-rose-500/60 focus:border-rose-500'
              : 'border-[#25252A] focus:border-[#F5B800]'
          }`}
        />

        {/* Floating Persona Badge */}
        {isLoggedIn && persona && (
          <div className="absolute right-3 bottom-3 text-[10px] font-semibold text-[#9A9A9F] flex items-center gap-1.5 bg-[#151518]/90 px-2 py-1 rounded-[4px] border border-[#25252A]">
            <BitmojiAvatar
              seed={persona.name}
              avatarConfig={persona.avatarConfig}
              size={14}
            />
            <span>As {persona.name}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-[11px] font-medium tabular-nums transition-colors ${
            isOverLimit
              ? 'text-rose-400 font-bold'
              : isNearLimit
              ? 'text-[#F5B800]'
              : 'text-[#6F7076]'
          }`}
        >
          {content.length}/{MAX_COMMENT_LENGTH}
        </span>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{ color: 'var(--text-secondary)' }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-80 transition-opacity cursor-pointer"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading || isInvalidText(content) || isOverLimit}
            className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Posting...' : parentId ? 'Reply' : 'Post Comment'}
          </button>
        </div>
      </div>
    </form>
  )
}
