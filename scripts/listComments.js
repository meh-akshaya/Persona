require('dotenv').config({ path: require('path').join(__dirname, '../server/.env') })
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      content: true,
      createdAt: true,
      postId: true,
      parentId: true,
      author: {
        select: { personaName: true }
      }
    }
  })

  console.log(`Found ${comments.length} total comments in database:`)
  console.log(JSON.stringify(comments, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
