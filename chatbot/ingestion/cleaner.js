/**
 * Text Cleaner and Normalizer for Knowledge Ingestion
 */
function cleanText(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    // Normalize unicode line endings
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove control characters except newlines/tabs
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Replace 3+ consecutive newlines with 2 newlines
    .replace(/\n{3,}/g, '\n\n')
    // Replace multiple horizontal spaces with single space
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

module.exports = {
  cleanText
};
