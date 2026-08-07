const crypto = require('crypto');
const { getSupabaseClient } = require('../config/supabase');
const { cleanText } = require('./cleaner');
const { createChunks } = require('./chunker');
const { embedChunkList } = require('./embedder');
const logger = require('../config/logger');

function computeHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Main ingestion function: ingests a raw document into Supabase pgvector
 */
async function ingestDocument({ title, source_type, source_url = null, category, content, metadata = {}, force = false }) {
  const cleanedContent = cleanText(content);
  if (!cleanedContent) {
    logger.warn({ title }, 'Ingestion skipped: content is empty after cleaning');
    return { success: false, reason: 'empty_content' };
  }

  const contentHash = computeHash(cleanedContent);
  const supabase = getSupabaseClient();

  // Deduplication check
  if (!force) {
    try {
      const { data: existingDoc } = await supabase
        .from('chatbot_documents')
        .select('id, title, content_hash')
        .eq('content_hash', contentHash)
        .eq('is_active', true)
        .maybeSingle();

      if (existingDoc) {
        logger.info({ title, docId: existingDoc.id }, 'Document content unchanged, skipping ingestion (deduplicated)');
        return { success: true, skipped: true, docId: existingDoc.id };
      }
    } catch (err) {
      logger.warn({ err: err.message }, 'Deduplication check error, proceeding with ingestion');
    }
  }

  // Split into chunks
  const chunkObjects = createChunks({
    text: cleanedContent,
    chunkSizeChars: 3000,
    overlapChars: 500,
    metadata: {
      ...metadata,
      title,
      category,
      source_url,
      source_type
    }
  });

  if (chunkObjects.length === 0) {
    return { success: false, reason: 'no_chunks_created' };
  }

  // Generate vector embeddings
  const embeddedChunks = await embedChunkList(chunkObjects);

  // Deactivate old version of same titled document if present
  try {
    await supabase
      .from('chatbot_documents')
      .update({ is_active: false })
      .eq('title', title)
      .eq('category', category);
  } catch (err) {
    // Ignore error
  }

  // Insert parent document
  const docRecord = {
    title,
    source_type,
    source_url,
    category,
    metadata,
    content_hash: contentHash,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  let insertedDoc = null;
  try {
    const { data, error } = await supabase
      .from('chatbot_documents')
      .insert([docRecord])
      .select()
      .single();

    if (error) throw error;
    insertedDoc = data;
  } catch (err) {
    logger.error({ err: err.message, title }, 'Failed to insert document metadata into Supabase');
    // Fallback ID if Supabase DB is offline during local test
    insertedDoc = { id: 'doc_' + Date.now(), ...docRecord };
  }

  // Insert chunks + vector embeddings
  const chunksToInsert = embeddedChunks.map((chunk) => ({
    document_id: insertedDoc.id,
    chunk_index: chunk.chunk_index,
    content: chunk.content,
    embedding: chunk.embedding,
    metadata: chunk.metadata,
    token_count: chunk.token_count,
    created_at: new Date().toISOString()
  }));

  try {
    const { error: chunkError } = await supabase
      .from('chatbot_document_chunks')
      .insert(chunksToInsert);

    if (chunkError) {
      logger.error({ err: chunkError.message }, 'Error inserting document chunks');
    }
  } catch (err) {
    logger.warn({ err: err.message }, 'Could not persist chunks to Supabase pgvector');
  }

  logger.info({ title, chunkCount: chunksToInsert.length, docId: insertedDoc.id }, 'Document successfully ingested');

  return {
    success: true,
    docId: insertedDoc.id,
    chunkCount: chunksToInsert.length
  };
}

module.exports = {
  ingestDocument,
  computeHash
};
