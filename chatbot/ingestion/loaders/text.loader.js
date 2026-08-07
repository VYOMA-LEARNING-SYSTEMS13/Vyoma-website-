const fs = require('fs');
const path = require('path');

function loadTextFile(filePath) {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();

  let category = 'general';
  if (filePath.includes('/policies/')) category = 'policies';
  else if (filePath.includes('/company/')) category = 'company';
  else if (filePath.includes('/services/')) category = 'services';
  else if (filePath.includes('/terms/')) category = 'terms';
  else if (filePath.includes('/faq/')) category = 'faq';
  else if (filePath.includes('/pricing/')) category = 'pricing';
  else if (filePath.includes('/products/')) category = 'products';

  return {
    title: filename.replace(/\.(md|txt|example)/g, '').replace(/[-_]/g, ' '),
    source_type: ext === '.md' ? 'markdown' : 'text',
    source_url: null,
    category,
    content: rawContent,
    metadata: {
      filePath,
      filename,
      category
    }
  };
}

module.exports = {
  loadTextFile
};
