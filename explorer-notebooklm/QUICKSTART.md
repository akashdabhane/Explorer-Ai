# Quick Start Guide - NotebookLM Clone

Get up and running in 10 minutes! ⚡

## Prerequisites Checklist

Before starting, ensure you have:
- [ ] Node.js 18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Git installed (optional, for version control)

## Step-by-Step Setup

### 1. Install Dependencies (1 minute)

```bash
cd explore-notebooklm-clone
npm install
```

Expected: ~500 packages installed successfully.

### 2. Set Up MongoDB (2 minutes)

**Option A: Local MongoDB**
```bash
# Install MongoDB Community Edition
# Visit: https://www.mongodb.com/try/download/community

# Start MongoDB
mongod --dbpath /path/to/data

# Test connection
mongosh
```

**Option B: MongoDB Atlas (Cloud)**
```bash
# 1. Visit https://www.mongodb.com/cloud/atlas
# 2. Create free account
# 3. Create cluster (M0 free tier)
# 4. Add database user
# 5. Whitelist your IP (or 0.0.0.0/0)
# 6. Get connection string
```

### 3. Start ChromaDB (1 minute)

```bash
# Pull Docker image
docker pull chromadb/chroma

# Run ChromaDB
docker run -p 8000:8000 chromadb/chroma

# Verify: http://localhost:8000/api/v1/heartbeat
# Should return: {"nanosecond heartbeat": ...}
```

### 4. Get API Keys (3 minutes)

**Gemini API Key:**
1. Visit https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

**Cloudinary:**
1. Visit https://cloudinary.com/users/register/free
2. Sign up for free account
3. Go to Dashboard
4. Copy: Cloud Name, API Key, API Secret

### 5. Configure Environment (2 minutes)

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local
# Use any text editor (VS Code, nano, vim, etc.)
```

Paste your credentials:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/notebooklm-clone
# or Atlas: mongodb+srv://username:password@cluster.mongodb.net/notebooklm

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here-use-openssl-rand-base64-32

# Gemini
GOOGLE_GEMINI_API_KEY=your-gemini-key-here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Chroma
CHROMA_URL=http://localhost:8000
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 6. Start Development Server (1 minute)

```bash
npm run dev
```

Expected output:
```
▲ Next.js 16.1.4
- Local:        http://localhost:3000
✓ Ready in X.Xs
```

### 7. Test the Application (5 minutes)

**Visit:** http://localhost:3000

**Test Flow:**
1. ✅ Sign Up with email/password
2. ✅ Create a new notebook
3. ✅ Upload a test document (PDF/TXT)
4. ✅ Wait for processing (~30 seconds)
5. ✅ Ask a question about the document
6. ✅ See streaming AI response with sources

## Common Quick Fixes

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh
# or for Atlas, check connection string
```

### ChromaDB Not Found
```bash
# Check Docker is running
docker ps

# Restart Chroma
docker restart <container-id>

# Test health
curl http://localhost:8000/api/v1/heartbeat
```

### Port Already in Use
```bash
# Next.js (default 3000)
npm run dev -- -p 3001

# Or kill process using port
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -ti:3000 | xargs kill
```

### API Key Issues
```bash
# Test Gemini API key
curl https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent \
  -H 'Content-Type: application/json' \
  -d '{"text": "test"}' \
  -H "x-goog-api-key: YOUR_API_KEY"

# Should return embedding array
```

## Verification Checklist

After setup, verify:
- [ ] Can access http://localhost:3000
- [ ] Sign up works (creates user in MongoDB)
- [ ] Sign in works (redirects to dashboard)
- [ ] Can create notebook
- [ ] Can upload document
- [ ] Document processes successfully
- [ ] Can ask questions and get answers
- [ ] Sources are cited correctly

## Test Document Samples

Use these to test:

**test.txt**
```
The Eiffel Tower was completed in 1889. It stands 330 meters tall 
and was designed by Gustave Eiffel for the 1889 World's Fair in Paris.
```

**Test Query**: "When was the Eiffel Tower built?"  
**Expected**: Answer should cite 1889 with source reference

## Quick Commands Reference

```bash
# Install
npm install

# Development
npm run dev

# Production build
npm run build
npm start

# Lint
npm run lint

# Check MongoDB
mongosh

# Check Chroma
curl http://localhost:8000/api/v1/heartbeat

# Generate secret
openssl rand -base64 32
```

## Troubleshooting Decision Tree

```
Issue: Can't access localhost:3000
├─ Is dev server running? → npm run dev
├─ Port in use? → Use different port (-p 3001)
└─ Firewall blocking? → Check firewall settings

Issue: Upload fails
├─ Cloudinary configured? → Check credentials
├─ File too large? → Max 10MB
└─ Wrong file type? → PDF, DOCX, TXT, MD only

Issue: No AI response
├─ Chroma running? → docker ps
├─ Document processed? → Check status
├─ Gemini key valid? → Test API key
└─ MongoDB connected? → mongosh

Issue: Authentication fails
├─ NEXTAUTH_SECRET set? → openssl rand -base64 32
├─ NEXTAUTH_URL correct? → http://localhost:3000
└─ MongoDB connected? → Check connection
```

## Next Steps After Setup

1. **Read SETUP.md** for detailed configuration
2. **Check ARCHITECTURE.md** to understand the system
3. **Review CHECKLIST.md** before deploying
4. **Customize** UI colors, chunk size, etc.
5. **Deploy** to Vercel when ready

## Getting Help

- 📖 Check [SETUP.md](./SETUP.md) for detailed docs
- 🏗️ Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- ✅ Use [CHECKLIST.md](./CHECKLIST.md) for deployment
- 🐛 Common issues documented in SETUP.md#troubleshooting

## Production Deployment

When ready to deploy:

1. Use MongoDB Atlas (not local)
2. Deploy Chroma on Railway/Render
3. Push to GitHub
4. Deploy on Vercel
5. Add all env variables
6. Test in production

See **SETUP.md** for complete deployment guide.

---

## 🎉 You're Ready!

If all steps completed successfully, you now have a fully functional NotebookLM clone running locally!

**Try it out:**
1. Create a notebook
2. Upload a document
3. Ask questions
4. Get AI-powered answers!

**Need help?** Check the troubleshooting section or review the full documentation.

---

**Total Setup Time: ~10 minutes** ⏱️  
**Difficulty: Easy** 🟢  
**Prerequisites: Node.js, Docker** 📦
