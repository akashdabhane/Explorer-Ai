'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, FileText, Sparkles } from 'lucide-react';
import { useNotebookStore } from '@/lib/store';
import ReactMarkdown from 'react-markdown';

export default function ChatInterface({ notebookId }) {
  const { conversationHistory, addMessage, setConversationHistory } = useNotebookStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [currentSources, setCurrentSources] = useState([]);
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (notebookId) {
      fetchConversation();
    }
  }, [notebookId]);

  useEffect(() => {
    scrollToBottom();
  }, [conversationHistory, streamingMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversation = async () => {
    try {
      const response = await fetch(`/api/notebooks/${notebookId}/conversation`);
      if (!response.ok) throw new Error('Failed to fetch conversation');
      
      const { conversationHistory: history } = await response.json();
      setConversationHistory(history);
    } catch (error) {
      console.error('Fetch conversation error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to UI
    addMessage({
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    });

    setIsLoading(true);
    setStreamingMessage('');
    setCurrentSources([]);

    try {
      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMessage,
          notebookId,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Check if it's a streaming response
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('text/event-stream')) {
        // Handle streaming response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.type === 'sources') {
                  setCurrentSources(data.sources);
                } else if (data.type === 'text') {
                  fullText += data.text;
                  setStreamingMessage(fullText);
                } else if (data.type === 'done') {
                  // Add complete assistant message
                  addMessage({
                    role: 'assistant',
                    content: fullText,
                    sources: currentSources,
                    timestamp: new Date(),
                  });
                  setStreamingMessage('');
                } else if (data.type === 'error') {
                  throw new Error(data.error);
                }
              } catch (parseError) {
                console.error('Parse error:', parseError);
              }
            }
          }
        }
      } else {
        // Handle non-streaming response
        const data = await response.json();
        addMessage({
          role: 'assistant',
          content: data.answer,
          sources: data.sources || [],
          timestamp: new Date(),
        });
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
      } else {
        console.error('Chat error:', error);
        addMessage({
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        });
      }
    } finally {
      setIsLoading(false);
      setStreamingMessage('');
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversationHistory.length === 0 && !streamingMessage ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <Sparkles className="w-16 h-16 mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">Ask me anything</h3>
            <p className="text-sm max-w-md">
              I'll answer based on the documents you've uploaded to this notebook.
            </p>
          </div>
        ) : (
          <>
            {conversationHistory.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="prose prose-sm max-w-none">
                    {message.role === 'user' ? (
                      <p>{message.content}</p>
                    ) : (
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    )}
                  </div>
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="text-xs font-semibold mb-2">Sources:</p>
                      <div className="space-y-1">
                        {message.sources.map((source, srcIdx) => (
                          <div
                            key={srcIdx}
                            className="flex items-center gap-2 text-xs"
                          >
                            <FileText className="w-3 h-3" />
                            <span>
                              {source.fileName}
                              {source.pageNumber && ` (Page ${source.pageNumber})`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {streamingMessage && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-4 bg-gray-100 text-gray-800">
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{streamingMessage}</ReactMarkdown>
                  </div>
                  {currentSources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-300">
                      <p className="text-xs font-semibold mb-2">Sources:</p>
                      <div className="space-y-1">
                        {currentSources.map((source, srcIdx) => (
                          <div
                            key={srcIdx}
                            className="flex items-center gap-2 text-xs"
                          >
                            <FileText className="w-3 h-3" />
                            <span>
                              {source.fileName}
                              {source.pageNumber && ` (Page ${source.pageNumber})`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
