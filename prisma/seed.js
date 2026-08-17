const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const communities = [
  {
    name: 'Career & Placements',
    slug: 'career-placements',
    description: 'Interview nerves, offer dilemmas, rejections nobody talks about.',
    icon: '💼',
  },
  {
    name: 'Coding & Tech',
    slug: 'coding-tech',
    description: 'Imposter syndrome, debugging at 3am, the code review that broke you.',
    icon: '💻',
  },
  {
    name: 'Startups',
    slug: 'startups',
    description: 'Founder burnout, co-founder fallouts, the pitch that went nowhere.',
    icon: '🚀',
  },
  {
    name: 'Relationships and Emotions',
    slug: 'relationships-emotions',
    description: 'The stuff you can\'t say to the person it\'s actually about.',
    icon: '💬',
  },
  {
    name: 'Fitness & Health',
    slug: 'fitness-health',
    description: 'Body image, motivation crashes, the gym you keep avoiding.',
    icon: '🏃',
  },
  {
    name: 'Life Discussions and Geopolitics',
    slug: 'life-geopolitics',
    description: 'Big questions, bigger opinions — said without your name attached.',
    icon: '🌍',
  },
  {
    name: 'Finance',
    slug: 'finance',
    description: 'Salary confusion, debt nobody knows about, money mistakes.',
    icon: '💰',
  },
]

async function main() {
  console.log('Seeding communities...')

  for (const community of communities) {
    const result = await prisma.community.upsert({
      where: { slug: community.slug },
      update: {}, // if it already exists, don't overwrite
      create: community,
    })
    console.log(`✓ ${result.icon} ${result.name}`)
  }

  console.log(`\nDone — ${communities.length} communities seeded.`)
}

main()
  .catch((err) => {
    console.error('Seed error:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
