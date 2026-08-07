const { createClient } = require('@supabase/supabase-js');
const { env } = require('./env');
const logger = require('./logger');

let supabaseClient = null;

function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    logger.warn('⚠️ Supabase URL or Service Role Key is missing. Supabase database operations will fail until configured.');
    // Lazy/mock initialization fallback
    supabaseClient = createClient(
      env.SUPABASE_URL || 'https://placeholder.supabase.co',
      env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key'
    );
    return supabaseClient;
  }

  supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  return supabaseClient;
}

module.exports = {
  getSupabaseClient
};
