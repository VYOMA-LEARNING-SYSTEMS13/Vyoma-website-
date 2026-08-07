function sanitizeInput(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    .trim()
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Prevent huge input DOS payloads
    .substring(0, 4000);
}

module.exports = {
  sanitizeInput
};
