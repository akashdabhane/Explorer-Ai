'use client';

import { create } from 'zustand';

export const useNotebookStore = create((set) => ({
  notebooks: [],
  currentNotebook: null,
  documents: [],
  conversationHistory: [],
  isLoading: false,
  error: null,

  setNotebooks: (notebooks) => set({ notebooks }),
  setCurrentNotebook: (notebook) => set({ currentNotebook: notebook }),
  setDocuments: (documents) => set({ documents }),
  setConversationHistory: (history) => set({ conversationHistory: history }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addNotebook: (notebook) =>
    set((state) => ({ notebooks: [notebook, ...state.notebooks] })),
  
  updateNotebook: (id, updates) =>
    set((state) => ({
      notebooks: state.notebooks.map((n) =>
        n._id === id ? { ...n, ...updates } : n
      ),
      currentNotebook:
        state.currentNotebook?._id === id
          ? { ...state.currentNotebook, ...updates }
          : state.currentNotebook,
    })),

  deleteNotebook: (id) =>
    set((state) => ({
      notebooks: state.notebooks.filter((n) => n._id !== id),
      currentNotebook: state.currentNotebook?._id === id ? null : state.currentNotebook,
    })),

  addDocument: (document) =>
    set((state) => ({ documents: [document, ...state.documents] })),

  deleteDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d._id !== id),
    })),

  addMessage: (message) =>
    set((state) => ({
      conversationHistory: [...state.conversationHistory, message],
    })),

  clearConversation: () => set({ conversationHistory: [] }),
}));
