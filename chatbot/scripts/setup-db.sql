-- =========================================================
-- Vyoma Learn Chatbot - Database Setup & Vector Migration
-- =========================================================

-- 1. Enable pgvector extension
create extension if not exists vector;

-- 2. Chatbot Documents Table
create table if not exists public.chatbot_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source_type text not null,
  source_url text,
  category text not null,
  metadata jsonb default '{}'::jsonb,
  content_hash text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Chatbot Document Chunks Table (with 768d vector embedding)
create table if not exists public.chatbot_document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid references public.chatbot_documents(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  embedding vector(768),
  metadata jsonb default '{}'::jsonb,
  token_count integer default 0,
  created_at timestamptz default now()
);

-- Index for fast vector similarity search using Cosine distance
create index if not exists idx_chatbot_chunks_embedding 
on public.chatbot_document_chunks 
using hnsw (embedding vector_cosine_ops);

-- Index for document lookup and status filtering
create index if not exists idx_chatbot_docs_active on public.chatbot_documents(is_active);
create index if not exists idx_chatbot_docs_hash on public.chatbot_documents(content_hash);
create index if not exists idx_chatbot_chunks_doc_id on public.chatbot_document_chunks(document_id);

-- 4. Chatbot Sessions Table
create table if not exists public.chatbot_sessions (
  id uuid primary key default gen_random_uuid(),
  visitor_id text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Chatbot Messages Table
create table if not exists public.chatbot_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.chatbot_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  sources jsonb default '[]'::jsonb,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists idx_chatbot_messages_session on public.chatbot_messages(session_id, created_at asc);

-- 6. Chatbot Leads Table
create table if not exists public.chatbot_leads (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.chatbot_sessions(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  company text,
  requirement text,
  status text default 'new',
  created_at timestamptz default now()
);

-- 7. Chatbot Feedback Table
create table if not exists public.chatbot_feedback (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.chatbot_sessions(id) on delete cascade,
  message_id uuid references public.chatbot_messages(id) on delete set null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now()
);

-- 8. RPC Vector Similarity Search Function
create or replace function match_chatbot_chunks(
  query_embedding vector(768),
  match_count int default 5,
  similarity_threshold double precision default 0.5,
  filter_category text default null
)
returns table (
  chunk_id uuid,
  document_id uuid,
  content text,
  metadata jsonb,
  similarity double precision,
  title text,
  source_url text,
  category text
)
language plpgsql
as $$
begin
  return query
  select
    c.id as chunk_id,
    c.document_id,
    c.content,
    c.metadata,
    1 - (c.embedding <=> query_embedding) as similarity,
    d.title,
    d.source_url,
    d.category
  from public.chatbot_document_chunks c
  join public.chatbot_documents d on c.document_id = d.id
  where d.is_active = true
    and (filter_category is null or d.category = filter_category)
    and (1 - (c.embedding <=> query_embedding)) >= similarity_threshold
  order by c.embedding <=> query_embedding asc
  limit match_count;
end;
$$;
