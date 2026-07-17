const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// Reusable persona select — same pattern as your post controller
// Never exposes email, password, or userId
const authorSelect = {
  select: {
    personaName: true,
    personaEmoji: true,
    personaColor: true,
    trustScore: true,
  }
}

// ─── ADD COMMENT OR REPLY ─────────────────────────────────────────────────────
const addComment = async (req, res) => {
  try {
    const { content, postId, parentId } = req.body
    const authorId = req.userId // from JWT middleware

    if (!content || !content.trim())
      return res.status(400).json({ error: 'Comment content is required' })

    if (!postId)
      return res.status(400).json({ error: 'postId is required' })

    // Confirm the post exists
    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post)
      return res.status(404).json({ error: 'Post not found' })

    // If parentId is provided, confirm that comment exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({ where: { id: parentId } })
      if (!parentComment)
        return res.status(404).json({ error: 'Parent comment not found' })

      // Ensure the parent comment belongs to the same post
      // You can't reply to a comment on a different post
      if (parentComment.postId !== postId)
        return res.status(400).json({ error: 'Parent comment does not belong to this post' })
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        authorId,
        postId,
        parentId: parentId || null,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        parentId: true,
        author: authorSelect,
      }
    })

    return res.status(201).json({ comment })
  } catch (err) {
    console.error('Add comment error:', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

// ─── GET COMMENTS FOR A POST (nested) ────────────────────────────────────────
const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params

    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post)
      return res.status(404).json({ error: 'Post not found' })

    // Fetch only top-level comments — parentId is null
    // Replies are nested inside each comment's replies array
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // top-level only
      },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        parentId: true,
        author: authorSelect,
        replies: {
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            content: true,
            createdAt: true,
            parentId: true,
            author: authorSelect,
            replies: {
              orderBy: { createdAt: 'asc' },
              select: {
                id: true,
                content: true,
                createdAt: true,
                parentId: true,
                author: authorSelect,
                replies: {
                  orderBy: { createdAt: 'asc' },
                  select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    parentId: true,
                    author: authorSelect,
                  }
                }
              }
            }
          }
        }
      }
    })

    return res.status(200).json({ comments })
  } catch (err) {
    console.error('Get comments error:', err)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}

module.exports = { addComment, getPostComments }