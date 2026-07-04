'use client';

import { useState } from 'react';
import { Plus, Book, Trash2, Edit2, Check, X } from 'lucide-react';
import { useNotebookStore } from '@/lib/store';

export default function NotebookList({ onSelectNotebook }) {
  const { notebooks, currentNotebook, addNotebook, updateNotebook, deleteNotebook } = useNotebookStore();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const response = await fetch('/api/notebooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!response.ok) throw new Error('Failed to create notebook');

      const { notebook } = await response.json();
      addNotebook(notebook);
      setNewTitle('');
      setIsCreating(false);
      onSelectNotebook(notebook);
    } catch (error) {
      console.error('Create notebook error:', error);
      alert('Failed to create notebook');
    }
  };

  const handleUpdate = async (id) => {
    if (!editTitle.trim()) {
      setEditingId(null);
      return;
    }

    try {
      const response = await fetch(`/api/notebooks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle }),
      });

      if (!response.ok) throw new Error('Failed to update notebook');

      const { notebook } = await response.json();
      updateNotebook(id, notebook);
      setEditingId(null);
    } catch (error) {
      console.error('Update notebook error:', error);
      alert('Failed to update notebook');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this notebook and all its documents?')) return;

    try {
      const response = await fetch(`/api/notebooks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete notebook');

      deleteNotebook(id);
    } catch (error) {
      console.error('Delete notebook error:', error);
      alert('Failed to delete notebook');
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <button
          onClick={() => setIsCreating(true)}
          className="w-full flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <Plus className="w-5 h-5" />
          New Notebook
        </button>
      </div>

      {isCreating && (
        <div className="p-4 border-b bg-gray-50">
          <form onSubmit={handleCreate} className="flex flex-col gap-2">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Notebook title..."
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setNewTitle('');
                }}
                className="flex-1 px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {notebooks.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Book className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No notebooks yet</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {notebooks.map((notebook) => (
              <div
                key={notebook._id}
                className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer transition ${
                  currentNotebook?._id === notebook._id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  if (editingId !== notebook._id) {
                    onSelectNotebook(notebook);
                  }
                }}
              >
                <Book className="w-5 h-5 text-gray-600 flex-shrink-0" />
                
                {editingId === notebook._id ? (
                  <div className="flex-1 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleUpdate(notebook._id)}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">
                        {notebook.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {notebook.documentCount || 0} documents
                      </p>
                    </div>
                    <div className="hidden group-hover:flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(notebook._id);
                          setEditTitle(notebook.title);
                        }}
                        className="p-1 text-gray-600 hover:bg-gray-200 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notebook._id);
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
