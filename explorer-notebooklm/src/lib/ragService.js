import connectDB from './mongodb';
import ChunkMetadata from '@/models/ChunkMetadata';
import Notebook from '@/models/Notebook';
import { generateEmbedding, constructRAGPrompt, generateAnswer, generateStreamingAnswer } from './geminiClient';
import { queryVectors } from './chromaClient';

export async function queryRAG({
  notebookId,
  query,
  topK = 5,
  temperature = 0.7,
}) {
  try {
    await connectDB();

    // 1. Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // 2. Search Chroma for relevant chunks
    const collectionName = `notebook_${notebookId}`;
    const results = await queryVectors(collectionName, queryEmbedding, topK);

    if (!results || !results.ids || results.ids[0].length === 0) {
      return {
        answer: 'Not found in your sources.',
        sources: [],
        noResults: true,
      };
    }

    // 3. Fetch chunk metadata from MongoDB
    const chunkIds = results.ids[0];
    const distances = results.distances[0];
    
    const chunks = await ChunkMetadata.find({
      chunkId: { $in: chunkIds },
    }).populate('documentId', 'fileName originalFileName');

    // 4. Organize chunks with relevance scores
    const retrievedChunks = chunkIds.map((id, idx) => {
      const chunk = chunks.find(c => c.chunkId === id);
      if (!chunk) return null;
      
      return {
        content: chunk.content,
        fileName: chunk.documentId?.originalFileName || chunk.documentId?.fileName || 'Unknown',
        pageNumber: chunk.pageNumber,
        chunkId: chunk.chunkId,
        documentId: chunk.documentId?._id,
        relevanceScore: 1 - distances[idx], // Convert distance to similarity
      };
    }).filter(Boolean);

    if (retrievedChunks.length === 0) {
      return {
        answer: 'Not found in your sources.',
        sources: [],
        noResults: true,
      };
    }

    // 5. Construct RAG prompt
    const prompt = constructRAGPrompt(query, retrievedChunks);

    // 6. Generate answer
    const answer = await generateAnswer(prompt, retrievedChunks, temperature);

    // Check if answer indicates not found
    if (answer.toLowerCase().includes('not found in your sources')) {
      return {
        answer: 'Not found in your sources.',
        sources: retrievedChunks,
        noResults: true,
      };
    }

    // 7. Save to conversation history
    await Notebook.findByIdAndUpdate(notebookId, {
      $push: {
        conversationHistory: [
          {
            role: 'user',
            content: query,
            timestamp: new Date(),
          },
          {
            role: 'assistant',
            content: answer,
            sources: retrievedChunks.map(chunk => ({
              documentId: chunk.documentId,
              fileName: chunk.fileName,
              pageNumber: chunk.pageNumber,
              chunkId: chunk.chunkId,
              relevanceScore: chunk.relevanceScore,
            })),
            timestamp: new Date(),
          },
        ],
      },
    });

    return {
      answer,
      sources: retrievedChunks,
      noResults: false,
    };
  } catch (error) {
    console.error('RAG query error:', error);
    throw error;
  }
}

export async function queryRAGStreaming({
  notebookId,
  query,
  topK = 5,
  temperature = 0.7,
}) {
  try {
    await connectDB();

    // 1. Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // 2. Search Chroma for relevant chunks
    const collectionName = `notebook_${notebookId}`;
    const results = await queryVectors(collectionName, queryEmbedding, topK);

    if (!results || !results.ids || results.ids[0].length === 0) {
      return {
        stream: null,
        sources: [],
        noResults: true,
        answer: 'Not found in your sources.',
      };
    }

    // 3. Fetch chunk metadata from MongoDB
    const chunkIds = results.ids[0];
    const distances = results.distances[0];
    
    const chunks = await ChunkMetadata.find({
      chunkId: { $in: chunkIds },
    }).populate('documentId', 'fileName originalFileName');

    // 4. Organize chunks with relevance scores
    const retrievedChunks = chunkIds.map((id, idx) => {
      const chunk = chunks.find(c => c.chunkId === id);
      if (!chunk) return null;
      
      return {
        content: chunk.content,
        fileName: chunk.documentId?.originalFileName || chunk.documentId?.fileName || 'Unknown',
        pageNumber: chunk.pageNumber,
        chunkId: chunk.chunkId,
        documentId: chunk.documentId?._id,
        relevanceScore: 1 - distances[idx],
      };
    }).filter(Boolean);

    if (retrievedChunks.length === 0) {
      return {
        stream: null,
        sources: [],
        noResults: true,
        answer: 'Not found in your sources.',
      };
    }

    // 5. Construct RAG prompt
    const prompt = constructRAGPrompt(query, retrievedChunks);

    // 6. Generate streaming answer
    const stream = await generateStreamingAnswer(prompt, temperature);

    return {
      stream,
      sources: retrievedChunks,
      noResults: false,
      query,
      notebookId,
    };
  } catch (error) {
    console.error('RAG streaming query error:', error);
    throw error;
  }
}

export async function saveStreamingResponse({
  notebookId,
  query,
  answer,
  sources,
}) {
  try {
    await connectDB();

    await Notebook.findByIdAndUpdate(notebookId, {
      $push: {
        conversationHistory: [
          {
            role: 'user',
            content: query,
            timestamp: new Date(),
          },
          {
            role: 'assistant',
            content: answer,
            sources: sources.map(chunk => ({
              documentId: chunk.documentId,
              fileName: chunk.fileName,
              pageNumber: chunk.pageNumber,
              chunkId: chunk.chunkId,
              relevanceScore: chunk.relevanceScore,
            })),
            timestamp: new Date(),
          },
        ],
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving streaming response:', error);
    throw error;
  }
}
