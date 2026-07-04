# NotebookLM Clone - AI-Powered Document Assistant

A production-ready, full-stack clone of Google's NotebookLM built with Next.js 14+. Upload documents, ask questions, and get AI-powered answers strictly from your sources using RAG (Retrieval-Augmented Generation).

![Tech Stack](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)

## ✨ Features

- 🔐 **Authentication**: NextAuth with credentials + OAuth (Google, GitHub)
- 📚 **Multi-Notebook Management**: Organize documents by topic
- 📄 **Document Upload**: PDF, DOCX, TXT, Markdown support (up to 10MB)
- 🤖 **RAG Pipeline**: Retrieval-Augmented Generation with Gemini AI
- 💬 **Streaming Chat**: Real-time AI responses with source citations
- 🎯 **Advanced Actions**: Generate summaries, study guides, FAQs, timelines
- 🔍 **Vector Search**: ChromaDB for semantic similarity
- ☁️ **Cloud Storage**: Cloudinary for secure file hosting
- 📱 **Responsive UI**: Clean, modern interface inspired by NotebookLM

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- ChromaDB (Docker recommended)
- Cloudinary account
- Google Gemini API key

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local

# 3. Configure .env.local with your keys

# 4. Start MongoDB (if local)
mongod --dbpath /path/to/data

# 5. Start ChromaDB
docker run -p 8000:8000 chromadb/chroma

# 6. Run development server
npm run dev
```

Visit http://localhost:3000

## 📖 Documentation

For detailed setup instructions, deployment guide, and API documentation, see [SETUP.md](./SETUP.md).

## 🏗️ Architecture

**Frontend**: Next.js 14 (App Router), React 19, Tailwind CSS, Zustand  
**Backend**: Next.js API Routes, Server Actions  
**Database**: MongoDB + Mongoose  
**Vector DB**: ChromaDB  
**AI**: Google Gemini API (embeddings + generation)  
**Storage**: Cloudinary  
**Auth**: NextAuth.js

## 🔑 Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/notebooklm-clone
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
GOOGLE_GEMINI_API_KEY=your-gemini-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
CHROMA_URL=http://localhost:8000
```

See `.env.example` for full configuration.

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import on Vercel
3. Add environment variables
4. Deploy

**Note**: Use MongoDB Atlas and deploy Chroma on Railway/Render for production.

See [SETUP.md](./SETUP.md) for detailed deployment instructions.

## 📚 Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 14+ (App Router) |
| Language | JavaScript |
| Auth | NextAuth.js |
| Database | MongoDB + Mongoose |
| Vector DB | ChromaDB |
| File Storage | Cloudinary |
| AI Provider | Google Gemini API |
| State Management | Zustand |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| File Parsing | pdf-parse, mammoth, marked |
| HTTP Client | Fetch API |

## 🎯 Core Features Explained

### RAG Pipeline

1. **Upload**: User uploads document
2. **Extract**: Text extracted from PDF/DOCX/TXT/MD
3. **Chunk**: Text split into overlapping chunks
4. **Embed**: Chunks converted to vectors via Gemini
5. **Store**: Vectors stored in Chroma, metadata in MongoDB
6. **Query**: User question embedded and matched against vectors
7. **Generate**: Gemini generates answer from retrieved context
8. **Cite**: Response includes source file + page number

### Document Processing

- Automatic text extraction
- Intelligent chunking (1000 chars, 200 overlap)
- Background processing
- Status tracking (processing → completed → failed)
- Error handling and retry logic

### Advanced Actions

- **Summarize**: Comprehensive document summary
- **Study Guide**: Key concepts, definitions, review questions
- **FAQ**: Auto-generated Q&A from content
- **Timeline**: Chronological events extracted

## 🔧 Customization

**Chunk Size**: Edit `src/lib/chunking.js`  
**AI Temperature**: Modify `src/lib/ragService.js`  
**Top-K Results**: Change in `queryRAG()` function  
**UI Theme**: Customize Tailwind config  

## 🐛 Common Issues

**MongoDB Connection Failed**
- Check MongoDB is running
- Verify `MONGODB_URI`
- For Atlas, whitelist your IP

**Chroma Client Error**
- Ensure Chroma is running on port 8000
- Test: `curl http://localhost:8000/api/v1/heartbeat`

**Document Upload Fails**
- Check Cloudinary credentials
- Verify file size < 10MB
- Supported: PDF, DOCX, TXT, MD

See [SETUP.md](./SETUP.md#troubleshooting) for more solutions.

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── (auth)/      # Auth pages (signin, signup)
│   ├── (dashboard)/ # Main dashboard
│   └── api/         # API routes
├── components/       # React components
├── lib/             # Core logic (RAG, DB, AI)
└── models/          # MongoDB schemas
```

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

MIT License - Free for personal and commercial use.

## 🙏 Acknowledgments

- Inspired by Google's NotebookLM
- Built with modern web technologies
- Designed for production deployment

## 📞 Support

For issues and questions:
- Check [SETUP.md](./SETUP.md)
- Open a GitHub issue
- Review troubleshooting guide

---

**Built with ❤️ | Ready for Production | SaaS-Grade Quality**
