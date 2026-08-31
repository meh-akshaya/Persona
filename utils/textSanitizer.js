/**
 * Backend text sanitization utility for Node.js / Express controllers.
 * - Removes zero-width characters and invisible font Unicode characters.
 * - Trims leading and trailing whitespace and newlines.
 * - Validates non-empty text content.
 */

const INVISIBLE_CHARS_REGEX = /[\u200B-\u200D\uFEFF\u2000-\u200F\u2028-\u202F\u205F-\u206F\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u00AD\u115F\u1160\u180E\u2800\u3000\u3164]/g;

function stripInvisibleChars(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(INVISIBLE_CHARS_REGEX, '')
    .replace(/\u00A0/g, ' ');
}

function sanitizeAndTrimText(text) {
  if (typeof text !== 'string') return '';
  const cleaned = stripInvisibleChars(text);
  const normalizedNewlines = cleaned.replace(/\n{3,}/g, '\n\n');
  return normalizedNewlines.trim();
}

function isInvalidText(text) {
  return !sanitizeAndTrimText(text);
}

module.exports = {
  stripInvisibleChars,
  sanitizeAndTrimText,
  isInvalidText,
};
