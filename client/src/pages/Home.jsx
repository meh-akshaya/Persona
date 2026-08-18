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
    <div className="w-full animate-fade-in">
      {/* Stream Integrated Hero Header */}
      {!slug && (
        <div className="pb-6 pt-1 mb-6 border-b border-[#25252A]">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F2F2F2]">
            Say what you think.
          </h1>
          <p className="text-[#9A9A9F] text-xs sm:text-sm mt-1.5 leading-relaxed">
            Real conversations. No real names.
          </p>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleStartPost}
              className="px-4 py-2 rounded-[6px] text-xs font-bold text-[#0D0D0F] bg-[#F5B800] hover:bg-[#e0a800] transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>+</span>
              <span>Start a post</span>
            </button>
            <button
              onClick={() => navigate('/c/coding-tech')}
              className="px-3 py-2 text-xs font-medium text-[#9A9A9F] hover:text-[#F2F2F2] transition-colors cursor-pointer"
            >
              Explore spaces →
            </button>
          </div>
        </div>
      )}

      {/* Community Header if inside a Space */}
      {community && (
        <div className="pb-5 mb-5 border-b border-[#25252A]">
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="text-[#F5B800] font-bold text-base">#</span>
            <h1 className="text-xl font-bold tracking-tight text-[#F2F2F2]">
              {community.name}
            </h1>
            <span className="text-[11px] font-semibold text-[#6F7076] ml-2">
              {community._count?.posts || 0} discussions
            </span>
          </div>
          <p className="text-[#9A9A9F] text-xs leading-relaxed">
            {community.description}
          </p>
        </div>
      )}

      {/* Clean Stream Feed Tabs (Underline Active Indicator) */}
      <div className="flex items-center justify-between border-b border-[#25252A] mb-2 text-xs">
        <div className="flex items-center gap-6 font-medium">
          <button
            onClick={() => setSortBy('latest')}
            className={`py-2.5 px-1 font-semibold transition-all relative cursor-pointer ${
              sortBy === 'latest'
                ? 'text-[#F2F2F2] border-b-2 border-[#F5B800]'
                : 'text-[#9A9A9F] hover:text-[#F2F2F2]'
            }`}
          >
            {slug ? community?.name || slug : 'For you'}
          </button>
          <button
            onClick={() => setSortBy('latest')}
            className={`py-2.5 px-1 font-semibold transition-all cursor-pointer ${
              sortBy === 'latest'
                ? 'text-[#F2F2F2]'
                : 'text-[#9A9A9F] hover:text-[#F2F2F2]'
            }`}
          >
            Latest
          </button>
          <button
            onClick={() => setSortBy('top')}
            className={`py-2.5 px-1 font-semibold transition-all cursor-pointer ${
              sortBy === 'top'
                ? 'text-[#F5B800] font-bold border-b-2 border-[#F5B800]'
                : 'text-[#9A9A9F] hover:text-[#F2F2F2]'
            }`}
          >
            Top Reacted
          </button>
        </div>
      </div>

      {/* Feed List — Continuous Stream Format */}
      {loading ? (
        <div className="divide-y divide-[#25252A]">
          {[1, 2, 3].map(i => (
            <div key={i} className="py-5 animate-pulse space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#25252A]" />
                <div className="w-32 h-4 rounded bg-[#25252A]" />
              </div>
              <div className="w-full h-12 rounded bg-[#25252A]" />
            </div>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-[#25252A] rounded-[8px] my-6">
          <h3 className="text-sm font-bold text-[#F2F2F2]">No discussions found</h3>
          <p className="text-xs text-[#9A9A9F] mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No posts matched "${searchQuery}".`
              : 'Be the first persona to start a discussion in this space.'}
          </p>
          <button
            onClick={handleStartPost}
            className="mt-4 px-4 py-2 rounded-[6px] text-xs font-bold text-[#0D0D0F] bg-[#F5B800] hover:bg-[#e0a800] transition-colors cursor-pointer"
          >
            + Start a post
          </button>
        </div>
      ) : (
        <div className="divide-y divide-[#25252A]">
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