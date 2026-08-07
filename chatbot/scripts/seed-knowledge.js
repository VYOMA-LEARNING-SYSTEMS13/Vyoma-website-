const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { loadTextFile } = require('../ingestion/loaders/text.loader');
const { loadJsonFile } = require('../ingestion/loaders/json.loader');
const { loadPdfFile } = require('../ingestion/loaders/pdf.loader');
const { ingestDocument } = require('../ingestion/ingest');
const logger = require('../config/logger');

const DATA_DIR = path.join(__dirname, '../data');

async function seedKnowledgeDirectory(dirPath = DATA_DIR) {
  if (!fs.existsSync(dirPath)) {
    logger.error({ dirPath }, 'Data directory does not exist');
    return;
  }

  logger.info({ dirPath }, 'Starting knowledge base seeding scan...');

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      await seedKnowledgeDirectory(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();

      try {
        let loadedDoc = null;
        if (ext === '.md' || ext === '.txt') {
          loadedDoc = loadTextFile(fullPath);
        } else if (ext === '.json') {
          loadedDoc = loadJsonFile(fullPath);
        } else if (ext === '.pdf') {
          loadedDoc = await loadPdfFile(fullPath);
        }

        if (loadedDoc) {
          logger.info({ file: entry.name, category: loadedDoc.category }, 'Ingesting file into vector DB');
          await ingestDocument({
            title: loadedDoc.title,
            source_type: loadedDoc.source_type,
            source_url: loadedDoc.source_url,
            category: loadedDoc.category,
            content: loadedDoc.content,
            metadata: loadedDoc.metadata,
            force: true
          });
        }
      } catch (err) {
        logger.error({ err: err.message, file: entry.name }, 'Failed to ingest file during seed');
      }
    }
  }

  logger.info('Knowledge base seeding completed!');
}

if (require.main === module) {
  seedKnowledgeDirectory()
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error({ err }, 'Seeding script encountered fatal error');
      process.exit(1);
    });
}

module.exports = {
  seedKnowledgeDirectory
};
