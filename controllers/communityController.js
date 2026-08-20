const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ─── GET ALL COMMUNITIES ──────────────────────────────────────────────────────
const getAllCommunities = async (req, res) => {
  try {
    const communities = await prisma.community.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        createdAt: true,
        _count: { select: { posts: true } }, // post count, useful for UI
      },
    })

    return res.status(200).json({ communities })
  } catch (err) {
    console.error('Get communities error:', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

// ─── GET ONE COMMUNITY BY SLUG ────────────────────────────────────────────────
const getCommunityBySlug = async (req, res) => {
  try {
    const { slug } = req.params

    const community = await prisma.community.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        icon: true,
        createdAt: true,
        _count: { select: { posts: true } },
      },
    })

    if (!community)
      return res.status(404).json({ error: 'Community not found' })

    return res.status(200).json({ community })
  } catch (err) {
    console.error('Get community error:', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

// ─── GET TOP PERSONAS ─────────────────────────────────────────────────────────
const getTopPersonas = async (req, res) => {
  try {
    const { slug, limit } = req.query
    const take = parseInt(limit) || 5

    let community = null
    if (slug && slug !== 'all') {
      community = await prisma.community.findUnique({
        where: { slug },
        select: { id: true, name: true, slug: true },
      })
    }

    const topPersonas = await prisma.user.findMany({
      orderBy: { trustScore: 'desc' },
      take,
      select: {
        id: true,
        personaName: true,
        personaEmoji: true,
        personaColor: true,
        trustScore: true,
      },
    })

    return res.status(200).json({ topPersonas, community })
  } catch (err) {
    console.error('Get top personas error:', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

module.exports = { getAllCommunities, getCommunityBySlug, getTopPersonas }
