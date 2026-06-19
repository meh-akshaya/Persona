/**
 * Scans post content for privacy leaks before publishing.
 * Returns an array of detected leak types.
 */

const patterns = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /(\+91[\s-]?)?[6-9]\d{9}|(\+1[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,
  instagram: /@[a-zA-Z0-9._]{1,30}|\binstagram\.com\/[a-zA-Z0-9._]+/gi,
  personalLink: /\b(linkedin\.com|facebook\.com|twitter\.com|t\.me|wa\.me|snapchat\.com)\/[^\s]+/gi,
}

/**
 * @param {string} content
 * @returns {{ hasLeak: boolean, leaks: string[] }}
 */
function detectPrivacyLeaks(content) {
  const leaks = []

  for (const [type, pattern] of Object.entries(patterns)) {
    pattern.lastIndex = 0 // reset regex state
    if (pattern.test(content)) {
      leaks.push(type)
    }
  }

  return {
    hasLeak: leaks.length > 0,
    leaks,
  }
}

module.exports = { detectPrivacyLeaks }
