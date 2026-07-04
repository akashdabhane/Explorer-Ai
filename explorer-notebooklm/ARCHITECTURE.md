# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Auth Pages   │  │  Dashboard   │  │  Components  │      │
│  │ (Sign In/Up) │  │   (Main UI)  │  │  (Reusable)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    NEXT.JS APP (Vercel)                      │
│  ┌────────────────────────────────────────────────────┐     │
│  │              App Router (src/app)                  │     │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │     │
│  │  │   Auth   │  │Dashboard │  │   API    │        │     │
│  │  │  Routes  │  │  Routes  │  │  Routes  │        │     │
│  │  └──────────┘  └──────────┘  └──────────┘        │     │
│  └────────────────────────────────────────────────────┘     │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │           Business Logic (src/lib)                 │     │
│  │  ┌──────────────────────────────────────────┐     │     │
│  │  │ • Authentication (NextAuth)              │     │     │
│  │  │ • RAG Service (Query Processing)         │     │     │
│  │  │ • Document Processor (Ingestion)         │     │     │
│  │  │ • AI Client (Gemini Integration)         │     │     │
│  │  │ • Vector Client (ChromaDB)               │     │     │
│  │  │ • Storage Client (Cloudinary)            │     │     │
│  │  │ • Database Client (MongoDB)              │     │     │
│  │  └──────────────────────────────────────────┘     │     │
│  └────────────────────────────────────────────────────┘     │
└────────┬─────────────┬─────────────┬──────────────┬─────────┘
         │             │             │              │
         ▼             ▼             ▼              ▼
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────┐
│  MongoDB   │ │  ChromaDB  │ │ Cloudinary │ │ Gemini API   │
│  (Atlas)   │ │ (Railway)  │ │  (Cloud)   │ │   (Google)   │
│            │ │            │ │            │ │              │
│ • Users    │ │ • Vectors  │ │ • Files    │ │ • Embeddings │
│ • Notebooks│ │ • Metadata │ │ • PDFs     │ │ • Generation │
│ • Docs     │ │ • Search   │ │ • Images   │ │ • Streaming  │
│ • Chunks   │ │            │ │            │ │              │
└────────────┘ └────────────┘ └────────────┘ └──────────────┘
```

## Data Flow

### 1. User Authentication Flow

```
User → Sign Up Page → API /auth/signup → MongoDB
                                        ↓
User ← Dashboard   ← NextAuth Session ←┘
```

### 2. Document Upload & Processing Flow

```
User selects file
      ↓
FileUpload Component
      ↓
API /documents/upload
      ↓
┌─────────────────────────────────────┐
│    Document Processing Pipeline     │
├─────────────────────────────────────┤
│ 1. Upload to Cloudinary             │
│ 2. Create Document record (MongoDB) │
│ 3. Extract text (pdf-parse/mammoth) │
│ 4. Chunk text (1000 chars, 200 ovr)│
│ 5. Generate embeddings (Gemini)     │
│ 6. Store vectors (ChromaDB)         │
│ 7. Store metadata (MongoDB)         │
│ 8. Update document status           │
└─────────────────────────────────────┘
      ↓
User sees completed document
```

### 3. RAG Query Flow

```
User types question
      ↓
ChatInterface Component
      ↓
API /chat (POST)
      ↓
┌─────────────────────────────────────┐
│        RAG Pipeline                 │
├─────────────────────────────────────┤
│ 1. Embed query (Gemini)             │
│ 2. Vector search (ChromaDB)         │
│    - Find top-K similar chunks      │
│ 3. Fetch chunk metadata (MongoDB)   │
│ 4. Construct prompt with context    │
│ 5. Generate answer (Gemini)         │
│    - Streaming response             │
│ 6. Save to conversation history     │
└─────────────────────────────────────┘
      ↓
User sees streaming answer + sources
```

## Database Schemas

### MongoDB Collections

**users**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  provider: String (credentials/google/github),
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

**notebooks**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  title: String,
  description: String,
  color: String,
  documentCount: Number,
  conversationHistory: [
    {
      role: String (user/assistant),
      content: String,
      sources: Array,
      timestamp: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**documents**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  notebookId: ObjectId (ref: notebooks),
  fileName: String,
  originalFileName: String,
  fileType: String (pdf/docx/txt/md),
  fileSize: Number,
  cloudinaryUrl: String,
  cloudinaryPublicId: String,
  status: String (processing/completed/failed),
  totalPages: Number,
  totalChunks: Number,
  processingMetadata: {
    extractedAt: Date,
    chunkedAt: Date,
    embeddedAt: Date,
    indexedAt: Date
  },
  createdAt: Date,
  updatedAt: Date
}
```

