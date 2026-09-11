require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      content: true,
      createdAt: true,
      author: { select: { personaName: true } },
      community: { select: { name: true } },
      _count: { select: { comments: true, reactions: true } }
    }
  })

  console.log(`Found ${posts.length} total posts in database:`)
  console.log(JSON.stringify(posts, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
