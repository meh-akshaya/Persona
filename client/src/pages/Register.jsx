import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

import PersonaLogo from '../components/common/PersonaLogo'

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
    <div className="min-h-screen bg-[#0D0D0F] flex flex-col items-center justify-center p-4 relative select-none">
      {/* Main Professional Auth Card */}
      <div className="w-full max-w-[420px] rounded-[8px] p-8 border border-[#25252A] bg-[#151518] text-[#F2F2F2] shadow-2xl relative z-10 animate-fade-in">
        {/* Brand Logo & Header */}
        <div className="text-center mb-7">
          <PersonaLogo size="lg" />
          <h1 className="text-lg font-bold tracking-tight text-[#F2F2F2] mt-4">
            Create an account
          </h1>
          <p className="text-xs text-[#9A9A9F] mt-1">
            An anonymous persona avatar will be assigned automatically.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-[6px] bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#9A9A9F] mb-1.5">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#0D0D0F] border border-[#25252A] text-[#F2F2F2] text-xs focus:outline-none focus:border-[#F5B800] focus:ring-1 focus:ring-[#F5B800]/20 transition-all placeholder:text-[#6F7076]"
            />
            <span className="block text-[11px] text-[#6F7076] mt-1">
              Your email remains private and is never shown publicly.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9A9A9F] mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#0D0D0F] border border-[#25252A] text-[#F2F2F2] text-xs focus:outline-none focus:border-[#F5B800] focus:ring-1 focus:ring-[#F5B800]/20 transition-all placeholder:text-[#6F7076]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9A9A9F] mb-1.5">
              Confirm password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#0D0D0F] border border-[#25252A] text-[#F2F2F2] text-xs focus:outline-none focus:border-[#F5B800] focus:ring-1 focus:ring-[#F5B800]/20 transition-all placeholder:text-[#6F7076]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-[6px] text-xs font-bold text-[#0D0D0F] bg-[#F5B800] hover:bg-[#e0a800] transition-colors disabled:opacity-50 mt-1 cursor-pointer"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-7 pt-5 border-t border-[#25252A] text-center text-xs text-[#9A9A9F] space-y-2">
          <div>
            Already have a persona?{' '}
            <Link to="/login" className="font-semibold text-[#F5B800] hover:underline">
              Sign in →
            </Link>
          </div>
          <div>
            <Link to="/" className="text-[11px] text-[#6F7076] hover:text-[#9A9A9F] transition-colors">
              Continue as guest →
            </Link>
          </div>
        </div>
      </div>

      {/* Security Note */}
      <p className="text-[11px] text-[#6F7076] text-center mt-6">
        Encrypted & anonymous identity assignment
      </p>
    </div>
  )
}
