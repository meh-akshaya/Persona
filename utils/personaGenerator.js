const adjectives = [
  'Silent', 'Calm', 'Swift', 'Bold', 'Quiet', 'Brave', 'Wise',
  'Sharp', 'Wild', 'Steady', 'Bright', 'Dark', 'Lone', 'Free',
  'Cold', 'Deep', 'Vast', 'Still', 'Soft', 'Iron'
]

const nouns = [
  'Fox', 'Eagle', 'River', 'Storm', 'Pine', 'Wolf', 'Hawk',
  'Stone', 'Creek', 'Dusk', 'Tide', 'Ash', 'Reed', 'Vale',
  'Peak', 'Mist', 'Fern', 'Crow', 'Lynx', 'Wren'
]

const emojis = [
  '🦊', '🦅', '🌊', '⛈️', '🌲', '🐺', '🦆',
  '🪨', '🌙', '🌑', '🌊', '🌫️', '🌿', '🏔️',
  '🦅', '🌫️', '🍃', '🐦', '🐈', '🐦'
]

// Soft palette — one per noun (index-matched)
const colors = [
  '#E07A5F', '#3D405B', '#81B29A', '#F2CC8F', '#264653',
  '#2A9D8F', '#E9C46A', '#F4A261', '#6D6875', '#B5838D',
  '#E29578', '#457B9D', '#A8DADC', '#1D3557', '#C77DFF',
  '#7B2D8B', '#52B788', '#40916C', '#1B4332', '#081C15'
]

/**
 * Generates a unique persona name by checking against existing names in DB.
 * @param {import('@prisma/client').PrismaClient} prisma
 * @returns {{ personaName, personaEmoji, personaColor }}
 */
async function generateUniquePersona(prisma) {
  let personaName, nounIndex
  let attempts = 0

  // Keep trying until we find an unused name
  while (true) {
    attempts++
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
    nounIndex = Math.floor(Math.random() * nouns.length)
    const noun = nouns[nounIndex]
    personaName = `${adj}${noun}`

    const existing = await prisma.user.findUnique({ where: { personaName } })
    if (!existing) break

    // Safety: if somehow we've tried too many times, append a number
    if (attempts > 50) {
      personaName = `${personaName}${Math.floor(Math.random() * 999)}`
      break
    }
  }

  return {
    personaName,
    personaEmoji: emojis[nounIndex],
    personaColor: colors[nounIndex],
  }
}

module.exports = { generateUniquePersona }
