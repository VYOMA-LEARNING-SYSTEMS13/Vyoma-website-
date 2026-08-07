const { cleanText } = require('../cleaner');

function loadWebsiteContent({ title, url, htmlOrText, category = 'website' }) {
  // Strip HTML tags if present
  const textOnly = htmlOrText
    ? htmlOrText.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, ' ')
    : '';

  const cleaned = cleanText(textOnly);

  return {
    title: title || 'Website Page',
    source_type: 'website',
    source_url: url || null,
    category,
    content: cleaned,
    metadata: {
      url,
      category,
      source: 'website'
    }
  };
}

module.exports = {
  loadWebsiteContent
};
