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
    <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Subtle Yellow Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F5B800]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Substack Style Card */}
      <div className="w-full max-w-md rounded-[8px] p-8 border border-[#25252A] bg-[#151518] text-[#F2F2F2] shadow-2xl relative z-10 animate-fade-in">
        {/* Top Header & Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-[6px] bg-[#F5B800] text-[#0D0D0F] font-black shadow-xs mb-3">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#F2F2F2]">
            Sign in to Persona
          </h1>
          <p className="text-[#9A9A9F] text-xs mt-2 leading-relaxed max-w-xs mx-auto">
            Your identity stays 100% encrypted. Access your anonymous persona.
          </p>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-center text-[10px] text-[#9A9A9F]">
          <div className="p-2.5 rounded-[6px] bg-[#0D0D0F] border border-[#25252A]">
            <span className="font-bold text-[#F2F2F2] block text-xs mb-0.5">Encrypted</span>
            <span>Zero real names</span>
          </div>
          <div className="p-2.5 rounded-[6px] bg-[#0D0D0F] border border-[#25252A]">
            <span className="font-bold text-[#F2F2F2] block text-xs mb-0.5">Privacy Guard</span>
            <span>Live leak scanner</span>
          </div>
          <div className="p-2.5 rounded-[6px] bg-[#0D0D0F] border border-[#25252A]">
            <span className="font-bold text-[#F2F2F2] block text-xs mb-0.5">Trust Score</span>
            <span>Community rating</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-[6px] bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F7076] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-2.5 rounded-[8px] bg-[#0D0D0F] border border-[#25252A] text-[#F2F2F2] text-xs focus:outline-none focus:border-[#F5B800] transition-colors placeholder:text-[#6F7076]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F7076]">
                Password
              </label>
              <button
                type="button"
                onClick={fillDemoUser}
                className="text-[10px] text-[#F5B800] hover:underline font-semibold cursor-pointer"
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
              className="w-full px-4 py-2.5 rounded-[8px] bg-[#0D0D0F] border border-[#25252A] text-[#F2F2F2] text-xs focus:outline-none focus:border-[#F5B800] transition-colors placeholder:text-[#6F7076]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-[6px] text-xs font-bold text-[#0D0D0F] bg-[#F5B800] hover:bg-[#e0a800] transition-colors shadow-xs disabled:opacity-50 mt-2 cursor-pointer uppercase tracking-wider"
          >
            {loading ? 'Authenticating...' : 'Sign In to Persona'}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 pt-5 border-t border-[#25252A] text-center text-xs text-[#9A9A9F] space-y-2">
          <div>
            New to Persona?{' '}
            <Link to="/register" className="font-bold text-[#F5B800] hover:underline">
              Create an Anonymous Account →
            </Link>
          </div>
          <div>
            <Link to="/" className="text-[11px] text-[#6F7076] hover:text-[#F2F2F2] transition-colors">
              Browse feed anonymously as guest →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
