export function chunkText(text, chunkSize = 1000, overlap = 200) {
  if (!text || text.trim().length === 0) {
    return [];
  }

  const chunks = [];
  let startIndex = 0;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    const chunk = text.substring(startIndex, endIndex);
    
    chunks.push({
      content: chunk.trim(),
      startCharIndex: startIndex,
      endCharIndex: endIndex,
    });

    // Move forward by chunkSize minus overlap
    startIndex += chunkSize - overlap;
    
    // Prevent infinite loop if chunk is too small
    if (startIndex <= chunks[chunks.length - 1].startCharIndex) {
      break;
    }
  }

  return chunks;
}

export function chunkTextBySentences(text, maxChunkSize = 1000, overlap = 100) {
  if (!text || text.trim().length === 0) {
    return [];
  }

  // Split by sentence boundaries
  const sentenceRegex = /[.!?]+\s+/g;
  const sentences = text.split(sentenceRegex).filter(s => s.trim().length > 0);

  const chunks = [];
  let currentChunk = '';
  let currentStartIndex = 0;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];

    if (currentChunk.length + sentence.length > maxChunkSize && currentChunk.length > 0) {
      // Save current chunk
      chunks.push({
        content: currentChunk.trim(),
        startCharIndex: currentStartIndex,
        endCharIndex: currentStartIndex + currentChunk.length,
      });

      // Start new chunk with overlap
      const overlapText = currentChunk.slice(-overlap);
      currentChunk = overlapText + ' ' + sentence;
      currentStartIndex += currentChunk.length - overlapText.length - sentence.length - 1;
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }

  // Add last chunk
  if (currentChunk.trim().length > 0) {
    chunks.push({
      content: currentChunk.trim(),
      startCharIndex: currentStartIndex,
      endCharIndex: currentStartIndex + currentChunk.length,
    });
  }

  return chunks;
}

export function estimatePageNumber(charIndex, totalChars, totalPages) {
  if (!totalPages) return null;
  
  const charsPerPage = totalChars / totalPages;
  const pageNumber = Math.floor(charIndex / charsPerPage) + 1;
  
  return Math.min(pageNumber, totalPages);
}
