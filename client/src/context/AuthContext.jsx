import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [persona, setPersona] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Sync latest persona info from server
  const refreshPersona = async () => {
    try {
      const res = await api.get('/auth/me')
      if (res.data?.persona) {
        const updated = {
          name: res.data.persona.personaName,
          emoji: res.data.persona.personaEmoji,
          color: res.data.persona.personaColor,
          trustScore: res.data.persona.trustScore,
          createdAt: res.data.persona.createdAt,
          _count: res.data.persona._count,
        }
        setPersona(updated)
        localStorage.setItem('persona', JSON.stringify(updated))
        return updated
      }
    } catch (err) {
      if (err.response?.status === 401) {
        logout()
      }
    }
  }

  // On app load, check if token exists in localStorage
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('token')
      const savedPersona = localStorage.getItem('persona')

      if (savedToken && savedPersona && savedPersona !== 'undefined') {
        setToken(savedToken)
        try {
          const parsed = JSON.parse(savedPersona)
          setPersona(parsed)
        } catch (e) {
          console.error('Failed to parse persona', e)
          localStorage.removeItem('persona')
        }
        // Background sync persona details asynchronously
        api.get('/auth/me').then(res => {
          if (res.data?.persona) {
            const updated = {
              name: res.data.persona.personaName,
              emoji: res.data.persona.personaEmoji,
              color: res.data.persona.personaColor,
              trustScore: res.data.persona.trustScore,
              createdAt: res.data.persona.createdAt,
              _count: res.data.persona._count,
            }
            setPersona(updated)
            localStorage.setItem('persona', JSON.stringify(updated))
          }
        }).catch(err => {
          if (err.response?.status === 401) {
            logout()
          }
        })
      }
    } catch (err) {
      console.error('Auth load error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (token, personaData) => {
    localStorage.setItem('token', token)
    localStorage.setItem('persona', JSON.stringify(personaData))
    setToken(token)
    setPersona(personaData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('persona')
    setToken(null)
    setPersona(null)
  }

  return (
    <AuthContext.Provider
      value={{
        persona,
        token,
        login,
        logout,
        refreshPersona,
        loading,
        isLoggedIn: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)