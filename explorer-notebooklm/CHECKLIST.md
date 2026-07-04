# Pre-Launch Checklist

## Environment Setup ✓

### Required Services
- [ ] MongoDB running (local or Atlas URI configured)
- [ ] ChromaDB running on port 8000
- [ ] Cloudinary account created with credentials
- [ ] Google Gemini API key obtained

### Environment Variables (.env.local)
- [ ] MONGODB_URI
- [ ] NEXTAUTH_URL
- [ ] NEXTAUTH_SECRET (generated with `openssl rand -base64 32`)
- [ ] GOOGLE_GEMINI_API_KEY
- [ ] CLOUDINARY_CLOUD_NAME
- [ ] CLOUDINARY_API_KEY
- [ ] CLOUDINARY_API_SECRET
- [ ] CHROMA_URL

### Optional OAuth (if using)
- [ ] GOOGLE_CLIENT_ID
- [ ] GOOGLE_CLIENT_SECRET
- [ ] GITHUB_CLIENT_ID
- [ ] GITHUB_CLIENT_SECRET

## Testing Checklist

### Authentication
- [ ] Sign up with email works
- [ ] Sign in with email works
- [ ] OAuth sign in works (if configured)
- [ ] Protected routes redirect to signin
- [ ] Sign out works

### Notebooks
- [ ] Create new notebook
- [ ] Edit notebook title
- [ ] Delete notebook
- [ ] List notebooks in sidebar
- [ ] Select/switch notebooks

### Documents
- [ ] Upload PDF document
- [ ] Upload DOCX document
- [ ] Upload TXT document
- [ ] Upload Markdown document
- [ ] Document processing status updates
- [ ] Delete document
- [ ] List documents in notebook

### Chat/RAG
- [ ] Ask question and get response
- [ ] Response streams in real-time
- [ ] Sources are cited with file + page
- [ ] "Not found in sources" when no match
- [ ] Conversation history persists
- [ ] Clear conversation works

### Advanced Actions
- [ ] Generate summary
- [ ] Generate study guide
- [ ] Generate FAQ
- [ ] Generate timeline
- [ ] Content displays correctly

### UI/UX
- [ ] Responsive on mobile
- [ ] All icons load
- [ ] No console errors
- [ ] Loading states work
- [ ] Error messages display

## Deployment Checklist

### Pre-Deployment
- [ ] All environment variables documented
- [ ] .env.example is up to date
- [ ] README.md and SETUP.md are complete
- [ ] No sensitive data in code
- [ ] .gitignore includes .env.local

### MongoDB Atlas (Production)
- [ ] Atlas account created
- [ ] Cluster created
- [ ] Database user created
- [ ] IP whitelist configured (or 0.0.0.0/0)
- [ ] Connection string tested

### ChromaDB (Production)
- [ ] Chroma deployed on Railway/Render/VPS
- [ ] URL accessible
- [ ] Health check works
- [ ] CHROMA_URL updated in env

### Cloudinary (Production)
- [ ] Account verified
- [ ] Upload preset configured (optional)
- [ ] Credentials correct
- [ ] Test upload works

### Vercel Deployment
- [ ] Repository pushed to GitHub
- [ ] Project imported on Vercel
- [ ] All env variables added
- [ ] Build succeeds
- [ ] Domain configured (optional)

### Post-Deployment
- [ ] Test signup/signin on production
- [ ] Test document upload
- [ ] Test RAG query
- [ ] Monitor logs for errors
- [ ] Set up error tracking (Sentry)

## Performance Optimization

- [ ] Enable caching where appropriate
- [ ] Optimize image loading
- [ ] Compress uploads before sending
- [ ] Add loading skeletons
- [ ] Implement pagination for large datasets

## Security Checklist

- [ ] NEXTAUTH_SECRET is strong and unique
- [ ] MongoDB connection uses auth
- [ ] Cloudinary credentials not exposed
- [ ] API routes check authentication
- [ ] File uploads validated (type, size)
- [ ] Rate limiting implemented
- [ ] CORS configured correctly

## Documentation

- [ ] README.md complete
- [ ] SETUP.md detailed
- [ ] API routes documented
- [ ] Architecture diagram (optional)
- [ ] Contributing guidelines (optional)

## Monitoring & Maintenance

- [ ] Set up error tracking (Sentry, LogRocket)
- [ ] Configure logging
- [ ] Set up uptime monitoring
- [ ] Plan backup strategy
- [ ] Monitor API usage/costs

---

## Quick Test Commands

```bash
# Test MongoDB
mongosh

# Test ChromaDB
curl http://localhost:8000/api/v1/heartbeat

# Test Next.js
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Common Issues

**Build fails**: Check all imports, fix syntax errors  
**Auth not working**: Verify NEXTAUTH_SECRET and NEXTAUTH_URL  
**Upload fails**: Check Cloudinary credentials  
**RAG not working**: Ensure Chroma is running and documents processed  
**MongoDB errors**: Check connection string and network access

---

**Once all items are checked, you're ready to launch! 🚀**
