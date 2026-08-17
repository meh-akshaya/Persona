import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

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
        <div className="p-2 text-xs rounded-lg bg-rose-500/10 text-rose-500 font-medium">
          ⚠️ {error}
        </div>
      )}

      <div className="relative">
        <textarea
          rows={parentId ? 2 : 3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          style={{
            backgroundColor: 'var(--bg-sidebar)',
            borderColor: 'var(--border)',
            color: 'var(--text-primary)',
          }}
          className="w-full p-3 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-none transition-all"
        />

        {/* Floating Persona Badge */}
        {isLoggedIn && persona && (
          <div className="absolute right-3 bottom-3 text-[10px] font-semibold opacity-60 flex items-center gap-1">
            <span>Commenting as {persona.emoji} {persona.name}</span>
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
          style={{
            backgroundColor: 'var(--accent)',
            color: '#ffffff',
          }}
          className="px-4 py-1.5 rounded-xl text-xs font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Posting...' : parentId ? 'Reply' : 'Post Comment'}
        </button>
      </div>
    </form>
  )
}
