require('dotenv').config()
const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const communityRoutes = require('./routes/community')

const app = express()
const PORT = process.env.PORT || 5000

// ─── MIDDLEWARE ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes)
app.use('/api/communities', communityRoutes)

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }))

// 404 handler
app.use((req, res) => res.status(404).json({ error: 'Route not found' }))

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})