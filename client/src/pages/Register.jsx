import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) return setError('Email and password are required.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirmPassword) return setError('Passwords do not match.')

    setLoading(true)
    setError(null)

    try {
      const res = await api.post('/auth/register', { email, password })
      if (res.data?.token && res.data?.persona) {
        login(res.data.token, res.data.persona)
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Email may already be registered.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Subtle Yellow Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F5B800]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Substack Style Card */}
      <div className="w-full max-w-lg rounded-[8px] p-8 border border-[#25252A] bg-[#151518] text-[#F2F2F2] shadow-2xl relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-[6px] bg-[#F5B800] text-[#0D0D0F] font-black shadow-xs mb-3">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#F2F2F2]">
            Create Your Persona
          </h1>
          <p className="text-[#9A9A9F] text-xs mt-2 leading-relaxed max-w-sm mx-auto">
            A 100% unique, anonymous persona avatar & identity will be automatically assigned to your account.
          </p>
        </div>

        {/* Persona Generator Teaser */}
        <div className="p-4 rounded-[8px] bg-[#0D0D0F] border border-[#25252A] mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F5B800] flex items-center justify-center text-[#0D0D0F] font-bold text-sm shrink-0">
            P
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F2F2F2]">Unique Persona Auto-Assigned</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-[#151518] text-[#F5B800] border border-[#25252A]">
                100% Secret
              </span>
            </div>
            <p className="text-[11px] text-[#9A9A9F] mt-0.5 truncate">
              E.g., SilentFox, CalmEagle, SwiftStone — assigned upon registration.
            </p>
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
              placeholder="your.email@example.com"
              className="w-full px-4 py-2.5 rounded-[8px] bg-[#0D0D0F] border border-[#25252A] text-[#F2F2F2] text-xs focus:outline-none focus:border-[#F5B800] transition-colors placeholder:text-[#6F7076]"
            />
            <p className="text-[10px] text-[#6F7076] mt-1">
              * Your email is strictly private and never shared or displayed anywhere.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F7076] mb-1.5">
              Password (min 8 characters)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-[8px] bg-[#0D0D0F] border border-[#25252A] text-[#F2F2F2] text-xs focus:outline-none focus:border-[#F5B800] transition-colors placeholder:text-[#6F7076]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6F7076] mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-[8px] bg-[#0D0D0F] border border-[#25252A] text-[#F2F2F2] text-xs focus:outline-none focus:border-[#F5B800] transition-colors placeholder:text-[#6F7076]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-[6px] text-xs font-bold text-[#0D0D0F] bg-[#F5B800] hover:bg-[#e0a800] transition-colors shadow-xs disabled:opacity-50 mt-2 cursor-pointer uppercase tracking-wider"
          >
            {loading ? 'Assigning Identity...' : 'Generate My Anonymous Account'}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-6 pt-4 border-t border-[#25252A] text-center text-xs text-[#9A9A9F]">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-[#F5B800] hover:underline">
            Sign In to Persona →
          </Link>
        </div>
      </div>
    </div>
  )
}
