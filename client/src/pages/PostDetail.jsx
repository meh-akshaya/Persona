import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import PostCard from '../components/posts/PostCard'
import CommentComposer from '../components/comments/CommentComposer'
import CommentThread from '../components/comments/CommentThread'

export default function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const fetchPost = api.get(`/posts/${id}`)
    const fetchComments = api.get(`/comments/post/${id}`)

    Promise.all([fetchPost, fetchComments])
      .then(([postRes, commentsRes]) => {
        setPost(postRes.data?.post || null)
        setComments(commentsRes.data?.comments || [])
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Failed to load discussion details.')
      })
      .finally(() => setLoading(false))
  }, [id])

  const handleTopLevelCommentAdded = (newComment) => {
    setComments(prev => [newComment, ...prev])
    if (post) {
      setPost(prev => ({
        ...prev,
        _count: {
          ...prev._count,
          comments: (prev._count?.comments || 0) + 1,
        }
      }))
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="h-6 w-24 bg-[var(--border)] rounded-lg mb-4 animate-pulse-subtle" />
        <div className="h-48 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl animate-pulse-subtle mb-6" />
        <div className="h-32 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl animate-pulse-subtle" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <span className="text-4xl block mb-3">🔍</span>
        <h2 className="text-lg font-bold">Discussion not found</h2>
        <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-1 mb-4">
          {error || 'This post may have been removed or does not exist.'}
        </p>
        <Link
          to="/"
          style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}
          className="px-4 py-2 rounded-xl text-xs font-bold"
        >
          ← Back to Discussions
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-4 px-2 md:px-0">
      {/* Back button */}
      <div className="mb-4">
        <Link
          to="/"
          style={{ color: 'var(--text-secondary)' }}
          className="text-xs font-semibold hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
        >
          <span>←</span> Back to Discussions
        </Link>
      </div>

      {/* Main Post Card */}
      <PostCard post={post} />

      {/* Comment Section Header */}
      <div className="mt-8 mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold flex items-center gap-2">
          <span>💬</span>
          <span>Community Discussion ({comments.length})</span>
        </h2>
      </div>

      {/* Top Level Comment Composer */}
      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}
        className="rounded-2xl p-4 mb-6 shadow-xs"
      >
        <CommentComposer
          postId={post.id}
          placeholder="Share your anonymous response or advice..."
          onCommentAdded={handleTopLevelCommentAdded}
        />
      </div>

      {/* Comment Threads */}
      {comments.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-sidebar)',
            border: '1px dashed var(--border)',
          }}
          className="rounded-2xl p-8 text-center text-xs"
        >
          <span className="text-2xl block mb-2">💬</span>
          <p className="font-semibold">No comments yet</p>
          <p style={{ color: 'var(--text-muted)' }} className="mt-0.5">
            Be the first persona to leave a comment on this post.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map(c => (
            <CommentThread
              key={c.id}
              comment={c}
              postId={post.id}
              onReplyAdded={() => {
                // Increment post comment count
                setPost(prev => ({
                  ...prev,
                  _count: {
                    ...prev._count,
                    comments: (prev._count?.comments || 0) + 1,
                  }
                }))
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
