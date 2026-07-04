# NotebookLM Clone - Production-Ready Documentation

A full-stack, production-ready clone of Google's NotebookLM built with Next.js, featuring RAG (Retrieval-Augmented Generation) powered by Gemini AI, vector storage with Chroma, and document processing capabilities.

## 🚀 Features

### Core Functionality
- **Multi-Notebook Management**: Create, edit, and delete multiple notebooks
- **Document Upload & Processing**: Support for PDF, DOCX, TXT, and Markdown files
- **Intelligent RAG Pipeline**: Context-aware answers strictly from uploaded documents
- **Real-time Streaming Responses**: Live AI responses with source citations
- **Conversation History**: Persistent chat history per notebook
- **Advanced Actions**: Generate summaries, study guides, FAQs, and timelines

### Technical Highlights
- **Authentication**: NextAuth with credentials and OAuth (Google, GitHub)
- **Vector Search**: Chroma DB with cosine similarity
- **AI Integration**: Google Gemini API for embeddings and generation
- **File Storage**: Cloudinary for secure document hosting
- **Database**: MongoDB with Mongoose ODM
- **Modern UI**: Responsive design inspired by NotebookLM

## 📋 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14+ (App Router) |
| Auth | NextAuth.js |
| Database | MongoDB + Mongoose |
| Vector DB | ChromaDB (self-hosted) |
| File Storage | Cloudinary |
| AI Provider | Google Gemini API |
| State Management | Zustand |
| UI Libraries | Tailwind CSS, Lucide Icons |
| File Processing | pdf-parse, mammoth, marked |

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** (local or Atlas)
- **Chroma DB** (Docker recommended)
- **Cloudinary Account**
- **Google Gemini API Key**

### 1. Clone and Install

```bash
cd explore-notebooklm-clone
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local` and configure:

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/notebooklm-clone
# or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notebooklm-clone

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Generate NEXTAUTH_SECRET with:
# openssl rand -base64 32

# Google Gemini API
GOOGLE_GEMINI_API_KEY=your-gemini-api-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Chroma Vector DB
CHROMA_URL=http://localhost:8000

# Optional: OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod --dbpath /path/to/data
```

**Or use MongoDB Atlas** (cloud database):
1. Create account at mongodb.com/cloud/atlas
2. Create cluster and get connection string
3. Update `MONGODB_URI` in `.env.local`

### 4. Start ChromaDB

**Using Docker (Recommended):**
```bash
docker pull chromadb/chroma
docker run -p 8000:8000 chromadb/chroma
```

**Or install locally:**
```bash
pip install chromadb
chroma run --host localhost --port 8000
```

### 5. Set Up Cloudinary

1. Sign up at cloudinary.com
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Add to `.env.local`

### 6. Get Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Create new API key
3. Add to `.env.local` as `GOOGLE_GEMINI_API_KEY`

### 7. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 🏗️ Project Structure

```
explore-notebooklm-clone/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── auth/
│   │   │       ├── signin/page.js      # Sign in page
│   │   │       └── signup/page.js      # Sign up page
│   │   ├── (dashboard)/
│   │   │   └── dashboard/page.js       # Main dashboard
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.js  # NextAuth config
│   │   │   │   └── signup/route.js         # User registration
│   │   │   ├── notebooks/
│   │   │   │   ├── route.js                # List/create notebooks
│   │   │   │   └── [id]/
│   │   │   │       ├── route.js            # Get/update/delete notebook
│   │   │   │       ├── documents/route.js  # List documents
│   │   │   │       ├── conversation/route.js # Get/clear chat
│   │   │   │       └── actions/route.js    # Advanced actions
│   │   │   ├── documents/
│   │   │   │   ├── upload/route.js         # Upload & process docs
│   │   │   │   └── [id]/route.js           # Delete document
│   │   │   └── chat/route.js               # RAG streaming chat
│   │   ├── layout.js                       # Root layout
│   │   └── page.js                         # Home redirect
│   ├── components/
│   │   ├── AuthProvider.js                 # NextAuth provider
│   │   ├── NotebookList.js                 # Notebook sidebar
│   │   ├── DocumentList.js                 # Document list view
│   │   ├── FileUpload.js                   # Drag & drop upload
│   │   └── ChatInterface.js                # Chat UI
│   ├── lib/
│   │   ├── mongodb.js                      # MongoDB connection
│   │   ├── chromaClient.js                 # Chroma operations
│   │   ├── geminiClient.js                 # Gemini AI integration
│   │   ├── cloudinaryClient.js             # Cloudinary upload/delete
│   │   ├── textExtraction.js               # PDF/DOCX/TXT parsing
│   │   ├── chunking.js                     # Text chunking logic
│   │   ├── documentProcessor.js            # Full doc pipeline
│   │   ├── ragService.js                   # RAG query logic
│   │   └── store.js                        # Zustand state
│   └── models/
│       ├── User.js                         # User schema
│       ├── Notebook.js                     # Notebook schema
│       ├── Document.js                     # Document schema
│       └── ChunkMetadata.js                # Chunk metadata schema
├── .env.local                              # Environment variables
├── .env.example                            # Example env file
├── package.json                            # Dependencies
└── README.md                               # This file
```

## 🔑 Key Concepts

### RAG Pipeline Flow

1. **Document Upload**: User uploads PDF/DOCX/TXT/MD file
2. **Text Extraction**: Content extracted using appropriate parser
3. **Chunking**: Text split into overlapping chunks (~1000 chars)
4. **Embedding**: Each chunk embedded using Gemini embeddings API
5. **Vector Storage**: Embeddings stored in Chroma with metadata
6. **Metadata Storage**: Chunk info stored in MongoDB for retrieval
7. **Query Processing**:
   - User query embedded
   - Top-K similar chunks retrieved from Chroma
   - Context + query sent to Gemini
   - Streaming response with source citations

### Database Schema

**User**: Authentication and profile  
**Notebook**: User's notebook with conversation history  
**Document**: Uploaded file metadata and processing status  
**ChunkMetadata**: Individual chunk data with page numbers

### Vector Collections

Each notebook gets its own Chroma collection:
- Collection name: `notebook_{notebookId}`
- Metadata: documentId, fileName, pageNumber, chunkIndex
- Enables notebook-scoped retrieval

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy on Vercel**:
   - Visit vercel.com and sign in
   - Import your GitHub repository
   - Add all environment variables from `.env.local`
   - Deploy

3. **Set Up External Services**:
   - Use MongoDB Atlas (not local MongoDB)
   - Deploy Chroma on Railway/Render or use Chroma Cloud
   - Cloudinary and Gemini API work as-is

### Chroma Deployment Options

**Option 1: Railway**
```bash
# Deploy Chroma on Railway
railway init
railway add
# Add chromadb/chroma Docker image
railway up
```

**Option 2: Render**
- Create new Web Service
- Use Docker image: `chromadb/chroma`
- Set port to 8000
- Update `CHROMA_URL` in Vercel

**Option 3: Self-hosted VPS**
```bash
ssh user@your-vps
docker run -d -p 8000:8000 --name chroma chromadb/chroma
```

### Production Checklist

- ✅ Use MongoDB Atlas instead of local MongoDB
- ✅ Deploy Chroma on persistent hosting
- ✅ Set strong `NEXTAUTH_SECRET`
- ✅ Enable Cloudinary security features
- ✅ Set up OAuth credentials (Google/GitHub)
- ✅ Configure CORS if needed
- ✅ Enable rate limiting on API routes
- ✅ Set up monitoring (Sentry, LogRocket)
- ✅ Add backup strategy for MongoDB

## 📖 API Routes

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Sign in (NextAuth)

### Notebooks
- `GET /api/notebooks` - List user notebooks
- `POST /api/notebooks` - Create notebook
- `GET /api/notebooks/:id` - Get notebook
- `PATCH /api/notebooks/:id` - Update notebook
- `DELETE /api/notebooks/:id` - Delete notebook

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/notebooks/:id/documents` - List documents
- `DELETE /api/documents/:id` - Delete document

