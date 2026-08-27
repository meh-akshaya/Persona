const { PrismaClient } = require('@prisma/client')
const { detectPrivacyLeaks } = require('../utils/privacyDetector')

const prisma = new PrismaClient()

// Shared select shape — author returns ONLY persona fields, never email/password.
// This is the actual anonymity enforcement: it happens at the query level,
// not just hidden in the UI.
const postSelect = {
  id: true,
  content: true,
  hasPrivacyLeak: true,
  privacyLeaks: true,
  createdAt: true,
  author: {
    select: {
      personaName: true,
      personaEmoji: true,
      personaColor: true,
      trustScore: true,
    },
  },
  community: {
    select: {
      name: true,
      slug: true,
      icon: true,
    },
  },
  _count: {
    select: { comments: true, reactions: true },
  },
}

const MAX_POST_LENGTH = 500

// ─── CREATE POST ───────────────────────────────────────────────────────────────
const createPost = async (req, res) => {
  try {
    const { content, communityId } = req.body
    const authorId = req.userId // set by auth middleware

    if (!content || !content.trim())
      return res.status(400).json({ error: 'Post content is required' })

    if (content.length > MAX_POST_LENGTH)
      return res.status(400).json({ error: `Post content cannot exceed ${MAX_POST_LENGTH} characters` })

    if (!communityId)
      return res.status(400).json({ error: 'communityId is required' })

    // Validate community exists before writing anything
    const community = await prisma.community.findUnique({ where: { id: communityId } })
    if (!community)
      return res.status(404).json({ error: 'Community not found' })

    // Run privacy detector BEFORE saving — this is the core logic of the feature
    const { hasLeak, leaks } = detectPrivacyLeaks(content)

    const post = await prisma.post.create({
      data: {
        content,
        authorId,
        communityId,
        hasPrivacyLeak: hasLeak,
        privacyLeaks: leaks,
      },
      select: postSelect,
    })

    // Note: we still save + return the post even if a leak is detected.
    // hasPrivacyLeak + privacyLeaks let the frontend decide how to handle it
    // (e.g. show a warning banner, blur the post, or block it later).
    // This keeps the detection logic and the UI policy decoupled.
    return res.status(201).json({ post })
  } catch (err) {
    console.error('Create post error:', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

// ─── GET ALL POSTS (feed) ───────────────────────────────────────────────────────
const getAllPosts = async (req, res) => {
  try {
    const { communityId, slug } = req.query

    // Optional filtering by community — via id or slug, either works
    const where = {}
    if (communityId) where.communityId = communityId
    if (slug) where.community = { slug }

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: postSelect,
    })

    return res.status(200).json({ posts })
  } catch (err) {
    console.error('Get posts error:', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

// ─── GET SINGLE POST ─────────────────────────────────────────────────────────────
const getPostById = async (req, res) => {
  try {
    const { id } = req.params

    const post = await prisma.post.findUnique({
      where: { id },
      select: postSelect,
    })

    if (!post)
      return res.status(404).json({ error: 'Post not found' })

    return res.status(200).json({ post })
  } catch (err) {
    console.error('Get post error:', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

module.exports = { createPost, getAllPosts, getPostById }
