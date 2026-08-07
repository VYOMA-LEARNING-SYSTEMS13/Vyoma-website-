const fs = require('fs');
const path = require('path');

function loadJsonFile(filePath) {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const data = JSON.parse(rawContent);

  let category = 'general';
  if (filePath.includes('/pricing/')) category = 'pricing';
  else if (filePath.includes('/products/')) category = 'products';
  else if (filePath.includes('/faq/')) category = 'faq';
  else if (filePath.includes('/services/')) category = 'services';

  let formattedText = '';

  if (Array.isArray(data)) {
    formattedText = data
      .map((item, index) => {
        if (item.question && item.answer) {
          return `Q: ${item.question}\nA: ${item.answer}`;
        }
        if (item.name || item.title) {
          return `Item: ${item.name || item.title}\n` + JSON.stringify(item, null, 2);
        }
        return `Entry ${index + 1}:\n` + JSON.stringify(item, null, 2);
      })
      .join('\n\n');
  } else {
    formattedText = JSON.stringify(data, null, 2);
  }

  return {
    title: filename.replace(/\.(json|example)/g, '').replace(/[-_]/g, ' '),
    source_type: 'json',
    source_url: null,
    category,
    content: formattedText,
    metadata: {
      filePath,
      filename,
      category,
      isStructured: true
    }
  };
}

module.exports = {
  loadJsonFile
};
