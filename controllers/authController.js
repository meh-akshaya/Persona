const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')
const { generateUniquePersona } = require('../utils/personaGenerator')

const prisma = new PrismaClient()

// ─── REGISTER ────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { email, password } = req.body

    // Basic validation
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' })

    if (password.length < 8)
      return res.status(400).json({ error: 'Password must be at least 8 characters' })

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser)
      return res.status(409).json({ error: 'Email already registered' })

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate unique persona
    const { personaName, personaEmoji, personaColor } = await generateUniquePersona(prisma)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        personaName,
        personaEmoji,
        personaColor,
      },
    })

    // Sign JWT
    const token = jwt.sign(
      { userId: user.id, personaName: user.personaName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Never send password or email back — only persona data
    return res.status(201).json({
      token,
      persona: {
        name: user.personaName,
        emoji: user.personaEmoji,
        color: user.personaColor,
        trustScore: user.trustScore,
      },
    })
  } catch (err) {
    console.error('Register error:', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' })

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user)
      return res.status(401).json({ error: 'Invalid credentials' })

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid credentials' })

    // Sign JWT
    const token = jwt.sign(
      { userId: user.id, personaName: user.personaName },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.status(200).json({
      token,
      persona: {
        name: user.personaName,
        emoji: user.personaEmoji,
        color: user.personaColor,
        trustScore: user.trustScore,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

// ─── ME (get current user's persona) ─────────────────────────────────────────
const me = async (req, res) => {
  try {
    // req.userId comes from auth middleware
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        personaName: true,
        personaEmoji: true,
        personaColor: true,
        trustScore: true,
        createdAt: true,
        _count: { select: { posts: true, comments: true } }
      },
    })

    if (!user)
      return res.status(404).json({ error: 'User not found' })

    return res.status(200).json({ persona: user })
  } catch (err) {
    console.error('Me error:', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

module.exports = { register, login, me }
