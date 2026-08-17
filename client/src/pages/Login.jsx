import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return setError('Please enter both your email and password.')

    setLoading(true)
    setError(null)

    try {
      const res = await api.post('/auth/login', { email, password })
      if (res.data?.token && res.data?.persona) {
        login(res.data.token, res.data.persona)
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please verify your email and password.')
    } finally {
      setLoading(false)
    }
  }

  // Quick helper to fill demo credentials if available
  const fillDemoUser = () => {
    setEmail('testdemo@example.com')
    setPassword('password123')
  }

  return (
    <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glow Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none animate-glow" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(139, 92, 246, 0.15)',
        }}
        className="w-full max-w-md rounded-3xl p-8 relative z-10 animate-fade-in"
      >
        {/* Top Header & Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/30 text-3xl mb-3 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            🎭
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Sign In to <span className="bg-gradient-to-r from-violet-400 to-indigo-300 bg-clip-text text-transparent">Persona</span>
          </h1>
          <p className="text-slate-400 text-xs mt-2 leading-relaxed max-w-xs mx-auto">
            Your identity stays 100% encrypted. Sign in to access your anonymous persona.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-center text-[10px] text-slate-400">
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-base block mb-0.5">🔒</span>
            <span className="font-bold text-slate-200 block">Encrypted</span>
            <span>Zero real names</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-base block mb-0.5">🛡️</span>
            <span className="font-bold text-slate-200 block">Privacy Guard</span>
            <span>Live leak scanner</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <span className="text-base block mb-0.5">⭐</span>
            <span className="font-bold text-slate-200 block">Trust Score</span>
            <span>Community rating</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium flex items-center gap-2 animate-fade-in">
            <span className="text-base">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-slate-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <button
                type="button"
                onClick={fillDemoUser}
                className="text-[10px] text-violet-400 hover:text-violet-300 transition-colors font-semibold"
              >
                Use Demo Account
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all placeholder:text-slate-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)] disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? 'Authenticating Persona...' : 'Sign In to Persona'}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-400">
          New to Persona?{' '}
          <Link to="/register" className="font-bold text-violet-400 hover:text-violet-300 transition-colors">
            Create an Anonymous Account →
          </Link>
        </div>
      </div>
    </div>
  )
}
