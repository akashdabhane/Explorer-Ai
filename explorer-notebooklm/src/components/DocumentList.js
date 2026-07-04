'use client';

import { useState, useEffect } from 'react';
import { FileText, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNotebookStore } from '@/lib/store';
import { formatDistanceToNow } from 'date-fns';

export default function DocumentList({ notebookId }) {
  const { documents, setDocuments, deleteDocument: removeDocument } = useNotebookStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (notebookId) {
      fetchDocuments();
    }
  }, [notebookId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/notebooks/${notebookId}/documents`);
      if (!response.ok) throw new Error('Failed to fetch documents');
      
      const { documents: docs } = await response.json();
      setDocuments(docs);
    } catch (error) {
      console.error('Fetch documents error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (!confirm('Delete this document? This will also remove all associated embeddings.')) return;

    try {
      const response = await fetch(`/api/documents/${docId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete document');

      removeDocument(docId);
    } catch (error) {
      console.error('Delete document error:', error);
      alert('Failed to delete document');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-2">Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No documents yet</p>
          <p className="text-xs mt-1">Upload files to get started</p>
        </div>
      ) : (
        documents.map((doc) => (
          <div
            key={doc._id}
            className="group flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition"
          >
            <FileText className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-gray-800 truncate">
                  {doc.originalFileName || doc.fileName}
                </p>
                {getStatusIcon(doc.status)}
              </div>
              
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="uppercase">{doc.fileType}</span>
                <span>•</span>
                <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                {doc.totalChunks > 0 && (
                  <>
                    <span>•</span>
                    <span>{doc.totalChunks} chunks</span>
                  </>
                )}
              </div>
              
              <p className="text-xs text-gray-400 mt-1">
                {formatDistanceToNow(new Date(doc.createdAt), { addSuffix: true })}
              </p>
              
              {doc.status === 'failed' && doc.errorMessage && (
                <p className="text-xs text-red-600 mt-1">
                  Error: {doc.errorMessage}
                </p>
              )}
            </div>

            <button
              onClick={() => handleDelete(doc._id)}
              className="hidden group-hover:block p-2 text-red-600 hover:bg-red-50 rounded transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))
      )}
    </div>
  );
}