**chunkmetadata**
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: users),
  notebookId: ObjectId (ref: notebooks),
  documentId: ObjectId (ref: documents),
  chunkId: String (unique, UUID),
  chunkIndex: Number,
  content: String,
  pageNumber: Number,
  startCharIndex: Number,
  endCharIndex: Number,
  chromaCollectionId: String,
  createdAt: Date,
  updatedAt: Date
}
```

### ChromaDB Collections

**Collection per Notebook**: `notebook_{notebookId}`

```javascript
{
  id: String (UUID chunkId),
  embedding: Float32Array (768 dimensions),
  document: String (chunk content),
  metadata: {
    documentId: String,
    fileName: String,
    pageNumber: Number,
    chunkIndex: Number
  }
}
```

## API Routes

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - NextAuth credentials
- `GET /api/auth/callback/google` - OAuth callback
- `GET /api/auth/callback/github` - OAuth callback

### Notebooks
- `GET /api/notebooks` - List user notebooks
- `POST /api/notebooks` - Create notebook
- `GET /api/notebooks/:id` - Get notebook details
- `PATCH /api/notebooks/:id` - Update notebook
- `DELETE /api/notebooks/:id` - Delete notebook
- `GET /api/notebooks/:id/conversation` - Get chat history
- `DELETE /api/notebooks/:id/conversation` - Clear chat

### Documents
- `POST /api/documents/upload` - Upload & process document
- `GET /api/notebooks/:id/documents` - List documents
- `DELETE /api/documents/:id` - Delete document

### Chat & Actions
- `POST /api/chat` - RAG query (streaming)
- `POST /api/notebooks/:id/actions` - Advanced actions

## Component Hierarchy

```
RootLayout (AuthProvider)
├── HomePage (redirects to /dashboard)
├── AuthPages
│   ├── SignInPage
│   └── SignUpPage
└── DashboardPage
    ├── NotebookList (Left Sidebar)
    │   └── Individual Notebook Items
    ├── DocumentPanel (Middle)
    │   ├── DocumentList
    │   ├── FileUpload
    │   └── QuickActions
    └── ChatInterface (Right)
        ├── MessageList
        ├── StreamingMessage
        └── InputForm
```

## State Management (Zustand)

```javascript
NotebookStore:
  - notebooks: Array
  - currentNotebook: Object
  - documents: Array
  - conversationHistory: Array
  - isLoading: Boolean
  - error: String

Actions:
  - setNotebooks()
  - addNotebook()
  - updateNotebook()
  - deleteNotebook()
  - setCurrentNotebook()
  - addDocument()
  - deleteDocument()
  - addMessage()
  - clearConversation()
```

## Security Layers

1. **Authentication**: NextAuth JWT sessions
2. **Authorization**: User ID verification on all API routes
3. **Input Validation**: File type, size, format checks
4. **Rate Limiting**: In-memory rate limiter
5. **Data Isolation**: Users can only access their own data
6. **Secure Storage**: Hashed passwords, encrypted connections

## Scalability Considerations

### Current Architecture
- Supports hundreds of concurrent users
- Handles documents up to 10MB
- Processes ~1000 chunks per document
- Stores unlimited notebooks per user

### Future Enhancements
- **Queue System**: Bull/BullMQ for background processing
- **Caching**: Redis for frequent queries
- **CDN**: Cloudflare for static assets
- **Load Balancing**: Multiple Next.js instances
- **Database Sharding**: MongoDB sharding for scale
- **Vector DB**: Chroma Cloud or Pinecone for scale

## Performance Metrics

**Target Response Times**:
- Auth: < 500ms
- Document Upload: < 2s (upload) + background processing
- RAG Query: < 3s for first token, streaming thereafter
- Vector Search: < 200ms
- UI Interactions: < 100ms

**Throughput**:
- 100 requests/minute per user (rate limited)
- 1000+ documents per notebook
- 10,000+ chunks per notebook
- Unlimited conversations

---

This architecture is designed for **production deployment** with emphasis on:
- ✅ Scalability
- ✅ Security
- ✅ Performance
- ✅ Maintainability
- ✅ User Experience
