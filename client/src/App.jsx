import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'
import Login from './pages/Login'
import Register from './pages/Register'

import RightSidebar from './components/layout/RightSidebar'

// Route Guard — Redirects unauthenticated users to /login
function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth()
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-3 animate-fade-in">
          <div className="w-10 h-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
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
  return (
    <div style={{ backgroundColor: 'var(--bg-primary)' }} className="min-h-screen flex justify-center">
      <div className="w-full max-w-7xl flex justify-between">
        {/* Left Substack Navigation Sidebar */}
        <Sidebar />

        {/* Middle Main Feed Container */}
        <main className="flex-1 max-w-2xl min-h-screen border-r border-[var(--border)] px-4 py-6">
          <Routes>
            <Route path="/" element={<Home searchQuery={searchQuery} />} />
            <Route path="/c/:slug" element={<Home searchQuery={searchQuery} />} />
            <Route path="/post/:id" element={<PostDetail />} />
          </Routes>
        </main>

        {/* Right Substack Widget & Search Sidebar */}
        <RightSidebar onSearchChange={setSearchQuery} />
      </div>
    </div>
  )
}

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <Routes>
      {/* Public Auth Routes — default entry point */}
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

      {/* Protected Main Platform Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          </ProtectedRoute>
        }
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