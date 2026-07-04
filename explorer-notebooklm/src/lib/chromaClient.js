import { ChromaClient } from 'chromadb';

const CHROMA_URL = process.env.CHROMA_URL || 'http://localhost:8000';

let chromaClient = null;

export async function getChromaClient() {
  if (!chromaClient) {
    chromaClient = new ChromaClient({
      path: CHROMA_URL,
    });
  }
  return chromaClient;
}

export async function getOrCreateCollection(notebookId) {
  const client = await getChromaClient();
  const collectionName = `notebook_${notebookId}`;
  
  try {
    const collection = await client.getOrCreateCollection({
      name: collectionName,
      metadata: { 
        description: `Vector embeddings for notebook ${notebookId}`,
        'hnsw:space': 'cosine'
      },
    });
    return collection;
  } catch (error) {
    console.error('Error creating Chroma collection:', error);
    throw error;
  }
}

export async function addVectorsToCollection(collectionName, vectors) {
  const client = await getChromaClient();
  
  try {
    const collection = await client.getCollection({ name: collectionName });
    
    await collection.add({
      ids: vectors.map(v => v.id),
      embeddings: vectors.map(v => v.embedding),
      metadatas: vectors.map(v => v.metadata),
      documents: vectors.map(v => v.document),
    });
    
    return true;
  } catch (error) {
    console.error('Error adding vectors to Chroma:', error);
    throw error;
  }
}

export async function queryVectors(collectionName, queryEmbedding, nResults = 5, filter = null) {
  const client = await getChromaClient();
  
  try {
    const collection = await client.getCollection({ name: collectionName });
    
    const queryParams = {
      queryEmbeddings: [queryEmbedding],
      nResults,
    };
    
    if (filter) {
      queryParams.where = filter;
    }
    
    const results = await collection.query(queryParams);
    
    return results;
  } catch (error) {
    console.error('Error querying vectors from Chroma:', error);
    throw error;
  }
}

export async function deleteCollection(collectionName) {
  const client = await getChromaClient();
  
  try {
    await client.deleteCollection({ name: collectionName });
    return true;
  } catch (error) {
    console.error('Error deleting Chroma collection:', error);
    throw error;
  }
}

export async function deleteDocumentVectors(collectionName, documentId) {
  const client = await getChromaClient();
  
  try {
    const collection = await client.getCollection({ name: collectionName });
    
    // Delete all vectors with matching documentId in metadata
    await collection.delete({
      where: { documentId: documentId },
    });
    
    return true;
  } catch (error) {
    console.error('Error deleting document vectors from Chroma:', error);
    throw error;
  }
}
