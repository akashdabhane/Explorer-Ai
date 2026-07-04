import * as pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { marked } from 'marked';

export async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse.default(buffer);
    return {
      text: data.text,
      pages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

export async function extractTextFromDOCX(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return {
      text: result.value,
      pages: null, // DOCX doesn't have page concept
    };
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX');
  }
}

export async function extractTextFromTXT(buffer) {
  try {
    const text = buffer.toString('utf-8');
    return {
      text,
      pages: null,
    };
  } catch (error) {
    console.error('TXT extraction error:', error);
    throw new Error('Failed to extract text from TXT');
  }
}

export async function extractTextFromMarkdown(buffer) {
  try {
    const markdown = buffer.toString('utf-8');
    const html = marked(markdown);
    // For indexing, we'll use the raw markdown
    return {
      text: markdown,
      pages: null,
    };
  } catch (error) {
    console.error('Markdown extraction error:', error);
    throw new Error('Failed to extract text from Markdown');
  }
}

export async function extractText(buffer, fileType) {
  switch (fileType) {
    case 'pdf':
      return extractTextFromPDF(buffer);
    case 'docx':
      return extractTextFromDOCX(buffer);
    case 'txt':
      return extractTextFromTXT(buffer);
    case 'md':
      return extractTextFromMarkdown(buffer);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}
