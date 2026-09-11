require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function deletePost(idOrPattern) {
  if (!idOrPattern) {
    console.log('Usage: node scripts/deletePost.js <post_id_or_keyword>')
    process.exit(1)
  }

  // Find matching posts
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { id: idOrPattern },
        { content: { contains: idOrPattern, mode: 'insensitive' } }
      ]
    }
  })

  if (posts.length === 0) {
    console.log(`No posts found matching "${idOrPattern}"`)
    return
  }

  console.log(`Found ${posts.length} post(s) to delete:`)
  for (const post of posts) {
    const preview = post.content.replace(/\n/g, ' ').slice(0, 60)
    console.log(`- ID: ${post.id} | Content: "${preview}..."`)

    // Delete the post (comments and reactions delete automatically via onDelete: Cascade)
    await prisma.post.delete({
      where: { id: post.id }
    })
    console.log(`  ✔ Successfully deleted Post ID: ${post.id}`)
  }
}

const target = process.argv[2]
deletePost(target)
  .catch(console.error)
  .finally(() => prisma.$disconnect())
