import { useState, useEffect } from 'react'
import api from '../../api/axios'
import {
  stripInvisibleChars,
  sanitizeAndTrimText,
  isInvalidText,
  handlePasteSanitization,
} from '../../utils/textSanitizer'

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

const MAX_POST_LENGTH = 500

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

  // Live privacy detection on text change (with invisible characters stripped)
  const handleContentChange = (e) => {
    const rawText = e.target.value
    const text = stripInvisibleChars(rawText)
    setContent(text)
    setPrivacyAlert(detectClientPrivacyLeaks(text))
    if (error && !isInvalidText(text)) {
      setError(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const cleanedContent = sanitizeAndTrimText(content)
    if (!cleanedContent) return setError('Post content cannot be empty or contain only spaces/invisible characters.')
    if (cleanedContent.length > MAX_POST_LENGTH) return setError(`Post cannot exceed ${MAX_POST_LENGTH} characters.`)
    if (!communityId) return setError('Please select a community.')

    setLoading(true)
    setError(null)

    try {
      const res = await api.post('/posts', { content: cleanedContent, communityId })
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

  const isOverLimit = content.length > MAX_POST_LENGTH
  const isNearLimit = content.length >= MAX_POST_LENGTH - 50

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg rounded-[8px] p-6 bg-[#151518] border border-[#25252A] text-[#F2F2F2] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#25252A]">
          <h2 className="text-sm font-bold text-[#F2F2F2]">Create Anonymous Post</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#25252A] transition-colors text-[#9A9A9F] text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          {error && (
            <div className="p-3 text-xs rounded-[6px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-medium">
              {error}
            </div>
          )}

          {/* Community selector */}
          <div>
            <label className="block text-xs font-semibold text-[#9A9A9F] uppercase tracking-wider mb-1.5">
              Select Community
            </label>
            <select
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
              className="w-full px-3 py-2 rounded-[8px] border border-[#25252A] bg-[#0D0D0F] text-[#F2F2F2] text-xs font-medium focus:outline-none focus:border-[#F5B800]"
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
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#9A9A9F] uppercase tracking-wider">
                What's on your mind?
              </label>
              <span
                className={`text-[11px] font-medium tabular-nums transition-colors ${
                  isOverLimit
                    ? 'text-rose-400 font-bold'
                    : isNearLimit
                    ? 'text-[#F5B800]'
                    : 'text-[#6F7076]'
                }`}
              >
                {content.length}/{MAX_POST_LENGTH}
              </span>
            </div>
            <textarea
              rows={5}
              maxLength={MAX_POST_LENGTH}
              value={content}
              onChange={handleContentChange}
              onPaste={(e) => handlePasteSanitization(e, setContent, setError)}
              placeholder="Share your honest thoughts, experiences, or questions anonymously..."
              className={`w-full p-3 rounded-[8px] border bg-[#0D0D0F] text-[#F2F2F2] text-xs focus:outline-none resize-none transition-colors placeholder-[#6F7076] ${
                isOverLimit
                  ? 'border-rose-500/60 focus:border-rose-500'
                  : 'border-[#25252A] focus:border-[#F5B800]'
              }`}
            />
          </div>

          {/* Live Privacy Detector Alert */}
          {privacyAlert.hasLeak && (
            <div className="p-3 rounded-[6px] border border-[#78350f] bg-[#422006]/40 text-[#F5B800] text-xs flex items-start gap-2.5 animate-fade-in">
              <svg className="w-4 h-4 text-[#F5B800] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-bold">Privacy Warning Detected!</p>
                <p className="mt-0.5 opacity-90 leading-relaxed text-[11px]">
                  Your text appears to contain personal info: <span className="font-semibold">{privacyAlert.leaks.join(', ')}</span>.
                  To protect your anonymity, consider removing it. You can still post if intended.
                </p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#25252A] mt-1">
            <span className="text-[11px] text-[#6F7076]">
              Posted anonymously to space
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-[6px] text-xs font-semibold text-[#9A9A9F] hover:text-[#F2F2F2] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || isInvalidText(content) || isOverLimit}
                className="px-4 py-2 rounded-[6px] text-xs font-bold text-[#0D0D0F] bg-[#F5B800] hover:bg-[#e0a800] transition-colors disabled:opacity-50 cursor-pointer"
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

