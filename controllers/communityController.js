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

module.exports = { getAllCommunities, getCommunityBySlug }
