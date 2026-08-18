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
  const { isLoggedIn } = useAuth()
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

  const handleStartPost = () => {
    if (!isLoggedIn) return navigate('/login')
    setIsCreateModalOpen(true)
  }

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Substack Style Hero Featured Banner Card */}
      {!slug && (
        <div
          style={{
            background: 'linear-gradient(135deg, #271c08 0%, #121214 100%)',
            borderColor: 'rgba(245, 158, 11, 0.3)',
          }}
          className="rounded-2xl p-6 sm:p-8 border shadow-lg relative overflow-hidden text-white"
        >
          <div className="relative z-10 max-w-lg">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight text-zinc-100">
              Say what you think.
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-2 leading-relaxed">
              Join discussions on IT, finance, fitness, geopolitics, relationships, and startups without attached real names.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={handleStartPost}
                className="px-5 py-2.5 rounded-full text-xs font-extrabold text-slate-950 bg-amber-500 hover:bg-amber-600 transition-colors shadow-md uppercase tracking-wider cursor-pointer"
              >
                Start a Post
              </button>
              <button
                onClick={() => navigate('/c/coding-tech')}
                className="px-4 py-2.5 rounded-full text-xs font-semibold text-zinc-300 border border-zinc-700 hover:bg-zinc-800 transition-colors"
              >
                Explore IT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Community Header if inside a Space */}
      {community && (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border)',
          }}
          className="rounded-2xl p-6 border shadow-xs"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
              #
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                {community.name}
              </h1>
              <p style={{ color: 'var(--text-secondary)' }} className="text-xs font-medium">
                {community._count?.posts || 0} discussions
              </p>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)' }} className="text-xs leading-relaxed mt-2">
            {community.description}
          </p>
        </div>
      )}

      {/* Substack Feed Header Bar ("For you" / Sort tabs) */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] text-xs">
        <div className="flex items-center gap-4 font-bold text-[var(--text-primary)]">
          <span className="text-sm font-bold flex items-center gap-1">
            <span>{slug ? community?.name || slug : 'For you'}</span>
            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortBy('latest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              sortBy === 'latest'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setSortBy('top')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              sortBy === 'top'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Top Reacted
          </button>
        </div>
      </div>

      {/* Feed List */}
      {loading ? (
        <div className="space-y-6 sm:space-y-7">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
              }}
              className="rounded-2xl p-6 border animate-pulse space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[var(--border)]" />
                <div className="w-28 h-4 rounded bg-[var(--border)]" />
              </div>
              <div className="w-full h-10 rounded bg-[var(--border)]" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border)',
          }}
          className="rounded-2xl p-12 text-center border my-4"
        >
          <h3 className="text-base font-bold text-[var(--text-primary)]">No discussions found</h3>
          <p style={{ color: 'var(--text-secondary)' }} className="text-xs mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No posts matched "${searchQuery}".`
              : 'Be the first persona to start a discussion in this space.'}
          </p>
          <button
            onClick={handleStartPost}
            className="mt-4 px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
          >
            Start a Post
          </button>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-7">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
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