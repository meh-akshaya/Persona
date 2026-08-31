/**
 * Utility functions to sanitize text inputs:
 * - Removes zero-width characters, invisible unicode format codes, braille blanks, hangul fillers, etc.
 * - Trims unnecessary leading and trailing whitespace/newlines.
 * - Prevents pasting of purely empty spaces or invisible characters.
 */

// Regex covering zero-width spaces, invisible characters, format controls, braille blanks, hangul fillers, etc.
export const INVISIBLE_CHARS_REGEX = /[\u200B-\u200D\uFEFF\u2000-\u200F\u2028-\u202F\u205F-\u206F\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F\u00AD\u115F\u1160\u180E\u2800\u3000\u3164]/g;

/**
 * Strips zero-width characters and invisible font symbols from string.
 * Converts non-breaking space (\u00A0) to standard space.
 * @param {string} text
 * @returns {string}
 */
export function stripInvisibleChars(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(INVISIBLE_CHARS_REGEX, '')
    .replace(/\u00A0/g, ' ');
}

/**
 * Cleans text by removing invisible characters, normalizing excessive consecutive empty lines,
 * and trimming leading and trailing whitespace.
 * @param {string} text
 * @returns {string}
 */
export function sanitizeAndTrimText(text) {
  if (typeof text !== 'string') return '';
  const cleaned = stripInvisibleChars(text);
  // Replace 3 or more consecutive newlines with 2 newlines (prevents empty line spam)
  const normalizedNewlines = cleaned.replace(/\n{3,}/g, '\n\n');
  return normalizedNewlines.trim();
}

/**
 * Returns true if text is empty or consists solely of whitespace / invisible characters.
 * @param {string} text
 * @returns {boolean}
 */
export function isInvalidText(text) {
  return !sanitizeAndTrimText(text);
}

/**
 * Helper to intercept paste events on text inputs/textareas.
 * Sanitizes pasted clipboard content, preventing pasting if content contains only spaces/invisible chars.
 * @param {React.ClipboardEvent} e
 * @param {Function} setContent
 * @param {Function} [setError]
 */
export function handlePasteSanitization(e, setContent, setError) {
  const pasteText = e.clipboardData ? e.clipboardData.getData('text') : '';
  if (!pasteText) return;

  const cleanedSnippet = stripInvisibleChars(pasteText);

  // If pasted text turns out to be only spaces or invisible characters
  if (!cleanedSnippet.trim()) {
    e.preventDefault();
    if (setError) {
      setError('Pasted content contains only spaces or invisible characters.');
    }
    return;
  }

  // Intercept standard paste to ensure zero-width & invisible characters are stripped
  e.preventDefault();
  const target = e.target;
  const start = target.selectionStart || 0;
  const end = target.selectionEnd || 0;
  const currentValue = target.value || '';

  const newValue = currentValue.substring(0, start) + cleanedSnippet + currentValue.substring(end);
  const finalValue = stripInvisibleChars(newValue);

  setContent(finalValue);
  if (setError) setError(null);

  setTimeout(() => {
    try {
      target.selectionStart = target.selectionEnd = start + cleanedSnippet.length;
    } catch (_) {}
  }, 0);
}
