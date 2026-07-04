'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import NotebookList from '@/components/NotebookList';
import DocumentList from '@/components/DocumentList';
import ChatInterface from '@/components/ChatInterface';
import FileUpload from '@/components/FileUpload';
import { useNotebookStore } from '@/lib/store';
import { 
  Upload, 
  MessageSquare, 
  FileText, 
  Sparkles,
  LogOut,
  Loader2 
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { 
    notebooks, 
    currentNotebook, 
    setNotebooks, 
    setCurrentNotebook,
    isLoading,
    setIsLoading 
  } = useNotebookStore();
  
  const [activeTab, setActiveTab] = useState('chat');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchNotebooks();
    }
  }, [status, router]);

  const fetchNotebooks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/notebooks');
      if (!response.ok) throw new Error('Failed to fetch notebooks');
      
      const { notebooks: nbs } = await response.json();
      setNotebooks(nbs);
      
      if (nbs.length > 0 && !currentNotebook) {
        setCurrentNotebook(nbs[0]);
      }
    } catch (error) {
      console.error('Fetch notebooks error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAction = async (type) => {
    if (!currentNotebook) {
      alert('Please select a notebook first');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent(null);

    try {
      const response = await fetch(`/api/notebooks/${currentNotebook._id}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      if (!response.ok) throw new Error('Failed to generate');

      const { result, type: actionType } = await response.json();
      setGeneratedContent({ type: actionType, content: result });
      setActiveTab('generated');
    } catch (error) {
      console.error('Generate action error:', error);
      alert('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Notebooks */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-800">NotebookLM</h1>
          <button
            onClick={() => signOut()}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        <NotebookList onSelectNotebook={setCurrentNotebook} />
      </div>

      {/* Middle Panel - Documents & Actions */}
      <div className="w-96 bg-white border-r flex flex-col">
        {currentNotebook ? (
          <>
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {currentNotebook.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {currentNotebook.documentCount || 0} documents
              </p>
            </div>

            <div className="border-b bg-gray-50 p-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition ${
                    activeTab === 'documents'
                      ? 'bg-white text-blue-600 font-medium shadow-sm'
                      : 'text-gray-600 hover:bg-white/50'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-1" />
                  Documents
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 px-3 py-2 text-sm rounded-lg transition ${
                    activeTab === 'upload'
                      ? 'bg-white text-blue-600 font-medium shadow-sm'
                      : 'text-gray-600 hover:bg-white/50'
                  }`}
                >
                  <Upload className="w-4 h-4 inline mr-1" />
                  Upload
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'documents' && (
                <DocumentList notebookId={currentNotebook._id} />
              )}
              {activeTab === 'upload' && (
                <FileUpload
                  notebookId={currentNotebook._id}
                  onUploadComplete={() => {
                    setActiveTab('documents');
                    fetchNotebooks();
                  }}
                />
              )}
              {activeTab === 'generated' && generatedContent && (
                <div className="prose prose-sm max-w-none">
                  <h3 className="capitalize">{generatedContent.type.replace(/([A-Z])/g, ' $1')}</h3>
                  <div className="whitespace-pre-wrap">{generatedContent.content}</div>
                </div>
              )}
            </div>

            <div className="border-t p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-700 mb-2">Quick Actions:</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleGenerateAction('summary')}
                  disabled={isGenerating || !currentNotebook.documentCount}
                  className="px-3 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  Summary
                </button>
                <button
                  onClick={() => handleGenerateAction('studyGuide')}
                  disabled={isGenerating || !currentNotebook.documentCount}
                  className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  Study Guide
                </button>
                <button
                  onClick={() => handleGenerateAction('faq')}
                  disabled={isGenerating || !currentNotebook.documentCount}
                  className="px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  FAQ
                </button>
                <button
                  onClick={() => handleGenerateAction('timeline')}
                  disabled={isGenerating || !currentNotebook.documentCount}
                  className="px-3 py-2 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  Timeline
                </button>
              </div>
              {isGenerating && (
                <p className="text-xs text-center text-gray-500 mt-2">
                  Generating...
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select or create a notebook</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Panel - Chat */}
      <div className="flex-1 flex flex-col bg-white">
        {currentNotebook ? (
          <>
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">Chat</h2>
              </div>
            </div>
            <ChatInterface notebookId={currentNotebook._id} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Select a notebook to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
