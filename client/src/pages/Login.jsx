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

  const fillDemoUser = () => {
    setEmail('testdemo@example.com')
    setPassword('password123')
  }

  return (
    <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Subtle Radial Accent Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Substack Style Card */}
      <div
        style={{
          backgroundColor: '#16171d',
          borderColor: '#26262e',
        }}
        className="w-full max-w-md rounded-2xl p-8 border shadow-xl relative z-10 animate-fade-in"
      >
        {/* Top Header & Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 mb-3">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white font-sans">
            Sign in to Persona
          </h1>
          <p className="text-zinc-400 text-xs mt-2 leading-relaxed max-w-xs mx-auto">
            Your identity stays 100% encrypted. Access your anonymous persona.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-center text-[10px] text-zinc-400">
          <div className="p-2.5 rounded-xl bg-[#1d1e26] border border-[#26262e]">
            <span className="font-bold text-zinc-200 block text-xs mb-0.5">Encrypted</span>
            <span>Zero real names</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#1d1e26] border border-[#26262e]">
            <span className="font-bold text-zinc-200 block text-xs mb-0.5">Privacy Guard</span>
            <span>Live leak scanner</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#1d1e26] border border-[#26262e]">
            <span className="font-bold text-zinc-200 block text-xs mb-0.5">Trust Score</span>
            <span>Community rating</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl bg-[#121214] border border-[#26262e] text-zinc-100 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Password
              </label>
              <button
                type="button"
                onClick={fillDemoUser}
                className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors font-semibold"
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
              className="w-full px-4 py-3 rounded-xl bg-[#121214] border border-[#26262e] text-zinc-100 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-zinc-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50 mt-2 cursor-pointer uppercase tracking-wider"
          >
            {loading ? 'Authenticating...' : 'Sign In to Persona'}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 pt-5 border-t border-[#26262e] text-center text-xs text-zinc-400">
          New to Persona?{' '}
          <Link to="/register" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
            Create an Anonymous Account →
          </Link>
        </div>
      </div>
    </div>
  )
}

