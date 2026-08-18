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
        const fetchedPost = postRes.data?.post || null
        setPost(fetchedPost)
        setComments(commentsRes.data?.comments || [])
        if (fetchedPost) {
          document.title = `${fetchedPost.content.substring(0, 45)}... — Persona`
        }
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
        <div className="h-6 w-24 bg-[var(--border)] rounded-lg mb-4 animate-pulse" />
        <div className="h-48 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl animate-pulse mb-6" />
        <div className="h-32 bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl animate-pulse" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-lg">
          !
        </div>
        <h2 className="text-lg font-bold">Discussion not found</h2>
        <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-1 mb-4">
          {error || 'This post may have been removed or does not exist.'}
        </p>
        <Link
          to="/"
          className="px-5 py-2.5 rounded-full text-xs font-extrabold text-slate-950 bg-amber-500 hover:bg-amber-400 transition-all uppercase tracking-wider shadow-md inline-block"
        >
          ← Back to Discussions
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-4 px-2 md:px-0 animate-fade-in">
      {/* Back button */}
      <div className="mb-4">
        <Link
          to="/"
          style={{ color: 'var(--text-secondary)' }}
          className="text-xs font-semibold hover:text-[var(--text-primary)] transition-colors inline-flex items-center gap-1.5"
        >
          <span>←</span> Back to Discussions
        </Link>
      </div>

      {/* Main Post Card */}
      <PostCard post={post} />

      {/* Comment Section Header */}
      <div className="mt-8 mb-4 flex items-center justify-between">
        <h2 className="text-base font-bold flex items-center gap-2 text-[var(--text-primary)]">
          <svg className="w-5 h-5 text-amber-400 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
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
          <p className="font-semibold text-[var(--text-primary)]">No comments yet</p>
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
