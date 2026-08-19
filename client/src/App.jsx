import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Sidebar from './components/layout/Sidebar'
import RightSidebar from './components/layout/RightSidebar'
import MobileHeader from './components/layout/MobileHeader'
import InfoModal from './components/layout/InfoModal'
import CreatePostModal from './components/posts/CreatePostModal'
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

// Route Guard — Redirects unauthenticated users to /login
function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          <p style={{ color: 'var(--text-secondary)' }} className="text-xs font-bold tracking-wider uppercase">
            Loading Persona...
          </p>
        </div>
      </div>
    )
  }
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Route Guard — Redirects already logged in users away from login/register to /
function RedirectIfAuthenticated({ children }) {
  const { isLoggedIn, loading } = useAuth()
  if (loading) return null
  if (isLoggedIn) {
    return <Navigate to="/" replace />
  }
  return children
}

function MainLayout({ searchQuery, setSearchQuery }) {
  const [infoModalType, setInfoModalType] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { isLoggedIn } = useAuth()
  const navigate = useNavigate()

  const handleCreatePost = () => {
    if (!isLoggedIn) return navigate('/login')
    setIsCreateModalOpen(true)
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }} className="min-h-screen flex flex-col justify-between overflow-x-hidden text-[#F2F2F2]">
      {/* Mobile Top Responsive Sticky Header */}
      <MobileHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onCreatePostClick={handleCreatePost}
        onOpenInfoModal={(type) => setInfoModalType(type)}
      />

      <div className="w-full max-w-[1380px] mx-auto flex justify-between flex-1 px-4 sm:px-6">
        {/* Left Navigation Sidebar (240px fixed width) */}
        <Sidebar onCreatePostClick={handleCreatePost} />

        {/* Middle Main Feed Container (Proportionate 780px main feed focus) */}
        <main className="flex-1 max-w-[780px] w-full min-h-screen border-r border-l border-[#25252A] px-4 sm:px-6 py-6 min-w-0">
          <Routes>
            <Route path="/" element={<Home searchQuery={searchQuery} />} />
            <Route path="/c/:slug" element={<Home searchQuery={searchQuery} />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Right Sidebar (280px anchored sidebar) */}
        <RightSidebar
          onSearchChange={setSearchQuery}
          onOpenInfoModal={(type) => setInfoModalType(type)}
        />
      </div>

      {/* Info Modal (Privacy, Terms, Guidelines, Contact) */}
      <InfoModal
        isOpen={!!infoModalType}
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

      {/* Global Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onPostCreated={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <Login />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/register"
        element={
          <RedirectIfAuthenticated>
            <Register />
          </RedirectIfAuthenticated>
        }
      />

      {/* Main Discussion Platform (Publicly Browsable, Auth Required for Post/Comment) */}
      <Route
        path="/*"
        element={<MainLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery} />}
      />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  )
}