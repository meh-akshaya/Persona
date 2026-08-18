import { useState, useEffect } from 'react'
import api from '../../api/axios'

// Client-side Privacy Leak Scanner matching server logic
const detectClientPrivacyLeaks = (text) => {
  const leaks = []
  if (!text) return { hasLeak: false, leaks }

  // Email check
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
  if (emailRegex.test(text)) leaks.push('email')

  // Phone check
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/
  if (phoneRegex.test(text)) leaks.push('phone')

  // Instagram/social handle
  const igRegex = /@[\w\.]+/
  if (igRegex.test(text)) leaks.push('instagram')

  // Personal URL
  const linkRegex = /https?:\/\/\S+|www\.\S+/
  if (linkRegex.test(text)) leaks.push('personal link')

  return {
    hasLeak: leaks.length > 0,
    leaks,
  }
}

export default function CreatePostModal({ isOpen, onClose, onPostCreated, preselectedCommunityId }) {
  const [content, setContent] = useState('')
  const [communityId, setCommunityId] = useState(preselectedCommunityId || '')
  const [communities, setCommunities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [privacyAlert, setPrivacyAlert] = useState({ hasLeak: false, leaks: [] })

  useEffect(() => {
    if (isOpen) {
      api.get('/communities')
        .then(res => {
          const list = res.data.communities || []
          setCommunities(list)
          if (preselectedCommunityId) {
            setCommunityId(preselectedCommunityId)
          } else if (!communityId && list.length > 0) {
            setCommunityId(list[0].id)
          }
        })
        .catch(console.error)
    }
  }, [isOpen, preselectedCommunityId])

  // Live privacy detection on text change
  const handleContentChange = (e) => {
    const text = e.target.value
    setContent(text)
    setPrivacyAlert(detectClientPrivacyLeaks(text))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return setError('Please write some content before posting.')
    if (!communityId) return setError('Please select a community.')

    setLoading(true)
    setError(null)

    try {
      const res = await api.post('/posts', { content, communityId })
      if (res.data?.post) {
        onPostCreated(res.data.post)
        setContent('')
        setPrivacyAlert({ hasLeak: false, leaks: [] })
        onClose()
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to publish post.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--modal-overlay)] backdrop-blur-xs animate-fade-in">
      <div
        style={{
          backgroundColor: 'var(--bg-modal)',
          border: '1px solid var(--border)',
          color: 'var(--text-primary)',
        }}
        className="relative w-full max-w-lg rounded-2xl p-6 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <h2 className="text-base font-bold text-[var(--text-primary)]">Create Anonymous Post</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[var(--border)] transition-colors text-[var(--text-secondary)] text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {error && (
            <div className="p-3 text-xs rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 font-medium">
              {error}
            </div>
          )}

          {/* Community selector */}
          <div>
            <label style={{ color: 'var(--text-secondary)' }} className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
              Select Community
            </label>
            <select
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
              style={{
                backgroundColor: 'var(--bg-sidebar)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium focus:outline-none focus:border-blue-500"
            >
              <option value="" disabled>Choose a community...</option>
              {communities.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Content Area */}
          <div>
            <label style={{ color: 'var(--text-secondary)' }} className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
              What's on your mind?
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={handleContentChange}
              placeholder="Share your honest thoughts, experiences, or questions anonymously..."
              style={{
                backgroundColor: 'var(--bg-sidebar)',
                borderColor: privacyAlert.hasLeak ? 'var(--warning-border)' : 'var(--border)',
                color: 'var(--text-primary)',
              }}
              className="w-full p-3.5 rounded-xl border text-sm focus:outline-none focus:border-blue-500 resize-none transition-colors"
            />
          </div>

          {/* Live Privacy Detector Alert */}
          {privacyAlert.hasLeak && (
            <div
              style={{
                backgroundColor: 'var(--warning-bg)',
                borderColor: 'var(--warning-border)',
                color: 'var(--warning-text)',
              }}
              className="p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-fade-in"
            >
              <svg className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-bold">Privacy Warning Detected!</p>
                <p className="mt-0.5 opacity-90 leading-relaxed">
                  Your text appears to contain personal info: <span className="font-semibold">{privacyAlert.leaks.join(', ')}</span>.
                  To protect your anonymity, consider removing it. You can still post if intended.
                </p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] mt-2">
            <span style={{ color: 'var(--text-muted)' }} className="text-xs">
              Post attached to your persona
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Publishing...' : 'Publish Anonymously'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

