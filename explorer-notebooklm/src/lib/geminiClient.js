import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('⚠️  GOOGLE_GEMINI_API_KEY not set');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

// Model for embeddings
const embeddingModel = 'text-embedding-004';

// Model for text generation
const textModel = 'gemini-1.5-pro';

export async function generateEmbedding(text) {
  try {
    const model = genAI.getGenerativeModel({ model: embeddingModel });
    
    const result = await model.embedContent(text);
    const embedding = result.embedding;
    
    return embedding.values;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

export async function generateEmbeddings(texts) {
  try {
    const model = genAI.getGenerativeModel({ model: embeddingModel });
    
    const embeddings = await Promise.all(
      texts.map(async (text) => {
        const result = await model.embedContent(text);
        return result.embedding.values;
      })
    );
    
    return embeddings;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}

export async function generateAnswer(prompt, context = [], temperature = 0.7) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: textModel,
      generationConfig: {
        temperature,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error('Error generating answer:', error);
    throw error;
  }
}

export async function generateStreamingAnswer(prompt, temperature = 0.7) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: textModel,
      generationConfig: {
        temperature,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });
    
    const result = await model.generateContentStream(prompt);
    
    return result.stream;
  } catch (error) {
    console.error('Error generating streaming answer:', error);
    throw error;
  }
}

export function constructRAGPrompt(query, retrievedChunks) {
  const contextText = retrievedChunks
    .map((chunk, idx) => {
      return `[Source ${idx + 1}] (${chunk.fileName}, Page ${chunk.pageNumber || 'N/A'}):\n${chunk.content}`;
    })
    .join('\n\n');
  
  const prompt = `You are a helpful AI assistant that answers questions based ONLY on the provided source documents. 

IMPORTANT RULES:
1. Answer ONLY using information from the sources below
2. If the answer is not in the sources, respond with: "Not found in your sources."
3. Cite which source(s) you used (e.g., "According to Source 1...")
4. Be concise but comprehensive
5. Do not make up or infer information not present in the sources

SOURCES:
${contextText}

QUESTION:
${query}

ANSWER:`;

  return prompt;
}

export function constructSummarizePrompt(chunks, type = 'summary') {
  const contextText = chunks
    .map((chunk, idx) => `[Chunk ${idx + 1}]:\n${chunk.content}`)
    .join('\n\n');
  
  const prompts = {
    summary: `Summarize the following content comprehensively. Include all key points, main ideas, and important details.\n\n${contextText}`,
    
    studyGuide: `Create a detailed study guide from the following content. Include:
- Key concepts and definitions
- Important facts and figures
- Main arguments and theories
- Suggested review questions

Content:
${contextText}`,
    
    faq: `Generate a comprehensive FAQ (Frequently Asked Questions) from the following content. Create 10-15 questions and answers covering the main topics.

Content:
${contextText}`,
    
    timeline: `Extract and create a chronological timeline from the following content. Include dates, events, and brief descriptions. If no explicit dates are found, organize by sequence of events.

Content:
${contextText}`,
  };
  
  return prompts[type] || prompts.summary;
}
