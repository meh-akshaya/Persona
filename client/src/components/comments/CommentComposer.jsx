import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import BitmojiAvatar from '../common/BitmojiAvatar'

export default function CommentComposer({ postId, parentId = null, onCommentAdded, placeholder = 'Add an anonymous comment...', onCancel }) {
  const { isLoggedIn, persona } = useAuth()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isLoggedIn) {
      navigate('/login')
      return
    }
    if (!content.trim()) return

    setLoading(true)
    setError(null)

    try {
      const res = await api.post('/comments', { content, postId, parentId })
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
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          className="w-full p-3 rounded-[8px] border border-[#25252A] bg-[#0D0D0F] text-[#F2F2F2] text-xs focus:outline-none focus:border-[#F5B800] resize-none transition-all placeholder:text-[#6F7076]"
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

      <div className="flex items-center justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{ color: 'var(--text-secondary)' }}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-80 transition-opacity"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? 'Posting...' : parentId ? 'Reply' : 'Post Comment'}
        </button>
      </div>
    </form>
  )
}
