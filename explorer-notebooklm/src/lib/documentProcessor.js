import connectDB from './mongodb';
import Document from '@/models/Document';
import ChunkMetadata from '@/models/ChunkMetadata';
import Notebook from '@/models/Notebook';
import { extractText } from './textExtraction';
import { chunkText, chunkTextBySentences, estimatePageNumber } from './chunking';
import { generateEmbeddings } from './geminiClient';
import { getOrCreateCollection, addVectorsToCollection } from './chromaClient';
import { uploadToCloudinary, deleteFromCloudinary } from './cloudinaryClient';
import { v4 as uuidv4 } from 'uuid';

export async function processDocument({
  userId,
  notebookId,
  file,
  fileName,
  fileType,
}) {
  let document = null;
  
  try {
    await connectDB();

    // 1. Upload to Cloudinary
    const { url: cloudinaryUrl, publicId } = await uploadToCloudinary(
      file,
      fileName
    );

    // 2. Create document record
    document = await Document.create({
      userId,
      notebookId,
      fileName,
      originalFileName: fileName,
      fileType,
      fileSize: file.length,
      cloudinaryUrl,
      cloudinaryPublicId: publicId,
      status: 'processing',
    });

    // 3. Extract text
    const { text, pages } = await extractText(file, fileType);
    
    await Document.findByIdAndUpdate(document._id, {
      'processingMetadata.extractedAt': new Date(),
      totalPages: pages,
    });

    // 4. Chunk text
    const chunks = chunkTextBySentences(text, 1000, 200);
    
    await Document.findByIdAndUpdate(document._id, {
      'processingMetadata.chunkedAt': new Date(),
      totalChunks: chunks.length,
    });

    // 5. Generate embeddings
    const chunkTexts = chunks.map(c => c.content);
    const embeddings = await generateEmbeddings(chunkTexts);
    
    await Document.findByIdAndUpdate(document._id, {
      'processingMetadata.embeddedAt': new Date(),
    });

    // 6. Store in Chroma
    const collection = await getOrCreateCollection(notebookId);
    const collectionName = `notebook_${notebookId}`;
    
    const vectors = chunks.map((chunk, idx) => {
      const chunkId = uuidv4();
      const pageNumber = estimatePageNumber(
        chunk.startCharIndex,
        text.length,
        pages
      );
      
      return {
        id: chunkId,
        embedding: embeddings[idx],
        document: chunk.content,
        metadata: {
          documentId: document._id.toString(),
          fileName,
          pageNumber: pageNumber || 0,
          chunkIndex: idx,
        },
      };
    });

    await addVectorsToCollection(collectionName, vectors);

    // 7. Store chunk metadata in MongoDB
    const chunkMetadata = chunks.map((chunk, idx) => ({
      userId,
      notebookId,
      documentId: document._id,
      chunkId: vectors[idx].id,
      chunkIndex: idx,
      content: chunk.content,
      pageNumber: vectors[idx].metadata.pageNumber,
      startCharIndex: chunk.startCharIndex,
      endCharIndex: chunk.endCharIndex,
      chromaCollectionId: collectionName,
    }));

    await ChunkMetadata.insertMany(chunkMetadata);

    await Document.findByIdAndUpdate(document._id, {
      'processingMetadata.indexedAt': new Date(),
      status: 'completed',
    });

    // 8. Update notebook document count
    await Notebook.findByIdAndUpdate(notebookId, {
      $inc: { documentCount: 1 },
    });

    return {
      success: true,
      document,
      chunksCreated: chunks.length,
    };
  } catch (error) {
    console.error('Document processing error:', error);
    
    // Update document status to failed
    if (document) {
      await Document.findByIdAndUpdate(document._id, {
        status: 'failed',
        errorMessage: error.message,
      });
    }
    
    throw error;
  }
}

export async function deleteDocument(documentId) {
  try {
    await connectDB();

    const document = await Document.findById(documentId);
    if (!document) {
      throw new Error('Document not found');
    }

    // 1. Delete from Cloudinary
    await deleteFromCloudinary(document.cloudinaryPublicId);

    // 2. Delete vectors from Chroma
    const collectionName = `notebook_${document.notebookId}`;
    const { deleteDocumentVectors } = await import('./chromaClient');
    await deleteDocumentVectors(collectionName, documentId);

    // 3. Delete chunk metadata
    await ChunkMetadata.deleteMany({ documentId });

    // 4. Delete document
    await Document.findByIdAndDelete(documentId);

    // 5. Update notebook document count
    await Notebook.findByIdAndUpdate(document.notebookId, {
      $inc: { documentCount: -1 },
    });

    return { success: true };
  } catch (error) {
    console.error('Document deletion error:', error);
    throw error;
  }
}
