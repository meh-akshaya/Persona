import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import PostCard from '../components/posts/PostCard'
import CreatePostModal from '../components/posts/CreatePostModal'

export default function Home({ searchQuery = '' }) {
  const [posts, setPosts] = useState([])
  const [community, setCommunity] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('latest') // 'latest' | 'top'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { slug } = useParams()
  const { isLoggedIn, persona } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    setCommunity(null)

    const fetchPosts = api.get(slug ? `/posts?slug=${slug}` : '/posts')
    const fetchComm = slug ? api.get(`/communities/${slug}`) : Promise.resolve(null)

    Promise.all([fetchPosts, fetchComm])
      .then(([postsRes, commRes]) => {
        setPosts(postsRes.data?.posts || [])
        if (commRes?.data?.community) {
          setCommunity(commRes.data.community)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  // Pre-filter posts by search query if present
  let filteredPosts = posts.filter(post => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      post.content?.toLowerCase().includes(q) ||
      post.author?.personaName?.toLowerCase().includes(q) ||
      post.community?.name?.toLowerCase().includes(q)
    )
  })

  // Sort posts
  if (sortBy === 'top') {
    filteredPosts = [...filteredPosts].sort((a, b) => (b._count?.reactions || 0) - (a._count?.reactions || 0))
  } else {
    filteredPosts = [...filteredPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev])
  }

  return (
    <div className="max-w-2xl mx-auto py-4 px-2 md:px-0">
      {/* Community Header Banner */}
      {community ? (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
          className="rounded-2xl p-6 mb-6 shadow-xs animate-fade-in"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl p-2 rounded-2xl bg-[var(--bg-sidebar)] border border-[var(--border)]">
              {community.icon}
            </span>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">
                {community.name}
              </h1>
              <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-0.5 font-medium">
                {community._count?.posts || 0} anonymous discussions
              </p>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)' }} className="text-xs leading-relaxed mt-2">
            {community.description}
          </p>
        </div>
      ) : (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
              <span>🌐</span>
              <span>All Discussions</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-1 font-medium">
              Real stories, honest advice, and 100% anonymous community feedback.
            </p>
          </div>

          {/* Sort Controls */}
          <div
            style={{
              backgroundColor: 'var(--bg-sidebar)',
              border: '1px solid var(--border)',
            }}
            className="flex items-center p-1 rounded-xl text-xs font-semibold self-start sm:self-auto"
          >
            <button
              onClick={() => setSortBy('latest')}
              style={{
                backgroundColor: sortBy === 'latest' ? 'var(--bg-card)' : 'transparent',
                color: sortBy === 'latest' ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
              className="px-3 py-1.5 rounded-lg transition-all"
            >
              Latest
            </button>
            <button
              onClick={() => setSortBy('top')}
              style={{
                backgroundColor: sortBy === 'top' ? 'var(--bg-card)' : 'transparent',
                color: sortBy === 'top' ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
              className="px-3 py-1.5 rounded-lg transition-all"
            >
              🔥 Top Reacted
            </button>
          </div>
        </div>
      )}

      {/* Quick Post Prompt Composer Box */}
      <div
        onClick={() => {
          if (!isLoggedIn) return navigate('/login')
          setIsCreateModalOpen(true)
        }}
        style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
        }}
        className="rounded-2xl p-4 mb-6 shadow-xs flex items-center gap-3 cursor-pointer hover:border-[var(--accent-text)] transition-all group"
      >
        <div
          style={{ backgroundColor: (persona?.color || '#7c5cfc') + '22' }}
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
        >
          {persona?.emoji || '🎭'}
        </div>
        <div
          style={{
            backgroundColor: 'var(--bg-sidebar)',
            color: 'var(--text-muted)',
            borderColor: 'var(--border)',
          }}
          className="flex-1 px-4 py-2.5 rounded-xl border text-xs font-medium group-hover:text-[var(--text-primary)] transition-colors"
        >
          {isLoggedIn
            ? `Post anonymously in ${community ? community.name : 'any community'}...`
            : 'Sign in to post an anonymous question or story...'}
        </div>
        <button
          style={{
            backgroundColor: 'var(--accent)',
            color: '#ffffff',
          }}
          className="px-4 py-2 rounded-xl text-xs font-bold shrink-0 hover:opacity-90 transition-opacity"
        >
          Post
        </button>
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}
              className="rounded-2xl p-5 animate-pulse-subtle flex flex-col gap-3"
            >
              <div className="flex items-center gap-2">
                <div className="w-24 h-6 rounded-full bg-[var(--border)]" />
                <div className="w-16 h-6 rounded-full bg-[var(--border)]" />
              </div>
              <div className="w-full h-12 rounded-xl bg-[var(--border)]" />
              <div className="w-32 h-6 rounded-xl bg-[var(--border)]" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
          className="rounded-2xl p-12 text-center my-4 animate-fade-in"
        >
          <span className="text-4xl block mb-3">🍃</span>
          <h3 className="text-base font-bold">No discussions found</h3>
          <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No posts matched "${searchQuery}". Try a different keyword.`
              : 'Be the very first member to share an anonymous story or question in this space.'}
          </p>
          <button
            onClick={() => {
              if (!isLoggedIn) return navigate('/login')
              setIsCreateModalOpen(true)
            }}
            style={{
              backgroundColor: 'var(--accent)',
              color: '#ffffff',
            }}
            className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity"
          >
            Start a Discussion
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onReactionUpdated={() => {
                // Background refresh feed if needed
              }}
            />
          ))}
        </div>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={handlePostCreated}
        preselectedCommunityId={community?.id}
      />
    </div>
  )
}