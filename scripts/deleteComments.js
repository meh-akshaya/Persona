require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function deleteComment(idOrPattern) {
  if (!idOrPattern) {
    console.log('Usage: node scripts/deleteComments.js <comment_id_or_keyword>')
    process.exit(1)
  }

  // Find comments matching ID or content
  const comments = await prisma.comment.findMany({
    where: {
      OR: [
        { id: idOrPattern },
        { content: { contains: idOrPattern, mode: 'insensitive' } }
      ]
    }
  })

  if (comments.length === 0) {
    console.log(`No comments found matching "${idOrPattern}"`)
    return
  }

  console.log(`Found ${comments.length} comment(s) to delete:`)
  for (const comment of comments) {
    console.log(`- ID: ${comment.id} | Content: "${comment.content}"`)

    // First delete any child replies referencing this comment as parent
    const deletedReplies = await prisma.comment.deleteMany({
      where: { parentId: comment.id }
    })
    if (deletedReplies.count > 0) {
      console.log(`  └─ Deleted ${deletedReplies.count} child reply/replies first.`)
    }

    // Delete the comment itself
    await prisma.comment.delete({
      where: { id: comment.id }
    })
    console.log(`  ✔ Successfully deleted comment ID: ${comment.id}`)
  }
}

const target = process.argv[2]
deleteComment(target)
  .catch(console.error)
  .finally(() => prisma.$disconnect())
