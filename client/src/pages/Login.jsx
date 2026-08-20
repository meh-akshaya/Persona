import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

import PersonaLogo from '../components/common/PersonaLogo'

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
      if (err.response?.data?.error) {
        setError(err.response.data.error)
      } else if (err.message === 'Network Error' || !err.response) {
        setError('Network error: Unable to connect to backend server. Make sure server is running on http://localhost:5000.')
      } else {
        setError('Invalid credentials. Please verify your email and password.')
      }
    } finally {
      setLoading(false)
    }
  }

  const fillDemoUser = () => {
    setEmail('testdemo@example.com')
    setPassword('password123')
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] flex flex-col items-center justify-center p-4 relative select-none">
      {/* Main Professional Auth Card */}
      <div className="w-full max-w-[400px] rounded-[8px] p-8 border border-[#25252A] bg-[#151518] text-[#F2F2F2] shadow-2xl relative z-10 animate-fade-in">
        {/* Brand Logo & Title */}
        <div className="text-center mb-7">
          <PersonaLogo size="lg" />
          <h1 className="text-lg font-bold tracking-tight text-[#F2F2F2] mt-4">
            Welcome back
          </h1>
          <p className="text-xs text-[#9A9A9F] mt-1">
            Sign in to access your anonymous persona.
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
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#9A9A9F]">
                Password
              </label>
              <button
                type="button"
                onClick={fillDemoUser}
                className="text-[11px] font-semibold text-[#F5B800] hover:underline cursor-pointer"
              >
                Use demo account
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-[6px] bg-[#0D0D0F] border border-[#25252A] text-[#F2F2F2] text-xs focus:outline-none focus:border-[#F5B800] focus:ring-1 focus:ring-[#F5B800]/20 transition-all placeholder:text-[#6F7076]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-[6px] text-xs font-bold text-[#0D0D0F] bg-[#F5B800] hover:bg-[#e0a800] transition-colors disabled:opacity-50 mt-1 cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-7 pt-5 border-t border-[#25252A] text-center text-xs text-[#9A9A9F] space-y-2">
          <div>
            Don&apos;t have a persona?{' '}
            <Link to="/register" className="font-semibold text-[#F5B800] hover:underline">
              Create an account →
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
        Encrypted & anonymous authentication
      </p>
    </div>
  )
}
