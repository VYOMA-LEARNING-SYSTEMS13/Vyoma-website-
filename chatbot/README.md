# Vyoma Learn AI Company Chatbot & RAG Infrastructure

Production-ready backend, RAG (Retrieval-Augmented Generation) pipeline, and API suite for the Vyoma Learn AI Chatbot.

## Architecture Overview

```
Client (Website Visitor / Future Chat UI)
           │
           │ HTTPS / SSE
           ▼
Existing Express Backend (server.js)
           │
  Mounts /api/chatbot
           │
 ┌─────────┴────────────────────────┐
 │ Chatbot Router & Controllers     │
 ├──────────────────────────────────┤
 │ RAG Service & Retrieval Layer    │
 └─────────┬────────────────┬───────┘
           │                │
           ▼                ▼
   Google Gemini API    Supabase PostgreSQL
  (1.5 Flash +          (pgvector extension &
   text-embedding-004)   match_chatbot_chunks RPC)
```

---

## Folder Structure

```
vyomalearn.com/
├── chatbot/
│   ├── config/
│   │   ├── env.js                # Zod environment variable validator
│   │   ├── supabase.js           # Supabase client singleton
│   │   └── logger.js             # Pino structured logger
│   ├── controllers/
│   │   ├── chat.controller.js    # /chat & SSE /chat/stream handlers
│   │   ├── lead.controller.js    # Lead capture handler
│   │   ├── feedback.controller.js# Customer feedback handler
│   │   └── knowledge.controller.js# Health check & knowledge status handlers
│   ├── routes/
│   │   ├── chat.routes.js        # /chat router
│   │   ├── lead.routes.js        # /leads router
│   │   ├── feedback.routes.js    # /feedback router
│   │   ├── knowledge.routes.js   # Health, sessions & knowledge routes
│   │   └── index.js              # Combined API router mounted at /api/chatbot
│   ├── services/
│   │   ├── gemini.service.js     # Gemini LLM text generation & query rewriter
│   │   ├── embedding.service.js  # Gemini text-embedding-004 generator with retries
│   │   ├── retrieval.service.js  # Vector similarity retriever via Supabase RPC
│   │   ├── rag.service.js        # End-to-end RAG orchestrator
│   │   ├── conversation.service.js# Session & message history manager
│   │   └── lead.service.js       # Lead capture persistence
│   ├── ingestion/
│   │   ├── ingest.js             # Main ingestion pipeline runner with deduplication
│   │   ├── chunker.js            # Semantic overlap-aware text chunker
│   │   ├── cleaner.js            # Text normalizer and cleaner
│   │   ├── embedder.js           # Chunk embedding batcher
│   │   └── loaders/
│   │       ├── website.loader.js # Website page HTML/text loader
│   │       ├── pdf.loader.js     # PDF parser loader
│   │       ├── text.loader.js    # Plain text & Markdown loader
│   │       └── json.loader.js    # Structured JSON (FAQ, Pricing) loader
│   ├── rag/
│   │   ├── prompt.js             # Production system prompt & RAG prompt builder
│   │   ├── retriever.js          # High-level search retriever wrapper
│   │   ├── confidence.js         # Similarity threshold evaluator & fallback trigger
│   │   └── citations.js          # Source citation formatting & deduplication
│   ├── middleware/
│   │   ├── error.middleware.js   # Safe centralized error handler
│   │   ├── rateLimit.middleware.js# Endpoint rate limiter (429 handler)
│   │   ├── validate.middleware.js# Zod body validation middleware
│   │   └── security.middleware.js# Helmet security headers
│   ├── schemas/
│   │   ├── chat.schema.js        # Chat request Zod schema
│   │   ├── lead.schema.js        # Lead capture Zod schema
│   │   └── feedback.schema.js    # Feedback rating Zod schema
│   ├── utils/
│   │   ├── asyncHandler.js       # Express async route wrapper
│   │   ├── response.js           # Standardized API response formatter
│   │   ├── ids.js                # UUID generator helper
│   │   └── sanitize.js           # Input sanitizer
│   ├── scripts/
│   │   ├── setup-db.sql          # Supabase pgvector schema & RPC setup script
│   │   ├── seed-knowledge.js     # Ingestion CLI script for data directory
│   │   └── test-rag.js           # RAG quality & fallback verification test suite
│   └── data/                     # Knowledge repository folder
│       ├── company/
│       ├── products/
│       ├── services/
│       ├── pricing/
│       ├── policies/
│       ├── faq/
│       └── terms/
├── server.js                     # Main Express server (mounts /api/chatbot)
└── .env.example
```

---

## Setup Instructions

### 1. Environment Configuration

Copy `.env.example` to `.env` in the repository root and fill in your credentials:

```bash
cp .env.example .env
```

Set the following variables:
- `GEMINI_API_KEY`: Get your free/paid key from [Google AI Studio](https://aistudio.google.com/).
- `SUPABASE_URL`: Your Supabase Project URL (`https://your-project.supabase.co`).
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase Service Role Key (from Project Settings -> API).

### 2. Supabase Database & pgvector Setup

1. Open your Supabase Project SQL Editor.
2. Run the SQL script from `chatbot/scripts/setup-db.sql`.
3. This creates:
   - `vector` extension
   - `chatbot_documents` table
   - `chatbot_document_chunks` table with 768d vector index
   - `chatbot_sessions`, `chatbot_messages`, `chatbot_leads`, `chatbot_feedback` tables
   - `match_chatbot_chunks` RPC vector cosine similarity function

### 3. Ingest Company Knowledge

Place your company markdown, plain text, JSON, or PDF documents inside the `chatbot/data/` subfolders (`company/`, `products/`, `pricing/`, `policies/`, `faq/`, etc.).

Run the ingestion script:

```bash
node chatbot/scripts/seed-knowledge.js
```

### 4. Run RAG Test Suite

Verify your setup by running the test runner:

```bash
node chatbot/scripts/test-rag.js
```

### 5. Start Backend Server

```bash
npm run server
```

The API will be live at `http://localhost:5001/api/chatbot`.

---

## API Endpoints Reference

### Health Check
`GET /api/chatbot/health`

### Non-Streaming Chat
`POST /api/chatbot/chat`

**Request Body:**
```json
{
  "message": "What is your refund policy?",
  "sessionId": "optional-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "answer": "We offer a 14-day 100% money-back guarantee...",
    "sessionId": "123e4567-e89b-12d3-a456-426614174000",
    "messageId": "msg_987654321",
    "sources": [
      {
        "title": "policies.example",
        "url": null,
        "category": "policies"
      }
    ]
  }
}
```

### SSE Token Streaming Chat
`POST /api/chatbot/chat/stream`

Streams Server-Sent Events with events: `start`, `token`, `sources`, `done`, `error`.

### Lead Capture
`POST /api/chatbot/leads`

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1-555-0199",
  "company": "Tech Corp",
  "requirement": "Enterprise AI Training",
  "sessionId": "123e4567-e89b-12d3-a456-426614174000"
}
```

### User Feedback
`POST /api/chatbot/feedback`

**Request Body:**
```json
{
  "sessionId": "123e4567-e89b-12d3-a456-426614174000",
  "messageId": "msg_987654321",
  "rating": 5,
  "comment": "Very helpful explanation!"
}
```
