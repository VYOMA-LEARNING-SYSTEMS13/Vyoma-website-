const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const logger = require('../../config/logger');

async function loadPdfFile(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const filename = path.basename(filePath);

    let category = 'document';
    if (filePath.includes('/policies/')) category = 'policies';
    else if (filePath.includes('/terms/')) category = 'terms';

    return {
      title: filename.replace(/\.pdf$/i, '').replace(/[-_]/g, ' '),
      source_type: 'pdf',
      source_url: null,
      category,
      content: pdfData.text || '',
      metadata: {
        filePath,
        filename,
        pageCount: pdfData.numpages,
        category
      }
    };
  } catch (error) {
    logger.error({ err: error, filePath }, 'Failed to parse PDF file');
    throw error;
  }
}

module.exports = {
  loadPdfFile
};
