const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// ─── ADD OR CHANGE REACTION ───────────────────────────────────────────────────
const addReaction = async (req, res) => {
  try {
    const { postId, type } = req.body
    const userId = req.userId // from JWT middleware

    if (!postId || !type)
      return res.status(400).json({ error: 'postId and type are required' })

    // Validate reaction type matches enum
    const validTypes = ['HELPFUL', 'INSIGHTFUL', 'SUPPORTIVE']
    if (!validTypes.includes(type))
      return res.status(400).json({ error: 'Invalid reaction type' })

    // Confirm post exists and get authorId for trust score update
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true }
    })
    if (!post)
      return res.status(404).json({ error: 'Post not found' })

    // Prevent reacting to your own post
    if (post.authorId === userId)
      return res.status(400).json({ error: 'You cannot react to your own post' })

    // Check if reaction already exists
    const existingReaction = await prisma.reaction.findUnique({
      where: { userId_postId: { userId, postId } }
    })

    if (existingReaction) {
      // Reaction exists — just update the type, no trust score change
      const updated = await prisma.reaction.update({
        where: { userId_postId: { userId, postId } },
        data: { type },
        select: { id: true, type: true, postId: true }
      })
      return res.status(200).json({ reaction: updated, message: 'Reaction updated' })
    }

    // New reaction — create it AND increment author trust score
    // We use a Prisma transaction so both operations succeed or both fail
    const [reaction] = await prisma.$transaction([
      prisma.reaction.create({
        data: { userId, postId, type },
        select: { id: true, type: true, postId: true }
      }),
      prisma.user.update({
        where: { id: post.authorId },
        data: { trustScore: { increment: 1 } }
      })
    ])

    return res.status(201).json({ reaction, message: 'Reaction added' })
  } catch (err) {
    console.error('Add reaction error:', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

// ─── REMOVE REACTION ──────────────────────────────────────────────────────────
const removeReaction = async (req, res) => {
  try {
    const { postId } = req.params
    const userId = req.userId

    // Confirm reaction exists before trying to delete
    const reaction = await prisma.reaction.findUnique({
      where: { userId_postId: { userId, postId } },
      select: { id: true, post: { select: { authorId: true } } }
    })

    if (!reaction)
      return res.status(404).json({ error: 'Reaction not found' })

    // Delete reaction AND decrement trust score — both or neither
    await prisma.$transaction([
      prisma.reaction.delete({
        where: { userId_postId: { userId, postId } }
      }),
      prisma.user.update({
        where: { id: reaction.post.authorId },
        data: { trustScore: { decrement: 1 } }
      })
    ])

    return res.status(200).json({ message: 'Reaction removed' })
  } catch (err) {
    console.error('Remove reaction error:', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

module.exports = { addReaction, removeReaction }