### Chat & Actions
- `POST /api/chat` - RAG query (streaming)
- `GET /api/notebooks/:id/conversation` - Get chat history
- `DELETE /api/notebooks/:id/conversation` - Clear chat
- `POST /api/notebooks/:id/actions` - Generate summary/FAQ/etc

## 🎯 Usage Examples

### Creating a Notebook
1. Click "New Notebook"
2. Enter title and create
3. Upload documents (PDF, DOCX, TXT, MD)
4. Wait for processing (automatic)

### Asking Questions
1. Select notebook with documents
2. Type question in chat
3. Receive streaming answer with sources
4. Sources show file name and page number

### Advanced Actions
1. Select notebook
2. Click action button (Summary, Study Guide, FAQ, Timeline)
3. View generated content in middle panel

## 🔧 Customization

### Adjust Chunking Strategy
Edit `src/lib/chunking.js`:
```javascript
export function chunkText(text, chunkSize = 1000, overlap = 200) {
  // Modify parameters
}
```

### Change AI Temperature
Edit `src/lib/ragService.js`:
```javascript
const answer = await generateAnswer(prompt, retrievedChunks, 0.7); // 0.0-1.0
```

### Modify Top-K Results
In chat query:
```javascript
topK: 5 // Number of chunks to retrieve
```

## 🐛 Troubleshooting

### "MongoDB connection failed"
- Check MongoDB is running: `mongosh`
- Verify `MONGODB_URI` in `.env.local`
- For Atlas, check IP whitelist

### "Chroma client error"
- Check Chroma is running: `curl http://localhost:8000/api/v1/heartbeat`
- Verify `CHROMA_URL` in `.env.local`
- Restart Chroma: `docker restart <container-id>`

### "Document upload fails"
- Check Cloudinary credentials
- Verify file size < 10MB
- Check supported formats (PDF, DOCX, TXT, MD)

### "No results from RAG"
- Ensure documents finished processing (status = "completed")
- Check Chroma collection has vectors
- Try different query phrasing

### "NextAuth error"
- Generate new `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Check `NEXTAUTH_URL` matches your domain
- For OAuth, verify client IDs and secrets

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js](https://next-auth.js.org)
- [ChromaDB Docs](https://docs.trychroma.com)
- [Google Gemini API](https://ai.google.dev)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Cloudinary Docs](https://cloudinary.com/documentation)

## 🤝 Contributing

This is a production-ready template. Feel free to:
- Add new document types
- Implement different AI providers
- Add export features
- Enhance UI/UX
- Add collaboration features

## 📄 License

MIT License - Use freely for personal or commercial projects.

## 🎉 Credits

Built with ❤️ as a production-ready clone of Google's NotebookLM.

---

**Ready to deploy!** Follow the setup instructions and you'll have a fully functional NotebookLM clone running in minutes.
